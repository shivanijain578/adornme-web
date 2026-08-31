import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductSummary } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { forkJoin } from 'rxjs';

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

  categories = signal<Category[]>([]);
  bestsellers = signal<ProductSummary[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void
  {
    forkJoin({
      categories: this.categoryService.getHomeCategories(),
      products: this.productService.getHomeProducts(undefined, 1, 4)
    }).subscribe({
      next: response => {
        this.categories.set(response.categories);
        this.bestsellers.set(response.products);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load the collection.');
        this.isLoading.set(false);
      }
    });
  }
}
