import
{
    ChangeDetectorRef, Component, inject,
    OnDestroy,
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

import
{
    MatIconModule
} from '@angular/material/icon';

import
{
    MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import
{
    Category
} from '../../../core/models/Category/category.model';

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
import
{
    AppButton
} from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';

import
{
    AppCheckbox
} from '../../../shared/components/Basic_Material_wrappers/app-checkbox/app-checkbox';

import
{
    AppDropdown
} from '../../../shared/components/Basic_Material_wrappers/app-dropdown/app-dropdown';

import
{
    AppFormField
} from '../../../shared/components/Basic_Material_wrappers/app-form-field/app-form-field';

import
{
    AppTextarea
} from '../../../shared/components/Basic_Material_wrappers/app-textarea/app-textarea';

import
{
    AssetUrlPipe
} from '../../../shared/pipes/asset-url.pipe';
import { NotificationService } from '../../../core/services/Notification/notification';


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
        AppButton,

        AssetUrlPipe
    ],

    templateUrl: './product-form.html',

    styleUrl: './product-form.scss'

})
export class ProductForm implements OnInit, OnDestroy
{
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly productService = inject(ProductService);
    private readonly categoryService = inject(CategoryService);
    private readonly notificationService = inject(NotificationService);
    private readonly cdr = inject(ChangeDetectorRef);
    readonly productId = Number(this.route.snapshot.paramMap.get('id')) || null;
    readonly isEditMode = this.productId !== null;
    categories: Category[] = [];
    isLoading = false;
    isSaving = false;
    errorMessage = '';
    imageErrorMessage = '';
    selectedImages: File[] = [];
    selectedImageUrls: string[] = [];
    existingImageUrls: string[] = [];
    genderOptions = [
        { id: 1, name: 'Women' },
        { id: 2, name: 'Men' },
        { id: 3, name: 'Unisex' }
    ];
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
        originalPrice: [
            0,
            [
                Validators.required,
                Validators.min(0.01)
            ]
        ],
        sellingPrice: [
            0,
            [
                Validators.required,
                Validators.min(0.01)
            ]
        ],
        stockQuantity: [
            0,
            [
                Validators.required,
                Validators.min(0)
            ]
        ],
        material: [''],
        gender: [0],
        categoryId: [
            0,
            [
                Validators.required,
                Validators.min(1)
            ]
        ],
        isVisible: [true]
    });


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


    submit(): void
    {

        this.productForm.markAllAsTouched();


        const pricingValid =
            this.validatePricing();


        const imagesValid =
            this.validateImages();


        if (

            this.productForm.invalid ||

            !pricingValid ||

            !imagesValid ||

            this.isSaving

        )
        {

            return;

        }


        this.isSaving = true;

        this.errorMessage = '';


        const request:
            ProductRequest = {

            ...this.productForm.getRawValue(),

            images:
                this.selectedImages

        };


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


                this.notificationService
                    .showSuccess(

                        this.isEditMode

                            ? 'Product updated successfully.'

                            : 'Product added successfully.'

                    );


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


                this.isSaving = false;

                this.cdr.detectChanges();

            }

        });

    }


    private validatePricing(): boolean
    {

        const originalPrice =
            Number(
                this.productForm.controls
                    .originalPrice.value
            );


        const sellingPrice =
            Number(
                this.productForm.controls
                    .sellingPrice.value
            );


        const sellingPriceControl =
            this.productForm.controls
                .sellingPrice;


        if (

            originalPrice > 0 &&

            sellingPrice > originalPrice

        )
        {

            sellingPriceControl.setErrors({

                ...sellingPriceControl.errors,

                priceExceedsMrp: true

            });


            return false;

        }


        const errors =
            sellingPriceControl.errors;


        if (
            errors?.['priceExceedsMrp']
        )
        {

            const {
                priceExceedsMrp,
                ...remainingErrors
            } = errors;


            sellingPriceControl.setErrors(

                Object.keys(
                    remainingErrors
                ).length > 0

                    ? remainingErrors

                    : null

            );

        }


        return true;

    }


    private validateImages(): boolean
    {

        /*
         * New product requires at least
         * one image.
         */
        if (

            this.productId === null &&

            this.selectedImages.length === 0

        )
        {

            this.imageErrorMessage =
                'At least 1 product image is required.';


            return false;

        }


        /*
         * Maximum three selected images.
         */
        if (
            this.selectedImages.length > 3
        )
        {

            this.imageErrorMessage =
                'Maximum 3 product images are allowed.';


            return false;

        }


        this.imageErrorMessage = '';

        return true;

    }


    onImagesSelected(
        event: Event
    ): void
    {

        const input =
            event.target as HTMLInputElement;


        const files =
            Array.from(
                input.files ?? []
            );


        this.imageErrorMessage = '';


        if (files.length === 0)
        {

            return;

        }


        /*
         * Maximum 3 images.
         */
        if (files.length > 3)
        {

            this.imageErrorMessage =
                'Maximum 3 product images are allowed.';


            input.value = '';

            return;

        }


        /*
         * Validate image type and size.
         */
        const invalidFile =
            files.find(

                file =>

                    !file.type.startsWith(
                        'image/'
                    ) ||

                    file.size >
                    5 * 1024 * 1024

            );


        if (invalidFile)
        {

            this.imageErrorMessage =
                'Each image must be a valid image file up to 5 MB.';


            input.value = '';

            return;

        }


        this.selectedImageUrls
            .forEach(
                url =>
                    URL.revokeObjectURL(url)
            );


        this.selectedImages =
            files;


        this.selectedImageUrls =
            files.map(

                file =>
                    URL.createObjectURL(file)

            );

    }


    removeSelectedImage(
        index: number
    ): void
    {

        const previewUrl =
            this.selectedImageUrls[index];


        if (previewUrl)
        {

            URL.revokeObjectURL(
                previewUrl
            );

        }


        this.selectedImages =
            this.selectedImages.filter(

                (_, currentIndex) =>
                    currentIndex !== index

            );


        this.selectedImageUrls =
            this.selectedImageUrls.filter(

                (_, currentIndex) =>
                    currentIndex !== index

            );


        this.imageErrorMessage = '';

    }


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


                    this.cdr.detectChanges();

                }

            });

    }


    private loadProduct(
        id: number
    ): void
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


                    this.existingImageUrls =
                        product.images.map(
                            image =>
                                image.imageUrl
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


                    this.isLoading = false;

                    this.cdr.detectChanges();

                }

            });

    }


    private toFormValue(
        product: Product
    ): ProductRequest
    {

        return {

            name:
                product.name,


            description:
                product.description,


            originalPrice:
                product.originalPrice,


            sellingPrice:
                product.sellingPrice,


            stockQuantity:
                product.stockQuantity,


            material:
                product.material ?? '',


            gender:
                product.gender,


            categoryId:
                product.categoryId,


            isVisible:
                product.isVisible

        };

    }


    ngOnDestroy(): void
    {

        this.selectedImageUrls
            .forEach(
                url =>
                    URL.revokeObjectURL(url)
            );

    }

}