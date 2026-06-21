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
    // Check localStorage, default to system preference if empty
    const savedTheme = localStorage.getItem('color-scheme') as ThemeMode | null;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    // Watch system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (!localStorage.getItem('color-scheme')) {
        this.setTheme(event.matches ? 'dark' : 'light');
      }
    });
  }

  toggleTheme() {
    const nextTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
    localStorage.setItem('color-scheme', nextTheme);
  }

  private setTheme(theme: ThemeMode) {
    this.currentTheme.set(theme);
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
