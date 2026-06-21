import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { PackageService, TravelPackage } from '../../core/services/package.service';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    UpperCasePipe,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatIcon,
    MatSlider,
    MatSliderThumb,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatProgressSpinner
  ],
  templateUrl: './package-list.html',
  styleUrl: './package-list.css'
})
export class PackageList implements OnInit {
  private readonly packageService = inject(PackageService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  protected readonly packages = signal<TravelPackage[]>([]);
  protected readonly isLoading = signal(true);

  protected readonly filterForm = this.fb.group({
    location: [''],
    price: [3000],
    starCategory: [0], // 0 means any
    travelType: [''], // '' means any
    isLastMinute: [false],
    wifi: [false],
    pool: [false],
    gym: [false],
    bar: [false]
  });

  ngOnInit() {
    // Read route query parameters to prefill filter state
    this.route.queryParams.subscribe(params => {
      if (params['travelType']) {
        this.filterForm.patchValue({ travelType: params['travelType'] });
      }
      if (params['isLastMinute'] === 'true') {
        this.filterForm.patchValue({ isLastMinute: true });
      }
      this.fetchPackages();
    });

    // Automatically trigger update on filter changes
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.fetchPackages();
    });
  }

  fetchPackages() {
    this.isLoading.set(true);
    const formVals = this.filterForm.value;
    
    const queryFilters: any = {};
    if (formVals.location) queryFilters.location = formVals.location;
    if (formVals.price) queryFilters.price = formVals.price;
    if (formVals.starCategory && formVals.starCategory > 0) queryFilters.starCategory = formVals.starCategory;
    if (formVals.travelType) queryFilters.travelType = formVals.travelType;
    if (formVals.isLastMinute) queryFilters.isLastMinute = true;
    if (formVals.wifi) queryFilters.wifi = true;
    if (formVals.pool) queryFilters.pool = true;
    if (formVals.gym) queryFilters.gym = true;
    if (formVals.bar) queryFilters.bar = true;

    this.packageService.getPackages(queryFilters).subscribe({
      next: (data) => {
        this.packages.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  resetFilters() {
    this.filterForm.reset({
      location: '',
      price: 3000,
      starCategory: 0,
      travelType: '',
      isLastMinute: false,
      wifi: false,
      pool: false,
      gym: false,
      bar: false
    });
    this.fetchPackages();
  }
}
