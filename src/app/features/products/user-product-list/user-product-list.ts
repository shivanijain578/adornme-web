import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../../core/models/Product/product.model';
import { Category } from '../../../core/models/Category/category.model';
import { ProductService } from '../../../core/services/Product/product.service';
import { CategoryService } from '../../../core/services/Category/category.service';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';
import { AppDropdown } from '../../../shared/components/Basic_Material_wrappers/app-dropdown/app-dropdown';
import { AppSearchBox } from '../../../shared/components/Basic_Material_wrappers/app-search-box/app-search-box';
import { AssetUrlPipe } from '../../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-user-product-list',
  imports: [FormsModule, RouterModule, AppButton, AppDropdown, AppSearchBox, AssetUrlPipe],
  templateUrl: './user-product-list.html',
  styleUrl: './user-product-list.scss',
})
export class UserProductList implements OnInit
{
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  categories: Category[] = [];
  search = '';
  selectedCategoryId?: number;
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
  totalItems = 0;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void
  {
    this.route.queryParamMap.subscribe(params =>
    {
      this.search = params.get('search')?.trim() ?? '';
      const categoryId = Number(params.get('categoryId'));
      this.selectedCategoryId = categoryId || undefined;
      this.pageNumber = 1;
      this.loadProducts();
    });

    this.loadCategories();
  }

  applyFilters(): void
  {
    const queryParams: Record<string, string | number> = {};
    if (this.search.trim()) queryParams['search'] = this.search.trim();
    if (this.selectedCategoryId) queryParams['categoryId'] = this.selectedCategoryId;
    this.router.navigate(['/products'], { queryParams });
  }

  clearFilters(): void
  {
    this.search = '';
    this.selectedCategoryId = undefined;
    this.sortBy = 'newest';
    this.sortDescending = true;
    this.router.navigate(['/products']);
  }

  nextPage(): void
  {
    if (this.pageNumber < this.totalPages)
    {
      this.pageNumber++;
      this.loadProducts();
      this.scrollToTop();
    }
  }

  previousPage(): void
  {
    if (this.pageNumber > 1)
    {
      this.pageNumber--;
      this.loadProducts();
      this.scrollToTop();
    }
  }

  trackByProduct(_: number, product: Product): number
  {
    return product.id;
  }

  private loadProducts(): void
  {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts({
      search: this.search || undefined,
      categoryId: this.selectedCategoryId,
      sortBy: this.sortBy,
      sortDescending: this.sortDescending,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }).subscribe({
      next: response =>
      {
        this.products = response.items;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalCount ?? response.items.length;
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
        this.categories = categories.filter(category => category.isVisible !== false);
        this.cdr.detectChanges();
      },
      error: () =>
      {
        this.errorMessage = 'Unable to load categories.';
        this.cdr.detectChanges();
      }
    });
  }

  private scrollToTop(): void
  {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}