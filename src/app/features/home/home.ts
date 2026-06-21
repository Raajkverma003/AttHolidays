import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PackageService, TravelPackage } from '../../core/services/package.service';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatCard, MatCardContent, MatCardActions, MatButton, MatIcon, MatProgressSpinner],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private readonly packageService = inject(PackageService);

  protected readonly lastMinutePackages = signal<TravelPackage[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit() {
    this.fetchDeals();
  }

  fetchDeals() {
    this.isLoading.set(true);
    this.packageService.getPackages({ isLastMinute: true }).subscribe({
      next: (pkgs) => {
        this.lastMinutePackages.set(pkgs);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
