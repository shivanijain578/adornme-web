import
{
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { Router, RouterModule } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Category } from '../../../core/models/Category/category.model';
import { Product } from '../../../core/models/Product/product.model';

import { CategoryService }
  from '../../../core/services/Category/category.service';

import { ProductService }
  from '../../../core/services/Product/product.service';


import
{
  GridColumn,
  GridAction
} from '../../../shared/models/ui/data-grid.model';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';
import { AppDataGrid } from '../../../shared/components/Basic_Material_wrappers/app-data-grid/app-data-grid';
import { AppDropdown } from '../../../shared/components/Basic_Material_wrappers/app-dropdown/app-dropdown';
import { AppFilterPanel } from '../../../shared/components/Basic_Material_wrappers/app-filter-panel/app-filter-panel';
import { AppPagination } from '../../../shared/components/Basic_Material_wrappers/app-pagination/app-pagination';
import { AppSearchBox } from '../../../shared/components/Basic_Material_wrappers/app-search-box/app-search-box';
import { AppConfirmDialog } from '../../../shared/components/Basic_Material_wrappers/app-confirm-dialog/app-confirm-dialog';
import { AdminService } from '../../../core/services/Admin/admin.service';
import { AdminSummary } from '../../../core/models/Customer/customer.model';

@Component({
  selector: 'app-admin-product-list',

  imports: [
    RouterModule,
    MatDialogModule,
    AppButton,
    AppDropdown,
    AppSearchBox,
    AppFilterPanel,
    AppDataGrid,
    AppPagination
  ],

  templateUrl: './admin-product-list.html',
  styleUrl: './admin-product-list.scss',
})
export class AdminProductList implements OnInit
{

  private readonly productService =
    inject(ProductService);

  private readonly categoryService =
    inject(CategoryService);

  private readonly adminService =
    inject(AdminService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  public readonly router =
    inject(Router);

  private readonly dialog =
    inject(MatDialog);


  // =========================================================
  // DATA
  // =========================================================

  products: Product[] = [];

  categories: Category[] = [];


  // =========================================================
  // FILTERS
  // =========================================================

  search = '';

  minPrice?: number;

  maxPrice?: number;

  selectedCategoryId?: number;

  sortBy = 'newest';

  sortDescending = true;


  // =========================================================
  // PAGINATION
  // =========================================================

  pageNumber = 1;

  pageSize = 12;

  totalPages = 0;

  totalItems = 0;


  // =========================================================
  // STATE
  // =========================================================

  isLoading = false;

  errorMessage = '';

  adminSummary: AdminSummary | null = null;


  // =========================================================
  // DROPDOWN OPTIONS
  // =========================================================

  sortOptions = [
    {
      label: 'Newest',
      value: 'newest'
    },
    {
      label: 'Price',
      value: 'price'
    },
    {
      label: 'Name',
      value: 'name'
    }
  ];


  // =========================================================
  // GRID COLUMNS
  // =========================================================

  productColumns: GridColumn<Product>[] = [

    {
      key: 'imageUrl',
      header: 'Product',
      type: 'image',
      width: '90px'
    },

    {
      key: 'name',
      header: 'Name',
      type: 'text',
      sortable: true
    },

    {
      key: 'categoryName',
      header: 'Category',
      type: 'text'
    },

    {
      key: 'price',
      header: 'Price',
      type: 'currency',
      sortable: true
    },

    {
      key: 'stockQuantity',
      header: 'Stock',
      type: 'number',
      sortable: true
    },

    {
      key: 'isActive',
      header: 'Visible',
      type: 'boolean'
    }

  ];


  // =========================================================
  // GRID ACTIONS
  // =========================================================

  productActions: GridAction<Product>[] = [

    {
      label: 'Edit',
      icon: 'edit',
      color: 'primary',

      action: (product) =>
      {
        this.editProduct(product);
      }
    },

    {
      label: 'Delete',
      icon: 'delete',
      color: 'warn',

      action: (product) =>
      {
        this.deleteProduct(product);
      }
    }

  ];

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void
  {

    this.loadCategories();

    this.loadProducts();

    this.adminService.getSummary().subscribe({
      next: summary =>
      {
        this.adminSummary = summary;
        this.cdr.detectChanges();
      }
    });
  }


  // =========================================================
  // FILTERS
  // =========================================================

  onSearch(value: string): void
  {

    this.search = value;

    this.applyFilters();
  }


  onCategoryChange(value: number | undefined): void
  {

    this.selectedCategoryId = value;

    this.applyFilters();
  }


  onSortChange(value: string): void
  {

    this.sortBy = value;

    this.applyFilters();
  }


  applyFilters(): void
  {

    this.pageNumber = 1;

    this.loadProducts();
  }


  resetFilters(): void
  {

    this.search = '';

    this.selectedCategoryId = undefined;

    this.sortBy = 'newest';

    this.sortDescending = true;

    this.pageNumber = 1;

    this.loadProducts();
  }


  // =========================================================
  // PAGINATION
  // =========================================================

  onPageChange(page: number): void
  {

    this.pageNumber = page;

    this.loadProducts();
  }


  // =========================================================
  // PRODUCTS
  // =========================================================

  private loadProducts(): void
  {

    this.isLoading = true;

    this.errorMessage = '';


    const params = {

      search:
        this.search || undefined,

      categoryId:
        this.selectedCategoryId,

      minPrice:
        this.minPrice,

      maxPrice:
        this.maxPrice,

      pageNumber:
        this.pageNumber,

      pageSize:
        this.pageSize,

      sortBy:
        this.sortBy,

      sortDescending:
        this.sortDescending

    };


    this.productService
      .getProducts(params)
      .subscribe({

        next: (response) =>
        {

          this.products =
            response.items ?? [];

          this.totalPages =
            response.totalPages ?? 0;

          /*
           * If your API returns totalItems,
           * this will be used by the grid.
           */
          this.totalItems = this.products.length;

          this.isLoading = false;

          this.cdr.detectChanges();
        },


        error: (error) =>
        {

          console.error(
            'PRODUCT API ERROR:',
            error
          );

          this.products = [];

          this.totalPages = 0;

          this.totalItems = 0;

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ??
            error?.message ??
            'Unable to load products.';

          this.cdr.detectChanges();
        }

      });
  }


  // =========================================================
  // CATEGORIES
  // =========================================================

  private loadCategories(): void
  {

    this.categoryService
      .getCategories()
      .subscribe({

        next: (categories) =>
        {

          this.categories =
            categories;

          this.cdr.detectChanges();
        },


        error: (error) =>
        {

          console.error(
            'CATEGORY API ERROR:',
            error
          );

          this.errorMessage =
            'Unable to load categories.';

          this.cdr.detectChanges();
        }

      });
  }

  // =========================================================
  // GRID SORT
  // =========================================================

  onGridSortChange(sort: {
    column: string;
    direction: 'asc' | 'desc';
  }): void
  {

    /*
     * Map grid column → API sorting.
     */

    this.sortBy = sort.column;

    this.sortDescending =
      sort.direction === 'desc';

    this.pageNumber = 1;

    this.loadProducts();
  }
  openCategories(): void
  {

    this.router.navigate([
      '/admin/categories'
    ]);
  }


  openAddProduct(): void
  {

    this.router.navigate([
      '/admin/products/new'
    ]);
  }


  editProduct(
    product: Product
  ): void
  {

    this.router.navigate([
      '/admin/products',
      product.id,
      'edit'
    ]);
  }


  deleteProduct(
    product: Product
  ): void
  {

    const dialogRef =
      this.dialog.open(
        AppConfirmDialog,
        {
          width: '420px',

          data: {
            title: 'Delete Product',

            message:
              `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,

            confirmText: 'Delete',

            cancelText: 'Cancel',

            danger: true
          }
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(confirmed =>
      {

        if (!confirmed)
        {
          return;
        }


        this.productService
          .deleteProduct(product.id)
          .subscribe({

            next: () =>
            {

              this.products =
                this.products.filter(
                  p => p.id !== product.id
                );

              this.cdr.detectChanges();
            },


            error: (error) =>
            {

              console.error(
                'DELETE PRODUCT ERROR:',
                error
              );

              this.errorMessage =
                error?.error?.message ??
                'Failed to delete product.';

              this.cdr.detectChanges();
            }

          });

      });
  }
}