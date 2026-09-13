import
{
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import
{
  RouterLink
} from '@angular/router';

import
{
  Category
} from '../../../core/models/Category/category.model';

import
{
  CategoryService
} from '../../../core/services/Category/category.service';

import
{
  AppButton
} from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';

import
{
  AssetUrlPipe
} from '../../../shared/pipes/asset-url.pipe';


@Component({
  selector: 'app-category-list',

  imports: [
    RouterLink,
    AppButton,
    AssetUrlPipe
  ],

  templateUrl: './category-list.html',

  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit
{
  private readonly categoryService =
    inject(CategoryService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  categories: Category[] = [];

  isLoading = false;

  errorMessage = '';


  ngOnInit(): void
  {
    this.loadCategories();
  }


  deleteCategory(
    category: Category
  ): void
  {
    if (
      !confirm(
        `Delete the ${category.name} category?`
      )
    )
    {
      return;
    }


    this.categoryService
      .deleteCategory(category.id)
      .subscribe({

        next: () =>
        {
          this.loadCategories();

          this.cdr.detectChanges();
        },

        error: error =>
        {
          this.errorMessage =
            error?.error?.message ??
            'Unable to delete category.';

          this.cdr.detectChanges();
        }

      });
  }


  private loadCategories(): void
  {
    this.isLoading = true;

    this.errorMessage = '';


    this.categoryService
      .getCategories()
      .subscribe({

        next: categories =>
        {
          this.categories =
            categories;

          this.isLoading = false;

          this.cdr.detectChanges();
        },

        error: error =>
        {
          this.errorMessage =
            error?.error?.message ??
            'Unable to load categories.';

          this.isLoading = false;

          this.cdr.detectChanges();
        }

      });
  }
}