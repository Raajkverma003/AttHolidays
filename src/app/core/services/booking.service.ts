import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TravelPackage } from './package.service';
import { User } from './auth.service';

export interface Booking {
  _id?: string;
  user: string | User;
  package: string | TravelPackage;
  travelDate: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  isCustomized: boolean;
  customSelections?: {
    starCategory?: number;
    inclusions?: {
      airportPickup: boolean;
      breakfast: boolean;
      dinnerBuffet: boolean;
      visaServices: boolean;
    };
    activities?: string[];
  };
  price: number;
  createdAt?: string;
}

export interface PopulatedBooking {
  _id?: string;
  user: User;
  package: TravelPackage;
  travelDate: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  isCustomized: boolean;
  customSelections?: {
    starCategory?: number;
    inclusions?: {
      airportPickup: boolean;
      breakfast: boolean;
      dinnerBuffet: boolean;
      visaServices: boolean;
    };
    activities?: string[];
  };
  price: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/bookings`;

  getBookings(): Observable<PopulatedBooking[]> {
    return this.http.get<PopulatedBooking[]>(this.apiUrl);
  }

  createBooking(booking: {
    packageId: string;
    travelDate: string;
    isCustomized: boolean;
    customSelections?: Booking['customSelections'];
    price: number;
  }): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  subscribeKitty(tier: 'None' | 'Bronze' | 'Silver' | 'Gold'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/kitty-subscribe`, { tier });
  }

  getAdminBookings(): Observable<PopulatedBooking[]> {
    return this.http.get<PopulatedBooking[]>(`${this.apiUrl}/admin`);
  }

  updateBookingStatus(id: string, status: string): Observable<PopulatedBooking> {
    return this.http.put<PopulatedBooking>(`${this.apiUrl}/admin/${id}`, { status });
  }
}
