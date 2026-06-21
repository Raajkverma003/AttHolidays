import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PackageService, TravelPackage } from '../../core/services/package.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-builder',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCard,
    MatCardContent,
    MatButton,
    MatIcon,
    MatStepperModule,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatFormField,
    MatLabel,
    MatInput,
    MatProgressSpinner
  ],
  templateUrl: './custom-builder.html',
  styleUrl: './custom-builder.css'
})
export class CustomBuilder implements OnInit {
  private readonly packageService = inject(PackageService);
  private readonly bookingService = inject(BookingService);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly packages = signal<TravelPackage[]>([]);
  protected readonly selectedPackage = signal<TravelPackage | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);

  // Stepper groups
  protected readonly destForm = this.fb.group({
    packageId: ['', Validators.required]
  });

  protected readonly configForm = this.fb.group({
    starCategory: [4, Validators.required],
    airportPickup: [false],
    breakfast: [false],
    dinnerBuffet: [false],
    visaServices: [false],
    activities: this.fb.group({})
  });

  protected readonly dateForm = this.fb.group({
    travelDate: ['', Validators.required]
  });

  protected readonly configValue = signal<any>({
    starCategory: 4,
    airportPickup: false,
    breakfast: false,
    dinnerBuffet: false,
    visaServices: false,
    activities: {}
  });

  // Dynamic price calculation
  protected readonly calculatedPrice = computed(() => {
    const pkg = this.selectedPackage();
    if (!pkg) return 0;

    let base = pkg.price;
    const config = this.configValue();

    // Hotel adjustment
    if (config.starCategory === 3) base -= 100;
    if (config.starCategory === 5) base += 250;

    // Inclusions adjustments
    if (config.airportPickup) base += 50;
    if (config.breakfast) base += 30;
    if (config.dinnerBuffet) base += 75;
    if (config.visaServices) base += 120;

    // Activities adjustments (+$40 for each selected activity)
    if (config.activities) {
      const activeCount = Object.values(config.activities).filter(Boolean).length;
      base += activeCount * 40;
    }

    return base;
  });

  ngOnInit() {
    this.fetchPackages();
    // Listen to config form changes reactively to trigger computed signal updates
    this.configForm.valueChanges.subscribe(val => {
      this.configValue.set(val || {});
    });
  }

  fetchPackages() {
    this.isLoading.set(true);
    this.packageService.getPackages().subscribe({
      next: (data) => {
        this.packages.set(data);
        this.isLoading.set(false);

        // Preselect base package if passed as queryParam
        const baseId = this.route.snapshot.queryParams['basePackage'];
        if (baseId) {
          const match = data.find(p => p._id === baseId);
          if (match) {
            this.destForm.patchValue({ packageId: baseId });
            this.onPackageSelect(baseId);
          }
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  onPackageSelect(packageId: string) {
    const pkg = this.packages().find(p => p._id === packageId) || null;
    this.selectedPackage.set(pkg);

    if (pkg) {
      // Rebuild activities subgroup dynamic controllers
      const actGroup = this.fb.group({});
      pkg.activities.forEach(act => {
        actGroup.addControl(act, this.fb.control(true)); // check them by default
      });

      this.configForm.setControl('activities', actGroup);

      // Reset base inclusions based on package defaults
      this.configForm.patchValue({
        starCategory: pkg.starCategory,
        airportPickup: pkg.inclusions.airportPickup,
        breakfast: pkg.inclusions.breakfast,
        dinnerBuffet: pkg.inclusions.dinnerBuffet,
        visaServices: pkg.inclusions.visaServices
      });

      // Sync configuration signal immediately with current form values
      this.configValue.set(this.configForm.value || {});
    }
  }

  submitCustomBooking() {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please sign in to book your custom trip.', 'Dismiss', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    if (this.destForm.invalid || this.configForm.invalid || this.dateForm.invalid) {
      this.snackBar.open('Please complete all builder steps.', 'Dismiss', { duration: 3000 });
      return;
    }

    const pkg = this.selectedPackage();
    if (!pkg || !pkg._id) return;

    this.isSubmitting.set(true);
    const config = this.configForm.value;
    const dateVal = this.dateForm.value.travelDate;

    // Compile active activities array
    const selectedActs: string[] = [];
    if (config.activities) {
      Object.entries(config.activities).forEach(([act, isSelected]) => {
        if (isSelected) selectedActs.push(act);
      });
    }

    const bookingPayload = {
      packageId: pkg._id,
      travelDate: dateVal!,
      isCustomized: true,
      customSelections: {
        starCategory: Number(config.starCategory),
        inclusions: {
          airportPickup: !!config.airportPickup,
          breakfast: !!config.breakfast,
          dinnerBuffet: !!config.dinnerBuffet,
          visaServices: !!config.visaServices
        },
        activities: selectedActs
      },
      price: this.calculatedPrice()
    };

    this.bookingService.createBooking(bookingPayload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.snackBar.open('Custom travel request saved! Admin will review details.', 'Dismiss', { duration: 4000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.snackBar.open(err.error?.message || 'Submission failed.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  getActivitiesControls() {
    const actGroup = this.configForm.get('activities') as FormGroup;
    return actGroup ? Object.keys(actGroup.controls) : [];
  }
}
