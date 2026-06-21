import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BookingsTracker } from './bookings-tracker/bookings-tracker';
import { InventoryManager } from './inventory-manager/inventory-manager';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatTabsModule,
    BookingsTracker,
    InventoryManager
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {}
