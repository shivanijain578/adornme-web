import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login
{

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  errorMessage = '';

  loginForm = this.fb.nonNullable.group({

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
        Validators.required
      ]
    ]

  });

  submit(): void
  {

    if (this.loginForm.invalid)
    {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.errorMessage = '';

    this.authService
      .login(this.loginForm.getRawValue())
      .subscribe({

        next: response =>
        {

          this.router.navigate(['/home']);

        },

        error: error =>
        {

          this.errorMessage =
            error?.error?.message ??
            'Invalid email or password.';
        }

      });
  }
}