import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar
{

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}