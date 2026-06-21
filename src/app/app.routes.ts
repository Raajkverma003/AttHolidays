import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register').then(m => m.Register)
  },
  {
    path: 'packages',
    loadComponent: () => import('./features/packages/package-list').then(m => m.PackageList)
  },
  {
    path: 'packages/:id',
    loadComponent: () => import('./features/packages/package-detail').then(m => m.PackageDetail)
  },
  {
    path: 'custom-builder',
    loadComponent: () => import('./features/packages/custom-builder').then(m => m.CustomBuilder)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/kitty-dashboard').then(m => m.KittyDashboard),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [adminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
