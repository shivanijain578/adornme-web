import
{
  Component,
  forwardRef,
  Input
} from '@angular/core';

import
{
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import
{
  MatRadioModule
} from '@angular/material/radio';

export interface RadioOption<T = any>
{
  label: string;
  value: T;
}

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [
    MatRadioModule
  ],
  templateUrl: './app-radio.html',
  styleUrl: './app-radio.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppRadio),
      multi: true
    }
  ]
})
export class AppRadio<T = any>
  implements ControlValueAccessor
{

  @Input() label = '';

  @Input() options: RadioOption<T>[] = [];

  @Input() disabled = false;

  @Input() direction: 'row' | 'column' = 'row';

  value: T | null = null;

  private onChange: (value: T | null) => void = () => { };

  private onTouched: () => void = () => { };

  writeValue(value: T | null): void
  {
    this.value = value;
  }

  registerOnChange(fn: (value: T | null) => void): void
  {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void
  {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void
  {
    this.disabled = isDisabled;
  }

  onValueChange(value: T): void
  {

    this.value = value;

    this.onChange(value);

    this.onTouched();
  }
}