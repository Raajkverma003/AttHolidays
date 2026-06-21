import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButton, MatIconButton, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);

  logout() {
    this.authService.logout();
  }
}
