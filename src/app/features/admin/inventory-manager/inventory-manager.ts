import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { PackageService, TravelPackage } from '../../../core/services/package.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inventory-manager',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UpperCasePipe,
    MatCard,
    MatCardContent,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatProgressSpinner
  ],
  templateUrl: './inventory-manager.html',
  styleUrl: './inventory-manager.css'
})
export class InventoryManager implements OnInit {
  private readonly packageService = inject(PackageService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly packages = signal<TravelPackage[]>([]);
  protected readonly isLoadingPackages = signal(true);
  
  protected readonly isEditing = signal(false);
  protected readonly currentEditId = signal<string | null>(null);
  protected readonly formSubmitting = signal(false);

  // CRUD Package Form
  protected readonly packageForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    price: [999, [Validators.required, Validators.min(100)]],
    location: ['', Validators.required],
    starCategory: [4, Validators.required],
    travelType: ['standard', Validators.required],
    airportPickup: [false],
    breakfast: [false],
    dinnerBuffet: [false],
    visaServices: [false],
    wifi: [false],
    pool: [false],
    gym: [false],
    bar: [false],
    activities: ['', Validators.required], // Comma-separated
    touristPlaces: ['', Validators.required], // Comma-separated
    images: ['', Validators.required], // Comma-separated
    isLastMinute: [false],
    lastMinutePrice: [null as number | null],
    itineraryRaw: ['', Validators.required] // Day-by-day JSON or text layout
  });

  ngOnInit() {
    this.fetchPackages();
  }

  fetchPackages() {
    this.isLoadingPackages.set(true);
    this.packageService.getPackages().subscribe({
      next: (data) => {
        this.packages.set(data);
        this.isLoadingPackages.set(false);
      },
      error: () => this.isLoadingPackages.set(false)
    });
  }

  onSubmit() {
    if (this.packageForm.invalid) return;

    this.formSubmitting.set(true);
    const formVals = this.packageForm.value;

    // Parse Comma-separated fields
    const activitiesArr = formVals.activities!.split(',').map(s => s.trim()).filter(Boolean);
    const touristPlacesArr = formVals.touristPlaces!.split(',').map(s => s.trim()).filter(Boolean);
    const imagesArr = formVals.images!.split(',').map(s => s.trim()).filter(Boolean);

    // Parse Itinerary Days
    let itineraryArr: any[] = [];
    try {
      itineraryArr = JSON.parse(formVals.itineraryRaw!);
    } catch (e) {
      // Fallback: parse lines in format "Day X: Title - Details"
      const lines = formVals.itineraryRaw!.split('\n').filter(Boolean);
      lines.forEach((line, index) => {
        const dNum = index + 1;
        const dashIdx = line.indexOf('-');
        const titleStr = dashIdx > -1 ? line.substring(0, dashIdx).trim() : `Day ${dNum} Plan`;
        const detailsStr = dashIdx > -1 ? line.substring(dashIdx + 1).trim() : line.trim();
        itineraryArr.push({
          day: dNum,
          title: titleStr,
          details: detailsStr
        });
      });
    }

    const payload: TravelPackage = {
      title: formVals.title!,
      description: formVals.description!,
      price: Number(formVals.price),
      location: formVals.location!,
      starCategory: Number(formVals.starCategory),
      travelType: formVals.travelType as any,
      inclusions: {
        airportPickup: !!formVals.airportPickup,
        breakfast: !!formVals.breakfast,
        dinnerBuffet: !!formVals.dinnerBuffet,
        visaServices: !!formVals.visaServices
      },
      amenities: {
        wifi: !!formVals.wifi,
        pool: !!formVals.pool,
        gym: !!formVals.gym,
        bar: !!formVals.bar
      },
      activities: activitiesArr,
      touristPlaces: touristPlacesArr,
      images: imagesArr,
      itinerary: itineraryArr,
      isLastMinute: !!formVals.isLastMinute,
      lastMinutePrice: formVals.lastMinutePrice ? Number(formVals.lastMinutePrice) : undefined
    };

    if (this.isEditing() && this.currentEditId()) {
      // Update
      this.packageService.updatePackage(this.currentEditId()!, payload).subscribe({
        next: () => this.handleSuccess('Package updated successfully!'),
        error: () => this.handleError()
      });
    } else {
      // Create
      this.packageService.createPackage(payload).subscribe({
        next: () => this.handleSuccess('New package created successfully!'),
        error: () => this.handleError()
      });
    }
  }

  editPackage(pkg: TravelPackage) {
    if (!pkg._id) return;
    this.isEditing.set(true);
    this.currentEditId.set(pkg._id);

    // Format fields for editing
    this.packageForm.patchValue({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      location: pkg.location,
      starCategory: pkg.starCategory,
      travelType: pkg.travelType,
      airportPickup: pkg.inclusions.airportPickup,
      breakfast: pkg.inclusions.breakfast,
      dinnerBuffet: pkg.inclusions.dinnerBuffet,
      visaServices: pkg.inclusions.visaServices,
      wifi: pkg.amenities?.wifi || false,
      pool: pkg.amenities?.pool || false,
      gym: pkg.amenities?.gym || false,
      bar: pkg.amenities?.bar || false,
      activities: pkg.activities.join(', '),
      touristPlaces: pkg.touristPlaces.join(', '),
      images: pkg.images.join(', '),
      isLastMinute: pkg.isLastMinute || false,
      lastMinutePrice: pkg.lastMinutePrice || null,
      itineraryRaw: JSON.stringify(pkg.itinerary, null, 2)
    });

    // Scroll form into view
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  deletePackage(id: string) {
    if (confirm('Are you sure you want to delete this travel package?')) {
      this.packageService.deletePackage(id).subscribe({
        next: () => {
          this.snackBar.open('Package removed.', 'Dismiss', { duration: 3000 });
          this.fetchPackages();
        },
        error: () => this.snackBar.open('Error removing package.', 'Dismiss', { duration: 3000 })
      });
    }
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.currentEditId.set(null);
    this.packageForm.reset({
      title: '',
      description: '',
      price: 999,
      location: '',
      starCategory: 4,
      travelType: 'standard',
      airportPickup: false,
      breakfast: false,
      dinnerBuffet: false,
      visaServices: false,
      wifi: false,
      pool: false,
      gym: false,
      bar: false,
      activities: '',
      touristPlaces: '',
      images: '',
      isLastMinute: false,
      lastMinutePrice: null,
      itineraryRaw: ''
    });
  }

  private handleSuccess(msg: string) {
    this.formSubmitting.set(false);
    this.snackBar.open(msg, 'Dismiss', { duration: 3000 });
    this.cancelEdit();
    this.fetchPackages();
  }

  private handleError() {
    this.formSubmitting.set(false);
    this.snackBar.open('Operation failed. Check server inputs.', 'Dismiss', { duration: 3000 });
  }
}
