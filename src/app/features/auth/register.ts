import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
    MatIcon,
    MatSuffix,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly hidePassword = signal(true);
  protected readonly isLoading = signal(false);

  protected readonly registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    const { name, email, password } = this.registerForm.value;

    this.authService.register(name!, email!, password!).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.snackBar.open(`Account created! Welcome, ${res.user.name}!`, 'Dismiss', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(err.message || 'Registration failed', 'Dismiss', { duration: 4000 });
      }
    });
  }
}
