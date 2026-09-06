import
{
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import
{
  MatFormFieldModule
} from '@angular/material/form-field';

import
{
  MatInputModule
} from '@angular/material/input';

import
{
  MatIconModule
} from '@angular/material/icon';

import
{
  MatButtonModule
} from '@angular/material/button';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app-search-box.html',
  styleUrl: './app-search-box.scss'
})
export class AppSearchBox
{

  @Input() placeholder = 'Search...';

  @Input() value = '';

  @Input() debounce = 300;

  @Output()
  valueChange = new EventEmitter<string>();

  @Output()
  search = new EventEmitter<string>();

  private timeout?: ReturnType<typeof setTimeout>;

  onInput(value: string): void
  {

    this.value = value;

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() =>
    {

      this.valueChange.emit(value);

    }, this.debounce);
  }

  onSearch(): void
  {

    this.search.emit(this.value);
  }

  clear(): void
  {

    this.value = '';

    this.valueChange.emit('');

    this.search.emit('');
  }
}