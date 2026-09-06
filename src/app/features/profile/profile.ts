import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Profile as ProfileModel } from '../../core/models/Customer/customer.model';
import { CustomerService } from '../../core/services/Customer/customer.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit
{
  private readonly customerService = inject(CustomerService);
  private readonly cdr = inject(ChangeDetectorRef);

  profile = signal<ProfileModel | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void
  {
    this.customerService.getProfile().subscribe({
      next: profile =>
      {
        this.profile.set(profile);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: () =>
      {
        this.errorMessage.set('Unable to load your profile.');
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }
}
