import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistItem } from '../../core/models/Customer/customer.model';
import { CustomerService } from '../../core/services/Customer/customer.service';
import { AppButton } from '../../shared/components/Basic_Material_wrappers/app-button/app-button';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, AppButton],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist implements OnInit
{
  private readonly customerService = inject(CustomerService);
  private readonly cdr = inject(ChangeDetectorRef);

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
      next: () =>
      {
        this.items.update(items =>
          items.filter(current => current.id !== item.id));
        this.cdr.detectChanges();
      },
      error: () =>
      {
        this.errorMessage.set('Unable to remove this piece.');
        this.cdr.detectChanges();
      }
    });
  }

  private loadWishlist(): void
  {
    this.customerService.getWishlist().subscribe({
      next: items =>
      {
        this.items.set(items);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: () =>
      {
        this.errorMessage.set('Unable to load your wishlist.');
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }
}
