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

@Component({
  selector: 'app-filter-panel',
  standalone: true,

  imports: [
    MatButtonModule,
    MatIconModule
  ],

  templateUrl: './app-filter-panel.html',
  styleUrl: './app-filter-panel.scss'
})
export class AppFilterPanel
{

  @Input() title =
    'Filters';

  @Input() showReset = true;

  @Input() showApply = true;

  @Output()
  apply =
    new EventEmitter<void>();

  @Output()
  reset =
    new EventEmitter<void>();


  onApply(): void
  {
    this.apply.emit();
  }


  onReset(): void
  {
    this.reset.emit();
  }
}