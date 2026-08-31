import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { WishlistItem } from '../../core/models/customer.model';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist implements OnInit
{
  private readonly customerService = inject(CustomerService);

  items = signal<WishlistItem[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void
  {
    this.loadWishlist();
  }

  remove(item: WishlistItem): void
  {
    this.customerService.removeFromWishlist(item.productId).subscribe({
      next: () => this.items.update(items =>
        items.filter(current => current.id !== item.id)),
      error: () => this.errorMessage.set('Unable to remove this piece.')
    });
  }

  private loadWishlist(): void
  {
    this.customerService.getWishlist().subscribe({
      next: items => {
        this.items.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load your wishlist.');
        this.isLoading.set(false);
      }
    });
  }
}
