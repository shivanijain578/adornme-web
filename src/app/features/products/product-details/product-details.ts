import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductDetail, ProductSummary } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-details',
  imports: [
    RouterLink
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit
{

  private readonly route =
    inject(ActivatedRoute);

  private readonly productService =
    inject(ProductService);

  private readonly authService =
    inject(AuthService);

  product: ProductDetail | null = null;
  similarProducts: ProductSummary[] = [];

  isLoading = false;

  errorMessage = '';

  get isAdmin(): boolean
  {
    return this.authService.isAdmin();
  }

  ngOnInit(): void
  {
debugger
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
          this.loadSimilarProducts(product);

          this.isLoading = false;

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

  private loadSimilarProducts(product: ProductDetail): void
  {
    this.productService.getHomeProducts(product.categoryId, 1, 5).subscribe({
      next: response => {
          this.similarProducts = response
          .filter(item => item.id !== product.id)
          .slice(0, 4);
      }
    });
  }
}
