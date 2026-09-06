import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../../core/models/Product/product.model';
import { Category } from '../../../core/models/Category/category.model';
import { ProductService } from '../../../core/services/Product/product.service';
import { CategoryService } from '../../../core/services/Category/category.service';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';
import { AppDropdown } from '../../../shared/components/Basic_Material_wrappers/app-dropdown/app-dropdown';
import { AppSearchBox } from '../../../shared/components/Basic_Material_wrappers/app-search-box/app-search-box';
@Component({
  selector: 'app-user-product-list',
  imports: [FormsModule, RouterModule, AppButton, AppDropdown, AppSearchBox],
  templateUrl: './user-product-list.html',
  styleUrl: './user-product-list.scss',
})
export class UserProductList implements OnInit
{
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  categories: Category[] = [];
  search = '';
  selectedCategoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy = 'newest';
  readonly sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price', value: 'price' },
    { label: 'Name', value: 'name' }
  ];
  sortDescending = true;
  pageNumber = 1;
  pageSize = 12;
  totalPages = 0;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void
  {
    const categoryId = Number(
      this.route.snapshot.queryParamMap.get('categoryId')
    );
    this.selectedCategoryId = categoryId || undefined;
    this.loadCategories();
    this.loadProducts();
  }

  applyFilters(): void
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
      sortBy: this.sortBy,
      sortDescending: this.sortDescending,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }).subscribe({
      next: response =>
      {
        this.products = response.items;
        this.totalPages = response.totalPages;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: error =>
      {
        this.errorMessage = error?.error?.message ?? 'Unable to load products.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadCategories(): void
  {
    this.categoryService.getCategories().subscribe({
      next: categories =>
      {
        this.categories = categories;
        this.cdr.detectChanges();
      },
      error: () =>
      {
        this.errorMessage = 'Unable to load categories.';
        this.cdr.detectChanges();
      }
    });
  }
}
