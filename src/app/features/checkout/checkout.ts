import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { Address, Cart, CheckoutRequest } from '../../core/models/customer.model';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  cart = signal<Cart | null>(null);
  addresses = signal<Address[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  checkoutForm = this.fb.nonNullable.group({
    addressId: [0, [Validators.required, Validators.min(1)]],
    paymentMethod: ['Card', Validators.required]
  });

  ngOnInit(): void
  {
    this.customerService.getCart().subscribe({
      next: cart => {
        this.cart.set(cart);
        this.loadProfile();
      },
      error: () => {
        this.errorMessage.set('Unable to load your cart.');
        this.isLoading.set(false);
      }
    });
  }

  submit(): void
  {
    const currentCart = this.cart();

    if (!currentCart || currentCart.items.length === 0 || this.checkoutForm.invalid || this.isSaving())
    {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    const values = this.checkoutForm.getRawValue();
    const request: CheckoutRequest = {
      amount: currentCart.totalAmount,
      addressId: values.addressId,
      paymentMethod: values.paymentMethod
    };

    this.customerService.checkout(request).subscribe({
      next: result => {
        this.successMessage.set(result.message);
        this.isSaving.set(false);
        setTimeout(() => this.router.navigate(['/profile']), 900);
      },
      error: error => {
        this.errorMessage.set(error?.error?.message ?? 'Unable to complete checkout.');
        this.isSaving.set(false);
      }
    });
  }

  private loadProfile(): void
  {
    this.customerService.getProfile().subscribe({
      next: profile => {
        this.addresses.set(profile.addresses);
        const defaultAddress = profile.addresses.find(address => address.isDefault);
        if (defaultAddress)
        {
          this.checkoutForm.patchValue({ addressId: defaultAddress.id });
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load your saved addresses.');
        this.isLoading.set(false);
      }
    });
  }
}
