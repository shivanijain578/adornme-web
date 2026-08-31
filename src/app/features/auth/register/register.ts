import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,CommonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register
{

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  errorMessage = '';

  registerForm = this.fb.nonNullable.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ]

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

        },

        error: (error: { error: { message: string; }; }) =>
        {

          this.errorMessage =
            error?.error?.message ??
            'Registration failed.';
        }

      });
  }
}
