import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product, ProductRequest } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
    selector: 'app-product-form',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './product-form.html',
    styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit
{
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly productService = inject(ProductService);
    private readonly categoryService = inject(CategoryService);

    readonly productId = Number(this.route.snapshot.paramMap.get('id')) || null;
    readonly isEditMode = this.productId !== null;

    categories: Category[] = [];
    isLoading = false;
    isSaving = false;
    errorMessage = '';

    productForm = this.fb.nonNullable.group({
        name: ['', [Validators.required, Validators.maxLength(120)]],
        description: ['', [Validators.required, Validators.maxLength(2000)]],
        price: [0, [Validators.required, Validators.min(0)]],
        stockQuantity: [0, [Validators.required, Validators.min(0)]],
        imageUrl: [''],
        categoryId: [0, [Validators.required, Validators.min(1)]],
        isActive: [true]
    });

    ngOnInit(): void
    {
        this.loadCategories();

        if (this.productId !== null)
        {
            this.loadProduct(this.productId);
        }
    }

    submit(): void
    {
        if (this.productForm.invalid || this.isSaving)
        {
            this.productForm.markAllAsTouched();
            return;
        }

        this.isSaving = true;
        this.errorMessage = '';
        const request = this.productForm.getRawValue() as ProductRequest;
        const saveRequest = this.productId === null
            ? this.productService.createProduct(request)
            : this.productService.updateProduct(this.productId, request);

        saveRequest.subscribe({
            next: () => this.router.navigate(['/products']),
            error: error =>
            {
                this.errorMessage = error?.error?.message ??
                    'Unable to save product.';
                this.isSaving = false;
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

    private loadProduct(id: number): void
    {
        this.isLoading = true;
        this.productService.getProductById(id).subscribe({
            next: product =>
            {
                this.productForm.patchValue(this.toFormValue(product));
                this.isLoading = false;
            },
            error: error =>
            {
                this.errorMessage = error?.error?.message ??
                    'Unable to load product.';
                this.isLoading = false;
            }
        });
    }

    private toFormValue(product: Product): ProductRequest
    {
        return {
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            imageUrl: product.imageUrl ?? '',
            categoryId: product.categoryId,
            isActive: product.isActive
        };
    }
}
