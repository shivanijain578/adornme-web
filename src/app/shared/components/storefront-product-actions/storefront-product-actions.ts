import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-storefront-product-actions',
  standalone: true,
  template: `
    <div class="storefront-product-actions">
      <button type="button" class="storefront-action storefront-action-cart" (click)="cart.emit()">
        <span aria-hidden="true">🛍</span>
        <span>{{ cartLabel }}</span>
      </button>
      <button type="button" class="storefront-action storefront-action-wishlist" (click)="wishlist.emit()">
        <span aria-hidden="true">♡</span>
        <span>{{ wishlistLabel }}</span>
      </button>
    </div>
  `,
})
export class StorefrontProductActions {
  @Input() cartLabel = 'Add to Cart';
  @Input() wishlistLabel = 'Wishlist';
  @Output() cart = new EventEmitter<void>();
  @Output() wishlist = new EventEmitter<void>();
}