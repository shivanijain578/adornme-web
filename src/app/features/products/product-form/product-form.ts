import
{
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';

import
{
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import
{
    ActivatedRoute,
    Router,
    RouterLink
} from '@angular/router';

import { MatIconModule }
    from '@angular/material/icon';

import { MatProgressSpinnerModule }
    from '@angular/material/progress-spinner';

import { Category }
    from '../../../core/models/Category/category.model';

import
{
    ProductRequest,
    Product
} from '../../../core/models/Product/product.model';

import
{
    CategoryService
} from '../../../core/services/Category/category.service';

import
{
    ProductService
} from '../../../core/services/Product/product.service';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';
import { AppCheckbox } from '../../../shared/components/Basic_Material_wrappers/app-checkbox/app-checkbox';
import { AppDropdown } from '../../../shared/components/Basic_Material_wrappers/app-dropdown/app-dropdown';
import { AppFormField } from '../../../shared/components/Basic_Material_wrappers/app-form-field/app-form-field';
import { AppTextarea } from '../../../shared/components/Basic_Material_wrappers/app-textarea/app-textarea';


@Component({
    selector: 'app-product-form',

    imports: [
        ReactiveFormsModule,
        RouterLink,

        MatIconModule,
        MatProgressSpinnerModule,

        AppFormField,
        AppTextarea,
        AppDropdown,
        AppCheckbox,
        AppButton
    ],

    templateUrl: './product-form.html',

    styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit
{

    private readonly fb =
        inject(FormBuilder);

    private readonly route =
        inject(ActivatedRoute);

    private readonly router =
        inject(Router);

    private readonly productService =
        inject(ProductService);

    private readonly categoryService =
        inject(CategoryService);

    private readonly cdr =
        inject(ChangeDetectorRef);


    // =====================================================
    // PRODUCT
    // =====================================================

    readonly productId =
        Number(
            this.route.snapshot.paramMap.get('id')
        ) || null;

    readonly isEditMode =
        this.productId !== null;


    // =====================================================
    // STATE
    // =====================================================

    categories: Category[] = [];

    isLoading = false;

    isSaving = false;

    errorMessage = '';


    // =====================================================
    // FORM
    // =====================================================

    productForm = this.fb.nonNullable.group({

        name: [
            '',
            [
                Validators.required,
                Validators.maxLength(120)
            ]
        ],

        description: [
            '',
            [
                Validators.required,
                Validators.maxLength(2000)
            ]
        ],

        price: [
            0,
            [
                Validators.required,
                Validators.min(0)
            ]
        ],

        stockQuantity: [
            0,
            [
                Validators.required,
                Validators.min(0)
            ]
        ],

        imageUrl: [
            ''
        ],

        categoryId: [
            0,
            [
                Validators.required,
                Validators.min(1)
            ]
        ],

        isActive: [
            true
        ]

    });


    // =====================================================
    // INIT
    // =====================================================

    ngOnInit(): void
    {

        this.loadCategories();

        if (this.productId !== null)
        {

            this.loadProduct(
                this.productId
            );

        }
    }


    // =====================================================
    // SUBMIT
    // =====================================================

    submit(): void
    {

        if (
            this.productForm.invalid ||
            this.isSaving
        )
        {

            this.productForm.markAllAsTouched();

            return;
        }


        this.isSaving = true;

        this.errorMessage = '';


        const request = this.productForm.getRawValue();


        const saveRequest =
            this.productId === null

                ? this.productService
                    .createProduct(request)

                : this.productService
                    .updateProduct(
                        this.productId,
                        request
                    );


        saveRequest.subscribe({

            next: () =>
            {

                this.isSaving = false;

                /*
                 * Navigate back to ADMIN products.
                 */
                this.router.navigate([
                    '/admin/products'
                ]);

            },


            error: (error) =>
            {

                console.error(
                    'PRODUCT SAVE ERROR:',
                    error
                );

                this.errorMessage =
                    error?.error?.message ??
                    'Unable to save product.';

                this.isSaving = false;

                this.cdr.detectChanges();
            }

        });
    }


    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

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


    // =====================================================
    // LOAD PRODUCT
    // =====================================================

    private loadProduct(id: number): void
    {

        this.isLoading = true;

        this.productService
            .getProductById(id)
            .subscribe({

                next: (product) =>
                {

                    this.productForm.patchValue(
                        this.toFormValue(product)
                    );

                    this.isLoading = false;

                    this.cdr.detectChanges();
                },


                error: (error) =>
                {

                    console.error(
                        'PRODUCT LOAD ERROR:',
                        error
                    );

                    this.errorMessage =
                        error?.error?.message ??
                        'Unable to load product.';

                    this.isLoading = false;

                    this.cdr.detectChanges();
                }

            });
    }


    // =====================================================
    // PRODUCT → FORM
    // =====================================================

    private toFormValue(
        product: Product
    ): ProductRequest
    {

        return {

            name:
                product.name,

            description:
                product.description,

            price:
                product.price,

            stockQuantity:
                product.stockQuantity,

            imageUrl:
                product.imageUrl ?? '',

            categoryId:
                product.categoryId,

            isActive:
                product.isActive

        };
    }
}