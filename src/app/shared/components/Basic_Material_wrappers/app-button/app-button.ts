import
{
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import
{
  MatButtonModule
} from '@angular/material/button';

import
{
  MatIconModule
} from '@angular/material/icon';

import
{
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-button',
  standalone: true,

  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './app-button.html',
  styleUrl: './app-button.scss'
})
export class AppButton
{

  @Input() text = '';

  @Input() icon = '';

  @Input() ariaLabel = '';

  @Input() iconOnly = false;

  @Input() ariaExpanded: boolean | null = null;

  @Input() type:
    | 'button'
    | 'submit'
    | 'reset'
    = 'button';

  @Input() disabled = false;

  @Input() loading = false;

  @Input() appearance:
    | 'primary'
    | 'stroked'
    | 'text'
    = 'primary';

  @Output()
  clicked =
    new EventEmitter<void>();


  onClick(): void
  {

    if (
      this.disabled ||
      this.loading
    )
    {
      return;
    }

    this.clicked.emit();
  }
}