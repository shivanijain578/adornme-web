import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService
{
  private readonly snackBar = inject(MatSnackBar);

  showSuccess(message: string): void
  {
    this.snackBar.open(message, '×', {
      duration: 3500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['notification-success']
    });
  }

  showError(message: string): void
  {
    this.snackBar.open(message, '×', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['notification-error']
    });
  }

  showInfo(message: string): void
  {
    this.snackBar.open(message, '×', {
      duration: 3500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['notification-info']
    });
  }

  showWarning(message: string): void
  {
    this.snackBar.open(message, '×', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['notification-warning']
    });
  }
}