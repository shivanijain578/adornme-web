import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryRequest, Category } from '../../../core/models/Category/category.model';
import { CategoryService } from '../../../core/services/Category/category.service';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';
import { AppFormField } from '../../../shared/components/Basic_Material_wrappers/app-form-field/app-form-field';
import { AppTextarea } from '../../../shared/components/Basic_Material_wrappers/app-textarea/app-textarea';

@Component({
  selector: 'app-category-edit',
  imports: [ReactiveFormsModule, RouterLink, AppButton, AppFormField, AppTextarea],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.scss',
})
export class CategoryEdit implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly cdr = inject(ChangeDetectorRef);

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
      next: () =>
      {
        this.router.navigate(['/admin/categories']);
        this.cdr.detectChanges();
      },
      error: error =>
      {
        this.errorMessage = error?.error?.message ?? 'Unable to save category.';
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadCategory(): void
  {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: categories =>
      {
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
        this.cdr.detectChanges();
      },
      error: error =>
      {
        this.errorMessage = error?.error?.message ?? 'Unable to load category.';
        this.isLoading = false;
        this.cdr.detectChanges();
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
