import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/Product/product.service';
import { ProductDetail, ProductSummary } from '../../../core/models/Product/product.model';
import { AuthService } from '../../../core/services/Auth/auth.service';
import { CustomerService } from '../../../core/services/Customer/customer.service';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';
import { AssetUrlPipe } from '../../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, AppButton, AssetUrlPipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit, OnDestroy
{
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly customerService = inject(CustomerService);
  private readonly cdr = inject(ChangeDetectorRef);

  product: ProductDetail | null = null;
  similarProducts: ProductSummary[] = [];

  activeImageIndex = 0;
  isLoading = false;
  errorMessage = '';
  actionMessage = '';
  isCartSaving = false;
  isWishlistSaving = false;
  isInWishlist = false;

  private imageTimer?: ReturnType<typeof setInterval>;
  private touchStartX: number | null = null;

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
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id)
    {
      this.errorMessage = 'Invalid product ID.';
      return;
    }

    this.loadProduct(id);
  }

  private loadProduct(id: number): void
  {
    this.isLoading = true;
    this.activeImageIndex = 0;
    this.stopImageRotation();

    this.productService.getHomeProductById(id).subscribe({
      next: product =>
      {
        this.product = product;
        this.activeImageIndex = 0;
        this.startImageRotation();

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
        this.errorMessage = error?.error?.message ?? 'Unable to load product.';
        this.isLoading = false;
        this.stopImageRotation();
      }
    });
  }

  showPreviousImage(): void
  {
    const count = this.product?.images?.length ?? 0;
    if (count <= 1) return;

    this.activeImageIndex = (this.activeImageIndex - 1 + count) % count;
    this.restartImageRotation();
    this.cdr.detectChanges();
  }

  showNextImage(): void
  {
    const count = this.product?.images?.length ?? 0;
    if (count <= 1) return;

    this.activeImageIndex = (this.activeImageIndex + 1) % count;
    this.restartImageRotation();
    this.cdr.detectChanges();
  }

  selectImage(index: number): void
  {
    const count = this.product?.images?.length ?? 0;
    if (index < 0 || index >= count) return;

    this.activeImageIndex = index;
    this.restartImageRotation();
    this.cdr.detectChanges();
  }

  onGalleryTouchStart(event: TouchEvent): void
  {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  onGalleryTouchEnd(event: TouchEvent): void
  {
    if (this.touchStartX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? this.touchStartX;
    const distance = endX - this.touchStartX;
    this.touchStartX = null;

    if (Math.abs(distance) < 45) return;

    if (distance > 0)
    {
      this.showPreviousImage();
    }
    else
    {
      this.showNextImage();
    }
  }

  private startImageRotation(): void
  {
    this.stopImageRotation();

    if ((this.product?.images?.length ?? 0) <= 1) return;

    this.imageTimer = setInterval(() =>
    {
      const count = this.product?.images?.length ?? 0;
      if (count <= 1)
      {
        this.stopImageRotation();
        return;
      }

      this.activeImageIndex = (this.activeImageIndex + 1) % count;
      this.cdr.detectChanges();
    }, 4000);
  }

  private restartImageRotation(): void
  {
    this.startImageRotation();
  }

  private stopImageRotation(): void
  {
    if (this.imageTimer)
    {
      clearInterval(this.imageTimer);
      this.imageTimer = undefined;
    }
  }

  addToCart(): void
  {
    if (!this.product || this.isCartSaving) return;

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
    if (!this.product || this.isWishlistSaving) return;

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

  ngOnDestroy(): void
  {
    this.stopImageRotation();
  }
}