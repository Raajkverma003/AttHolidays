import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly currentTheme = signal<ThemeMode>('dark');

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    // Check localStorage, default to system preference if empty
    const storageAvailable = typeof localStorage !== 'undefined';
    const savedTheme = storageAvailable ? (localStorage.getItem('color-scheme') as ThemeMode | null) : null;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else if (typeof window.matchMedia === 'function') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    } else {
      this.setTheme('dark');
    }

    // Watch system changes
    if (typeof window.matchMedia === 'function') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        const currentSaved = storageAvailable ? localStorage.getItem('color-scheme') : null;
        if (!currentSaved) {
          this.setTheme(event.matches ? 'dark' : 'light');
        }
      });
    }
  }

  toggleTheme() {
    const nextTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('color-scheme', nextTheme);
    }
  }

  private setTheme(theme: ThemeMode) {
    this.currentTheme.set(theme);
    if (typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }
}
