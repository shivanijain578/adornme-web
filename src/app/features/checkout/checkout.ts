import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Address, Cart, CheckoutRequest } from '../../core/models/Customer/customer.model';
import { CustomerService } from '../../core/services/Customer/customer.service';
import { AppButton } from '../../shared/components/Basic_Material_wrappers/app-button/app-button';
import { AppDropdown } from '../../shared/components/Basic_Material_wrappers/app-dropdown/app-dropdown';
import { AppFormField } from '../../shared/components/Basic_Material_wrappers/app-form-field/app-form-field';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, AppButton, AppDropdown, AppFormField],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  cart = signal<Cart | null>(null);
  addresses = signal<Address[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  isAddingAddress = false;

  readonly paymentOptions = [
    { label: 'Card', value: 'Card' },
    { label: 'Cash on delivery', value: 'CashOnDelivery' }
  ];

  checkoutForm = this.fb.nonNullable.group({
    addressId: [0, [Validators.required, Validators.min(1)]],
    paymentMethod: ['Card', Validators.required]
  });

  addressForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', Validators.required],
    isDefault: [false]
  });

  ngOnInit(): void
  {
    this.customerService.getCart().subscribe({
      next: cart =>
      {
        this.cart.set(cart);
        this.loadProfile();
      },
      error: () =>
      {
        this.errorMessage.set('Unable to load your cart.');
        this.isLoading.set(false);
      }
    });
  }

  submit(): void
  {
    const currentCart = this.cart();

    if (!currentCart || currentCart.items.length === 0 || this.isSaving())
    {
      return;
    }

    if (this.checkoutForm.controls.paymentMethod.invalid)
    {
      this.checkoutForm.controls.paymentMethod.markAsTouched();
      return;
    }

    if (this.isAddingAddress && this.addressForm.invalid)
    {
      this.addressForm.markAllAsTouched();
      return;
    }

    if (!this.isAddingAddress && this.checkoutForm.controls.addressId.invalid)
    {
      this.checkoutForm.controls.addressId.markAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    if (this.isAddingAddress)
    {
      this.customerService.addAddress(this.addressForm.getRawValue()).subscribe({
        next: address =>
        {
          this.addresses.update(addresses => [...addresses, address]);
          this.checkoutForm.patchValue({ addressId: address.id });
          this.placeOrder(currentCart.totalAmount, address.id);
        },
        error: error => this.handleSaveError(error, 'Unable to save your delivery address.')
      });
      return;
    }

    this.placeOrder(currentCart.totalAmount, this.checkoutForm.controls.addressId.value);
  }

  toggleAddressMode(): void
  {
    this.isAddingAddress = !this.isAddingAddress;
    this.errorMessage.set('');
  }

  private placeOrder(amount: number, addressId: number): void
  {
    const request: CheckoutRequest = {
      amount,
      addressId,
      paymentMethod: this.checkoutForm.controls.paymentMethod.value
    };

    this.customerService.checkout(request).subscribe({
      next: result =>
      {
        this.successMessage.set(result.message);
        this.isSaving.set(false);
        setTimeout(() => this.router.navigate(['/profile']), 900);
        this.cdr.detectChanges();
      },
      error: error =>
      {
        this.handleSaveError(error, 'Unable to complete checkout.');
      }
    });
  }

  private handleSaveError(error: { error?: { message?: string } }, fallback: string): void
  {
    this.errorMessage.set(error?.error?.message ?? fallback);
    this.isSaving.set(false);
    this.cdr.detectChanges();
  }

  private loadProfile(): void
  {
    this.customerService.getProfile().subscribe({
      next: profile =>
      {
        this.addresses.set(profile.addresses);
        const defaultAddress = profile.addresses.find(address => address.isDefault);
        if (defaultAddress)
        {
          this.checkoutForm.patchValue({ addressId: defaultAddress.id });
        }
        this.isAddingAddress = profile.addresses.length === 0;
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: () =>
      {
        this.errorMessage.set('Unable to load your saved addresses.');
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }
}
