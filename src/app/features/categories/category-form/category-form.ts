import
{
  Component,
  inject,
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
  Category,
  CategoryRequest
} from '../../../core/models/Category/category.model';

import
{
  CategoryService
} from '../../../core/services/Category/category.service';

import
{
  NotificationService
} from '../../../core/services/Notification/notification';

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


@Component({
  selector: 'app-category-form',

  imports: [
    ReactiveFormsModule,
    RouterLink,
    AppButton,
    AppCheckbox,
    AppFormField,
    AppTextarea,
    AssetUrlPipe
  ],

  templateUrl: './category-form.html',

  styleUrl: './category-form.scss'
})
export class CategoryForm
  implements OnInit, OnDestroy
{
  private readonly fb =
    inject(FormBuilder);


  private readonly route =
    inject(ActivatedRoute);


  private readonly router =
    inject(Router);


  private readonly categoryService =
    inject(CategoryService);


  private readonly notificationService =
    inject(NotificationService);


  readonly categoryId =
    Number(
      this.route.snapshot.paramMap.get('id')
    ) || null;


  readonly isEditMode =
    this.categoryId !== null;


  isSaving = false;

  isImageLoading = false;

  errorMessage = '';

  imageErrorMessage = '';


  selectedImage: File | null = null;

  imagePreview: string | null = null;

  existingImageUrl: string | null = null;


  categoryForm =
    this.fb.nonNullable.group({

      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        [
          Validators.maxLength(500)
        ]
      ],

      isVisible: [
        true
      ]

    });


  ngOnInit(): void
  {
    if (this.isEditMode)
    {
      this.loadCategory();
    }
  }


  ngOnDestroy(): void
  {
    this.revokeImagePreview();
  }


  onImageSelected(
    event: Event
  ): void
  {
    const input =
      event.target as HTMLInputElement;


    const file =
      input.files?.[0];


    if (!file)
    {
      return;
    }


    this.imageErrorMessage = '';


    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];


    if (!allowedTypes.includes(file.type))
    {
      this.imageErrorMessage =
        'Only JPG, JPEG, PNG and WEBP images are allowed.';

      input.value = '';

      return;
    }


    if (file.size > 5 * 1024 * 1024)
    {
      this.imageErrorMessage =
        'Image size cannot exceed 5 MB.';

      input.value = '';

      return;
    }


    this.isImageLoading = true;

    this.selectedImage = file;


    this.revokeImagePreview();


    const reader =
      new FileReader();


    reader.onload = () =>
    {
      this.imagePreview =
        reader.result as string;

      this.isImageLoading = false;
    };


    reader.onerror = () =>
    {
      this.selectedImage = null;

      this.imagePreview = null;

      this.imageErrorMessage =
        'Unable to read the selected image. Please try again.';

      this.isImageLoading = false;

      input.value = '';
    };


    reader.readAsDataURL(file);
  }


  removeSelectedImage(): void
  {
    this.selectedImage = null;

    this.imagePreview = null;

    this.imageErrorMessage = '';

    this.isImageLoading = false;


    const input =
      document.getElementById(
        'category-image'
      ) as HTMLInputElement | null;


    if (input)
    {
      input.value = '';
    }
  }


  submit(): void
  {
    this.categoryForm.markAllAsTouched();


    if (
      this.categoryForm.invalid ||
      this.isSaving ||
      this.isImageLoading
    )
    {
      return;
    }


    if (
      !this.isEditMode &&
      !this.selectedImage
    )
    {
      this.imageErrorMessage =
        'Category image is required.';

      return;
    }


    this.isSaving = true;

    this.errorMessage = '';


    const request: CategoryRequest =
      this.categoryForm.getRawValue();


    const saveRequest =
      this.isEditMode
        ? this.categoryService.updateCategory(
          this.categoryId!,
          request,
          this.selectedImage ?? undefined
        )
        : this.categoryService.createCategory(
          request,
          this.selectedImage!
        );


    saveRequest.subscribe({

      next: () =>
      {
        this.notificationService.showSuccess(
          this.isEditMode
            ? 'Category updated successfully.'
            : 'Category created successfully.'
        );


        this.router.navigate([
          '/admin/categories'
        ]);
      },


      error: () =>
      {
        this.isSaving = false;
      }

    });
  }


  private loadCategory(): void
  {
    this.categoryService
      .getCategories()
      .subscribe({

        next: categories =>
        {
          const category =
            categories.find(
              item =>
                item.id ===
                this.categoryId
            );


          if (!category)
          {
            this.errorMessage =
              'Category was not found.';

            return;
          }


          this.patchCategory(
            category
          );
        },


        error: () =>
        {
          this.errorMessage =
            'Unable to load category.';
        }

      });
  }


  private patchCategory(
    category: Category
  ): void
  {
    this.categoryForm.patchValue({

      name:
        category.name,

      description:
        category.description ?? '',

      isVisible:
        category.isVisible

    });


    this.existingImageUrl =
      category.imageUrl ?? null;
  }


  private revokeImagePreview(): void
  {
    /*
     * imagePreview is a FileReader data URL,
     * so there is no object URL to revoke.
     *
     * This method is intentionally kept as a
     * single cleanup point for future changes.
     */
  }
}