import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeBanner, ProductSummary } from '../../core/models/Product/product.model';
import { ProductService } from '../../core/services/Product/product.service';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AssetUrlPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy
{
  private readonly productService = inject(ProductService);
  private readonly cdr = inject(ChangeDetectorRef);

  categories: { id: number; name: string; description?: string }[] = [];
  bestsellers: ProductSummary[] = [];
  banners: HomeBanner[] = [];

  activeBannerIndex = 0;
  isLoading = true;
  errorMessage = '';

  private bannerTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void
  {
    this.productService.getHome().subscribe({
      next: response =>
      {
        this.categories = response.categories ?? [];
        this.bestsellers = response.bestSellers ?? [];
        this.banners = response.banners ?? [];
        this.activeBannerIndex = 0;
        this.isLoading = false;
        this.startBannerRotation();
        this.cdr.detectChanges();
      },
      error: () =>
      {
        this.errorMessage = 'Unable to load the collection. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  previousBanner(): void
  {
    if (this.banners.length > 1)
    {
      this.activeBannerIndex =
        (this.activeBannerIndex - 1 + this.banners.length) % this.banners.length;
      this.restartBannerRotation();
    }
  }

  nextBanner(): void
  {
    if (this.banners.length > 1)
    {
      this.activeBannerIndex =
        (this.activeBannerIndex + 1) % this.banners.length;
      this.restartBannerRotation();
    }
  }

  selectBanner(index: number): void
  {
    this.activeBannerIndex = index;
    this.restartBannerRotation();
  }

  private startBannerRotation(): void
  {
    if (this.banners.length <= 1) return;

    this.bannerTimer = setInterval(() =>
    {
      this.activeBannerIndex = (this.activeBannerIndex + 1) % this.banners.length;
      this.cdr.detectChanges();
    }, 5500);
  }

  private restartBannerRotation(): void
  {
    if (this.bannerTimer) clearInterval(this.bannerTimer);
    this.startBannerRotation();
  }

  ngOnDestroy(): void
  {
    if (this.bannerTimer) clearInterval(this.bannerTimer);
  }
}
