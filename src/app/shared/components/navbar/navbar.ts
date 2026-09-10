import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../../core/services/Auth/auth.service';
import { AppButton } from '../Basic_Material_wrappers/app-button/app-button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgOptimizedImage,
    MatIconModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar
{

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isMenuOpen = false;

  toggleMenu(): void
  {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void
  {
    this.isMenuOpen = false;
  }

  get isLoggedIn(): boolean
  {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean
  {
    return this.authService.isAdmin();
  }

  logout(): void
  {
    this.closeMenu();
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}