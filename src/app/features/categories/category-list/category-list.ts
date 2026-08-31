import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit
{
  private readonly categoryService = inject(CategoryService);

  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void
  {
    this.loadCategories();
  }

  deleteCategory(category: Category): void
  {
    if (!confirm(`Delete the ${category.name} category?`))
    {
      return;
    }

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => this.loadCategories(),
      error: error => this.errorMessage = error?.error?.message ??
        'Unable to delete category.'
    });
  }

  private loadCategories(): void
  {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error?.error?.message ??
          'Unable to load categories.';
        this.isLoading = false;
      }
    });
  }
}
