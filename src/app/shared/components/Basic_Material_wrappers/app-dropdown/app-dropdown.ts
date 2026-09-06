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
  NgControl
} from '@angular/forms';

import { MatFormFieldModule }
  from '@angular/material/form-field';

import { MatSelectModule }
  from '@angular/material/select';


@Component({
  selector: 'app-dropdown',
  standalone: true,

  imports: [
    MatFormFieldModule,
    MatSelectModule
  ],

  templateUrl: './app-dropdown.html',
  styleUrl: './app-dropdown.scss'
})
export class AppDropdown
  implements ControlValueAccessor
{

  @Input()
  label = '';

  @Input()
  placeholder = 'Select';

  @Input()
  options: any[] = [];

  @Input()
  optionLabel = 'label';

  @Input()
  optionValue = 'value';

  @Input()
  required = false;

  /*
   * Allows both:
   *
   * [value]="selectedCategoryId"
   *
   * and:
   *
   * formControlName="categoryId"
   */
  @Input()
  set value(value: any)
  {
    this._value = value;
  }

  get value(): any
  {
    return this._value;
  }

  @Output()
  valueChange =
    new EventEmitter<any>();


  private _value: any = null;

  disabled = false;


  private onChange =
    (value: any) => { };

  public onTouched =
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


  // =====================================================
  // CONTROL VALUE ACCESSOR
  // =====================================================

  writeValue(value: any): void
  {

    this._value = value;
  }


  registerOnChange(fn: any): void
  {

    this.onChange = fn;
  }


  registerOnTouched(fn: any): void
  {

    this.onTouched = fn;
  }


  setDisabledState(
    isDisabled: boolean
  ): void
  {

    this.disabled = isDisabled;
  }


  // =====================================================
  // VALUE CHANGE
  // =====================================================

  selectValue(value: any): void
  {

    this._value = value;

    this.onChange(value);

    this.valueChange.emit(value);
  }


  // =====================================================
  // OPTION HELPERS
  // =====================================================

  getOptionLabel(
    option: any
  ): string
  {

    if (
      option === null ||
      option === undefined
    )
    {
      return '';
    }

    return String(
      option[this.optionLabel]
    );
  }


  getOptionValue(
    option: any
  ): any
  {

    if (
      option === null ||
      option === undefined
    )
    {
      return null;
    }

    return option[this.optionValue];
  }


  // =====================================================
  // VALIDATION
  // =====================================================

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

    if (
      this.ngControl?.errors?.['required']
    )
    {
      return `${this.label} is required.`;
    }

    return 'Please select a valid value.';
  }
}