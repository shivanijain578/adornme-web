import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/Product/product.service';
import { ProductDetail, ProductSummary } from '../../../core/models/Product/product.model';
import { AuthService } from '../../../core/services/Auth/auth.service';
import { CustomerService } from '../../../core/services/Customer/customer.service';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';

@Component({
  selector: 'app-product-details',
  imports: [
    RouterLink,
    AppButton
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit
{
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly customerService = inject(CustomerService);
  private readonly cdr = inject(ChangeDetectorRef);

  product: ProductDetail | null = null;
  similarProducts: ProductSummary[] = [];

  isLoading = false;

  errorMessage = '';

  actionMessage = '';

  isCartSaving = false;

  isWishlistSaving = false;

  isInWishlist = false;

  get isAdmin(): boolean
  {
    return this.authService.isAdmin();
  }

  get isLoggedIn(): boolean
  {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void
  {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id)
    {
      this.errorMessage =
        'Invalid product ID.';
      return;
    }

    this.loadProduct(id);
  }

  private loadProduct(id: number): void
  {

    this.isLoading = true;

    this.productService
      .getHomeProductById(id)
      .subscribe({

        next: product =>
        {
          this.product = product;
          if (this.isLoggedIn)
          {
            this.loadWishlistState(product.id);
          }
          this.loadSimilarProducts(product);
          this.isLoading = false;
          this.cdr.detectChanges();

        },

        error: error =>
        {

          this.errorMessage =
            error?.error?.message ??
            'Unable to load product.';

          this.isLoading = false;

        }

      });
  }

  addToCart(): void
  {
    if (!this.product || this.isCartSaving)
    {
      return;
    }

    this.isCartSaving = true;
    this.actionMessage = '';
    this.errorMessage = '';

    this.customerService.addToCart(this.product.id).subscribe({
      next: () =>
      {
        this.actionMessage = 'Added to your cart.';
        this.isCartSaving = false;
        this.cdr.detectChanges();
      },
      error: error =>
      {
        this.errorMessage = error?.error?.message ?? 'Unable to add this piece to your cart.';
        this.isCartSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleWishlist(): void
  {
    if (!this.product || this.isWishlistSaving)
    {
      return;
    }

    this.isWishlistSaving = true;
    this.actionMessage = '';
    this.errorMessage = '';

    const request = this.isInWishlist
      ? this.customerService.removeFromWishlist(this.product.id)
      : this.customerService.addToWishlist(this.product.id);

    request.subscribe({
      next: () =>
      {
        this.isInWishlist = !this.isInWishlist;
        this.actionMessage = this.isInWishlist
          ? 'Saved to your wishlist.'
          : 'Removed from your wishlist.';
        this.isWishlistSaving = false;
        this.cdr.detectChanges();
      },
      error: error =>
      {
        this.errorMessage = error?.error?.message ?? 'Unable to update your wishlist.';
        this.isWishlistSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadWishlistState(productId: number): void
  {
    this.customerService.wishlistContains(productId).subscribe({
      next: response =>
      {
        this.isInWishlist = response.exists;
        this.cdr.detectChanges();
      }
    });
  }

  private loadSimilarProducts(product: ProductDetail): void
  {
    this.productService.getHomeProducts(product.categoryId, 1, 5).subscribe({
      next: response =>
      {
        this.similarProducts = response
          .filter(item => item.id !== product.id)
          .slice(0, 4);
        this.cdr.detectChanges();
      }
    });
  }
}
