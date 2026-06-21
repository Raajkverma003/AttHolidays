import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { BookingService, PopulatedBooking } from '../../../core/services/booking.service';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bookings-tracker',
  standalone: true,
  imports: [
    DatePipe,
    UpperCasePipe,
    MatButton,
    MatIcon,
    MatProgressSpinner
  ],
  templateUrl: './bookings-tracker.html',
  styleUrl: './bookings-tracker.css'
})
export class BookingsTracker implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly crmBookings = signal<PopulatedBooking[]>([]);
  protected readonly isLoadingCRM = signal(true);

  ngOnInit() {
    this.fetchCRMBookings();
  }

  fetchCRMBookings() {
    this.isLoadingCRM.set(true);
    this.bookingService.getAdminBookings().subscribe({
      next: (data) => {
        this.crmBookings.set(data);
        this.isLoadingCRM.set(false);
      },
      error: () => this.isLoadingCRM.set(false)
    });
  }

  updateBookingStatus(bookingId: string, status: 'approved' | 'cancelled' | 'completed') {
    this.bookingService.updateBookingStatus(bookingId, status).subscribe({
      next: () => {
        this.snackBar.open(`Booking updated to ${status}.`, 'Dismiss', { duration: 3000 });
        this.fetchCRMBookings();
      },
      error: () => this.snackBar.open('Error updating status.', 'Dismiss', { duration: 3000 })
    });
  }
}
