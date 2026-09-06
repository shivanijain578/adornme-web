import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Category } from '../../core/models/Category/category.model';
import { ProductSummary } from '../../core/models/Product/product.model';
import { CategoryService } from '../../core/services/Category/category.service';
import { ProductService } from '../../core/services/Product/product.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit
{
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];
  bestsellers: ProductSummary[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void
  {
    forkJoin({
      categories: this.categoryService.getHomeCategories(),
      products: this.productService.getHomeProducts(undefined, 1, 4)
    }).subscribe({
      next: response =>
      {
        this.categories = response.categories;
        this.bestsellers = response.products;
        this.isLoading = false;
        this.cdr.detectChanges();

      },
      error: () =>
      {
        this.errorMessage = 'Unable to load the collection.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
