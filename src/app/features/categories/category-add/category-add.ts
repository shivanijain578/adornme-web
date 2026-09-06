import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryRequest } from '../../../core/models/Category/category.model';
import { CategoryService } from '../../../core/services/Category/category.service';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';
import { AppFormField } from '../../../shared/components/Basic_Material_wrappers/app-form-field/app-form-field';
import { AppTextarea } from '../../../shared/components/Basic_Material_wrappers/app-textarea/app-textarea';

@Component({
  selector: 'app-category-add',
  imports: [ReactiveFormsModule, RouterLink, AppButton, AppFormField, AppTextarea],
  templateUrl: './category-add.html',
  styleUrl: './category-add.scss',
})
export class CategoryAdd implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  isSaving = false;
  errorMessage = '';

  categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    imageUrl: [''],
    isActive: [true]  // Add this field
  });

  ngOnInit(): void
  {
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

    this.categoryService.createCategory(request).subscribe({
      next: () =>
      {
        this.isSaving = false;
        this.router.navigate(['/admin/categories']);
        this.cdr.detectChanges();
      },
      error: (error) =>
      {
        this.errorMessage = error?.error?.message ?? 'Unable to create category.';
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
