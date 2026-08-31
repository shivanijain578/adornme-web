import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryRequest } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-add',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-add.html',
  styleUrl: './category-add.scss',
})
export class CategoryAdd
{
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);

  isSaving = false;
  errorMessage = '';

  categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]]
  });

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

    this.categoryService.createCategory(request).subscribe({
      next: () => this.router.navigate(['/admin/categories']),
      error: error => {
        this.errorMessage = error?.error?.message ?? 'Unable to add category.';
        this.isSaving = false;
      }
    });
  }
}
