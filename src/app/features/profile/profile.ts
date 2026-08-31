import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CustomerService } from '../../core/services/customer.service';
import { Profile as ProfileModel } from '../../core/models/customer.model';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly customerService = inject(CustomerService);

  profile = signal<ProfileModel | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void
  {
    this.customerService.getProfile().subscribe({
      next: profile => {
        this.profile.set(profile);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load your profile.');
        this.isLoading.set(false);
      }
    });
  }
}
