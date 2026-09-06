import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/Auth/auth.service';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';
import { AppFormField } from '../../../shared/components/Basic_Material_wrappers/app-form-field/app-form-field';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule, CommonModule, AppFormField, AppButton
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register
{

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  errorMessage = '';

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  submit(): void
  {

    if (this.registerForm.invalid)
    {

      this.registerForm.markAllAsTouched();

      return;
    }

    this.errorMessage = '';

    this.authService
      .register(this.registerForm.getRawValue())
      .subscribe({

        next: () =>
        {

          this.router.navigate(['/login']);
          this.cdr.detectChanges();

        },

        error: (error: { error: { message: string; }; }) =>
        {

          this.errorMessage =
            error?.error?.message ??
            'Registration failed.';
          this.cdr.detectChanges();
        }

      });
  }
}
