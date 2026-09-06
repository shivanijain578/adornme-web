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
  MatFormFieldModule
} from '@angular/material/form-field';

import
{
  MatInputModule
} from '@angular/material/input';

@Component({
  selector: 'app-textarea',
  standalone: true,

  imports: [
    MatFormFieldModule,
    MatInputModule
  ],

  templateUrl: './app-textarea.html',
  styleUrl: './app-textarea.scss'
})
export class AppTextarea
  implements ControlValueAccessor
{

  @Input() label = '';

  @Input() placeholder = '';

  @Input() rows = 5;

  @Input() maxLength?: number;

  @Input() hint = '';

  value = '';

  disabled = false;

  private onChange =
    (value: string) => { };

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
    value: string | null
  ): void
  {

    this.value =
      value ?? '';
  }


  registerOnChange(
    fn: (value: string) => void
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


  onInput(
    event: Event
  ): void
  {

    const textarea =
      event.target as HTMLTextAreaElement;

    this.value =
      textarea.value;

    this.onChange(
      textarea.value
    );
  }


  onBlur(): void
  {

    this.onTouched();
  }


  get hasError(): boolean
  {

    return !!(
      this.ngControl?.invalid &&
      (
        this.ngControl.touched ||
        this.ngControl.dirty
      )
    );
  }


  get errorMessage(): string
  {

    const errors =
      this.ngControl?.errors;

    if (!errors)
    {
      return '';
    }

    if (errors['required'])
    {
      return `${this.label} is required.`;
    }

    if (errors['maxlength'])
    {
      return `${this.label} cannot exceed ${this.maxLength} characters.`;
    }

    return 'Please enter a valid value.';
  }
}