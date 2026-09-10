import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart as CartModel } from '../../core/models/Customer/customer.model';
import { CustomerService } from '../../core/services/Customer/customer.service';
import { AppButton } from '../../shared/components/Basic_Material_wrappers/app-button/app-button';
import { AppFormField } from '../../shared/components/Basic_Material_wrappers/app-form-field/app-form-field';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, AppButton, AppFormField, AssetUrlPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit
{
  private readonly customerService = inject(CustomerService);
  private readonly cdr = inject(ChangeDetectorRef);

  cart = signal<CartModel | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void
  {
    this.loadCart();
  }

  updateQuantity(productId: number, quantity: string): void
  {
    const nextQuantity = Number(quantity);

    if (!Number.isInteger(nextQuantity) || nextQuantity < 1)
    {
      return;
    }

    this.customerService.updateCartItem(productId, nextQuantity).subscribe({
      next: cart =>
      {
        this.cart.set(cart);
        this.cdr.detectChanges();
      },
      error: () =>
      {
        this.errorMessage.set('Unable to update your cart.');
        this.cdr.detectChanges();
      }
    });
  }

  remove(productId: number): void
  {
    this.customerService.removeCartItem(productId).subscribe({
      next: () =>
      {
        this.loadCart();
        this.cdr.detectChanges();
      },
      error: () =>
      {
        this.errorMessage.set('Unable to remove this item.');
        this.cdr.detectChanges();
      }
    });
  }

  clear(): void
  {
    this.customerService.clearCart().subscribe({
      next: () =>
      {
        this.cart.set({ id: this.cart()?.id ?? 0, items: [], totalAmount: 0, totalItems: 0 });
        this.cdr.detectChanges();
      },
      error: () =>
      {
        this.errorMessage.set('Unable to clear your cart.');
        this.cdr.detectChanges();
      }
    });
  }

  private loadCart(): void
  {
    this.customerService.getCart().subscribe({
      next: cart =>
      {
        this.cart.set(cart);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: () =>
      {
        this.errorMessage.set('Unable to load your cart.');
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }
}
