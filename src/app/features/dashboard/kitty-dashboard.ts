import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { AuthService, User } from '../../core/services/auth.service';
import { BookingService, PopulatedBooking } from '../../core/services/booking.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-kitty-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, UpperCasePipe, MatCard, MatCardContent, MatButton, MatIcon, MatProgressSpinner],
  templateUrl: './kitty-dashboard.html',
  styleUrl: './kitty-dashboard.css'
})
export class KittyDashboard implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly bookingService = inject(BookingService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly bookings = signal<PopulatedBooking[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isSubscribing = signal(false);

  ngOnInit() {
    this.fetchUserBookings();
  }

  fetchUserBookings() {
    this.isLoading.set(true);
    this.bookingService.getBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Error fetching bookings history.', 'Dismiss', { duration: 3000 });
      }
    });
  }

  changeSubscription(tier: 'None' | 'Bronze' | 'Silver' | 'Gold') {
    this.isSubscribing.set(true);
    this.bookingService.subscribeKitty(tier).subscribe({
      next: (res) => {
        this.isSubscribing.set(false);
        this.authService.updateSubscriptionState(res.kittySubscription);
        this.snackBar.open(res.message, 'Dismiss', { duration: 3500 });
      },
      error: (err) => {
        this.isSubscribing.set(false);
        this.snackBar.open(err.error?.message || 'Subscription change failed.', 'Dismiss', { duration: 3500 });
      }
    });
  }

  getStatusClass(status: string): string {
    if (status === 'approved') return 'status-approved';
    if (status === 'cancelled') return 'status-cancelled';
    if (status === 'completed') return 'status-completed';
    return 'status-pending';
  }
}
