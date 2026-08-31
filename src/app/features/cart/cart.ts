import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart as CartModel } from '../../core/models/customer.model';
import { CustomerService } from '../../core/services/customer.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit
{
  private readonly customerService = inject(CustomerService);

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
      next: cart => this.cart.set(cart),
      error: () => this.errorMessage.set('Unable to update your cart.')
    });
  }

  remove(productId: number): void
  {
    this.customerService.removeCartItem(productId).subscribe({
      next: () => this.loadCart(),
      error: () => this.errorMessage.set('Unable to remove this item.')
    });
  }

  clear(): void
  {
    this.customerService.clearCart().subscribe({
      next: () => this.cart.set({ id: this.cart()?.id ?? 0, items: [], totalAmount: 0, totalItems: 0 }),
      error: () => this.errorMessage.set('Unable to clear your cart.')
    });
  }

  private loadCart(): void
  {
    this.customerService.getCart().subscribe({
      next: cart => {
        this.cart.set(cart);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load your cart.');
        this.isLoading.set(false);
      }
    });
  }
}
