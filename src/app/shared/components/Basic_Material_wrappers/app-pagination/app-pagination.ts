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
  selector: 'app-pagination',
  standalone: true,

  imports: [
    MatButtonModule,
    MatIconModule
  ],

  templateUrl: './app-pagination.html',
  styleUrl: './app-pagination.scss'
})
export class AppPagination
{

  @Input() pageNumber = 1;

  @Input() totalPages = 1;

  @Output()
  pageChange =
    new EventEmitter<number>();


  previous(): void
  {

    if (this.pageNumber <= 1)
    {
      return;
    }

    this.pageChange.emit(
      this.pageNumber - 1
    );
  }


  next(): void
  {

    if (
      this.pageNumber >=
      this.totalPages
    )
    {
      return;
    }

    this.pageChange.emit(
      this.pageNumber + 1
    );
  }
}