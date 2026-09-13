import
{
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self
} from '@angular/core';

import
{
  ControlValueAccessor,
  FormsModule,
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

  selector: 'app-form-field',

  standalone: true,

  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],

  templateUrl: './app-form-field.html',

  styleUrl: './app-form-field.scss'

})


export class AppFormField
  implements ControlValueAccessor
{


  @Input()
  label = '';


  @Input()
  placeholder = '';


  @Input()
  type:
    | 'text'
    | 'number'
    | 'email'
    | 'tel'
    | 'url'
    | 'password'
    = 'text';


  @Input()
  hint = '';


  @Input()
  required = false;


  @Input()
  min?: number;


  @Input()
  max?: number;


  @Input()
  step?: number | string;


  @Input()
  set value(
    value: string | number
  )
  {

    this._value = value;

  }


  get value(): string | number
  {

    return this._value;

  }


  @Output()
  valueChange =
    new EventEmitter<
      string | number
    >();


  private _value:
    string | number = '';


  disabled = false;


  private onChange:
    (value: string | number) => void =
    () => { };


  private onTouched:
    () => void =
    () => { };


  constructor(

    @Optional()
    @Self()
    public ngControl: NgControl

  )
  {

    if (this.ngControl)
    {

      this.ngControl.valueAccessor =
        this;

    }

  }


  writeValue(
    value: string | number | null
  ): void
  {

    this.value =
      value ?? '';

  }


  registerOnChange(
    fn: (value: string | number) => void
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

    this.disabled =
      isDisabled;

  }


  onInput(
    event: Event
  ): void
  {

    const input =
      event.target as HTMLInputElement;


    let value:
      string | number =
      input.value;


    if (this.type === 'number')
    {

      value =
        input.value === ''
          ? ''
          : Number(input.value);

    }


    this.value = value;

    this.onChange(value);

    this.valueChange.emit(value);

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


    /*
     * Required
     */
    if (errors['required'])
    {

      return (
        `${this.label} is required.`
      );

    }


    /*
     * Email
     */
    if (errors['email'])
    {

      return (
        'Please enter a valid email address.'
      );

    }


    /*
     * Minimum length
     */
    if (errors['minlength'])
    {

      return (
        `${this.label} must be at least ` +
        `${errors['minlength'].requiredLength} ` +
        `characters.`
      );

    }


    /*
     * Maximum length
     */
    if (errors['maxlength'])
    {

      return (
        `${this.label} must be at most ` +
        `${errors['maxlength'].requiredLength} ` +
        `characters.`
      );

    }


    /*
     * Minimum number
     */
    if (errors['min'])
    {

      return (
        `${this.label} must be at least ` +
        `${errors['min'].min}.`
      );

    }


    /*
     * Maximum number
     */
    if (errors['max'])
    {

      return (
        `${this.label} must be at most ` +
        `${errors['max'].max}.`
      );

    }


    /*
     * Product pricing
     */
    if (errors['priceExceedsMrp'])
    {

      return (
        'Selling price cannot be greater than MRP.'
      );

    }


    /*
     * Pattern
     */
    if (errors['pattern'])
    {

      return (
        `${this.label} has an invalid format.`
      );

    }


    /*
     * Server validation
     */
    if (errors['serverError'])
    {

      return errors['serverError'];

    }


    return (
      'Please enter a valid value.'
    );

  }

}