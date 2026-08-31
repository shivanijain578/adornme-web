import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category, CategoryRequest } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.scss',
})
export class CategoryEdit implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);

  readonly categoryId = Number(this.route.snapshot.paramMap.get('id'));
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]]
  });

  ngOnInit(): void
  {
    if (!this.categoryId)
    {
      this.router.navigate(['/admin/categories']);
      return;
    }

    this.loadCategory();
  }

  submit(): void
  {
    if (this.categoryForm.invalid || this.isSaving)
    {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    const request: CategoryRequest = this.categoryForm.getRawValue();

    this.categoryService.updateCategory(this.categoryId, request).subscribe({
      next: () => this.router.navigate(['/admin/categories']),
      error: error => {
        this.errorMessage = error?.error?.message ?? 'Unable to save category.';
        this.isSaving = false;
      }
    });
  }

  private loadCategory(): void
  {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: categories => {
        const category = categories.find(item => item.id === this.categoryId);

        if (!category)
        {
          this.errorMessage = 'Category was not found.';
        }
        else
        {
          this.categoryForm.patchValue(this.toFormValue(category));
        }

        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error?.error?.message ?? 'Unable to load category.';
        this.isLoading = false;
      }
    });
  }

  private toFormValue(category: Category): CategoryRequest
  {
    return {
      name: category.name,
      description: category.description ?? ''
    };
  }
}
