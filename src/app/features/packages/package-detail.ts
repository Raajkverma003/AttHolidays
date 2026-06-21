import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { PackageService, TravelPackage } from '../../core/services/package.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    UpperCasePipe,
    MatCard,
    MatCardContent,
    MatButton,
    MatIcon,
    MatTabsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatProgressSpinner
  ],
  templateUrl: './package-detail.html',
  styleUrl: './package-detail.css'
})
export class PackageDetail implements OnInit {
  private readonly packageService = inject(PackageService);
  private readonly bookingService = inject(BookingService);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly pkg = signal<TravelPackage | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly bookingLoading = signal(false);
  protected readonly reviewLoading = signal(false);
  
  protected readonly travelDate = signal('');

  protected readonly reviewForm = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchPackageDetails(id);
    } else {
      this.router.navigate(['/packages']);
    }
  }

  fetchPackageDetails(id: string) {
    this.isLoading.set(true);
    this.packageService.getPackageById(id).subscribe({
      next: (data) => {
        this.pkg.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Error loading package details.', 'Dismiss', { duration: 3000 });
        this.router.navigate(['/packages']);
      }
    });
  }

  bookPackage() {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please sign in to book packages.', 'Dismiss', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    if (!this.travelDate()) {
      this.snackBar.open('Please select a travel date.', 'Dismiss', { duration: 3000 });
      return;
    }

    const packageData = this.pkg();
    if (!packageData || !packageData._id) return;

    this.bookingLoading.set(true);
    const finalPrice = packageData.isLastMinute && packageData.lastMinutePrice 
      ? packageData.lastMinutePrice 
      : packageData.price;

    this.bookingService.createBooking({
      packageId: packageData._id,
      travelDate: this.travelDate(),
      isCustomized: false,
      price: finalPrice
    }).subscribe({
      next: () => {
        this.bookingLoading.set(false);
        this.snackBar.open('Booking request submitted successfully!', 'Dismiss', { duration: 4000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.bookingLoading.set(false);
        this.snackBar.open(err.error?.message || 'Booking request failed.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.travelDate.set(input.value);
  }

  submitReview() {
    if (this.reviewForm.invalid) return;

    const user = this.authService.currentUser();
    const packageData = this.pkg();
    if (!user || !packageData || !packageData._id) return;

    this.reviewLoading.set(true);
    const { rating, comment } = this.reviewForm.value;

    this.packageService.addReview(
      packageData._id,
      rating!,
      comment!,
      user.name
    ).subscribe({
      next: (updatedPkg) => {
        this.reviewLoading.set(false);
        this.pkg.set(updatedPkg);
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.snackBar.open('Review added successfully!', 'Dismiss', { duration: 3000 });
      },
      error: () => {
        this.reviewLoading.set(false);
        this.snackBar.open('Error submitting review.', 'Dismiss', { duration: 3000 });
      }
    });
  }
}
