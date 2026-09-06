import
  {
    Component,
    EventEmitter,
    Input,
    Output
  } from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './app-datepicker.html',
  styleUrl: './app-datepicker.scss'
})
export class AppDatePicker
{

  @Input() label = 'Date';

  @Input() placeholder = 'Select date';

  @Input() value: Date | null = null;

  @Input() min: Date | null = null;

  @Input() max: Date | null = null;

  @Input() disabled = false;

  @Input() required = false;

  @Output() valueChange =
    new EventEmitter<Date | null>();

  onDateChange(date: Date | null): void
  {
    this.value = date;
    this.valueChange.emit(date);
  }
}