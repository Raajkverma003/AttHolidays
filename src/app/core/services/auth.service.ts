import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  kittySubscription: {
    tier: 'None' | 'Bronze' | 'Silver' | 'Gold';
    points: number;
    lastPaymentDate?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:5001/api/auth';

  // Signals for state
  readonly currentUser = signal<User | null>(null);
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    this.loadTokenAndUser();
  }

  private loadTokenAndUser() {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
        // Refresh profile in background
        this.getProfile().subscribe({
          next: (user) => {
            this.currentUser.set(user);
            localStorage.setItem('user', JSON.stringify(user));
          },
          error: () => this.logout()
        });
      } catch (e) {
        this.logout();
      }
    }
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      tap(res => this.handleAuthSuccess(res)),
      catchError(err => this.handleError(err))
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => this.handleAuthSuccess(res)),
      catchError(err => this.handleError(err))
    );
  }

  private handleAuthSuccess(res: any) {
    if (res.token && res.user) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      this.currentUser.set(res.user);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateSubscriptionState(kittySubscription: User['kittySubscription']) {
    const user = this.currentUser();
    if (user) {
      const updated = { ...user, kittySubscription };
      this.currentUser.set(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  }

  private handleError(error: any) {
    const errorMsg = error?.error?.message || 'Authentication failed. Please try again.';
    return throwError(() => new Error(errorMsg));
  }
}
