import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Review {
  username: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  details: string;
}

export interface PackageInclusions {
  airportPickup: boolean;
  breakfast: boolean;
  dinnerBuffet: boolean;
  visaServices: boolean;
}

export interface PackageAmenities {
  wifi: boolean;
  pool: boolean;
  gym: boolean;
  bar: boolean;
}

export interface TravelPackage {
  _id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  starCategory: number;
  travelType: 'standard' | 'custom' | 'group';
  inclusions: PackageInclusions;
  amenities: PackageAmenities;
  activities: string[];
  touristPlaces: string[];
  itinerary: ItineraryDay[];
  importantDetails?: string;
  images: string[];
  ratings?: {
    average: number;
    count: number;
  };
  reviews?: Review[];
  isLastMinute?: boolean;
  lastMinutePrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/packages`;

  getPackages(filters?: {
    price?: number;
    starCategory?: number;
    travelType?: string;
    location?: string;
    isLastMinute?: boolean;
    wifi?: boolean;
    pool?: boolean;
    gym?: boolean;
    bar?: boolean;
  }): Observable<TravelPackage[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.price) params = params.set('price', filters.price.toString());
      if (filters.starCategory) params = params.set('starCategory', filters.starCategory.toString());
      if (filters.travelType) params = params.set('travelType', filters.travelType);
      if (filters.location) params = params.set('location', filters.location);
      if (filters.isLastMinute) params = params.set('isLastMinute', 'true');
      if (filters.wifi) params = params.set('wifi', 'true');
      if (filters.pool) params = params.set('pool', 'true');
      if (filters.gym) params = params.set('gym', 'true');
      if (filters.bar) params = params.set('bar', 'true');
    }
    return this.http.get<TravelPackage[]>(this.apiUrl, { params });
  }

  getPackageById(id: string): Observable<TravelPackage> {
    return this.http.get<TravelPackage>(`${this.apiUrl}/${id}`);
  }

  createPackage(pkg: TravelPackage): Observable<TravelPackage> {
    return this.http.post<TravelPackage>(this.apiUrl, pkg);
  }

  updatePackage(id: string, pkg: TravelPackage): Observable<TravelPackage> {
    return this.http.put<TravelPackage>(`${this.apiUrl}/${id}`, pkg);
  }

  deletePackage(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addReview(packageId: string, rating: number, comment: string, username: string): Observable<TravelPackage> {
    return this.http.post<TravelPackage>(`${this.apiUrl}/${packageId}/reviews`, { rating, comment, username });
  }
}
