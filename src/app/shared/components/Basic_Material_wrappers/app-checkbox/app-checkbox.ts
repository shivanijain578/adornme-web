import
{
  Component,
  Input,
  Optional,
  Self
} from '@angular/core';

import
{
  ControlValueAccessor,
  NgControl
} from '@angular/forms';

import
{
  MatCheckboxModule
} from '@angular/material/checkbox';

@Component({
  selector: 'app-checkbox',
  standalone: true,

  imports: [
    MatCheckboxModule
  ],

  templateUrl: './app-checkbox.html',
  styleUrl: './app-checkbox.scss'
})
export class AppCheckbox
  implements ControlValueAccessor
{

  @Input() label = '';

  @Input() color:
    | 'primary'
    | 'accent'
    | 'warn'
    = 'primary';

  value = false;

  disabled = false;

  private onChange =
    (value: boolean) => { };

  private onTouched =
    () => { };


  constructor(
    @Optional()
    @Self()
    public ngControl: NgControl
  )
  {

    if (this.ngControl)
    {
      this.ngControl.valueAccessor = this;
    }
  }


  writeValue(
    value: boolean | null
  ): void
  {

    this.value =
      value ?? false;
  }


  registerOnChange(
    fn: (value: boolean) => void
  ): void
  {

    this.onChange = fn;
  }


  registerOnTouched(
    fn: () => void
  ): void
  {

    this.onTouched = fn;
  }


  setDisabledState(
    isDisabled: boolean
  ): void
  {

    this.disabled = isDisabled;
  }


  onCheckedChange(
    value: boolean
  ): void
  {

    this.value = value;

    this.onChange(value);

    this.onTouched();
  }
}