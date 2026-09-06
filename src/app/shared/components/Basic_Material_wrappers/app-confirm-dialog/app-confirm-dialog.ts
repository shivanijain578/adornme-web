import
{
  Component,
  Inject
} from '@angular/core';

import
{
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import
{
  MatButtonModule
} from '@angular/material/button';

import
{
  MatIconModule
} from '@angular/material/icon';

export interface ConfirmDialogData
{
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,

  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],

  templateUrl: './app-confirm-dialog.html',
  styleUrl: './app-confirm-dialog.scss'
})
export class AppConfirmDialog
{

  constructor(
    private readonly dialogRef:
      MatDialogRef<AppConfirmDialog>,

    @Inject(MAT_DIALOG_DATA)
    public readonly data:
      ConfirmDialogData
  ) { }


  cancel(): void
  {

    this.dialogRef.close(false);
  }


  confirm(): void
  {

    this.dialogRef.close(true);
  }
}