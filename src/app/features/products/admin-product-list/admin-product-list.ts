import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-admin-product-list',
  imports: [FormsModule, RouterModule],
  templateUrl: './admin-product-list.html',
  styleUrl: './admin-product-list.scss',
})
export class AdminProductList implements OnInit
{
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  products: Product[] = [];
  categories: Category[] = [];
  search = '';
  minPrice?: number;
  maxPrice?: number;
  selectedCategoryId?: number;
  sortBy = 'newest';
  sortDescending = true;
  pageNumber = 1;
  pageSize = 12;
  totalPages = 0;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void
  {
    this.loadCategories();
    this.loadProducts();
  }

  searchProducts(): void
  {
    this.pageNumber = 1;
    this.loadProducts();
  }

  nextPage(): void
  {
    if (this.pageNumber < this.totalPages)
    {
      this.pageNumber++;
      this.loadProducts();
    }
  }

  previousPage(): void
  {
    if (this.pageNumber > 1)
    {
      this.pageNumber--;
      this.loadProducts();
    }
  }

  private loadProducts(): void
  {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts({
      search: this.search || undefined,
      categoryId: this.selectedCategoryId,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortDescending: this.sortDescending
    }).subscribe({
      next: response => {
        this.products = response.items;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error?.error?.message ?? 'Unable to load products.';
        this.isLoading = false;
      }
    });
  }

  private loadCategories(): void
  {
    this.categoryService.getCategories().subscribe({
      next: categories => this.categories = categories,
      error: () => this.errorMessage = 'Unable to load categories.'
    });
  }
}
