import
{
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import
{
  MatIconModule
} from '@angular/material/icon';

import
{
  MatButtonModule
} from '@angular/material/button';

import
{
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import
{
  GridAction,
  GridColumn,
  GridSortEvent,

} from '../../../models/ui/data-grid.model';
import { DatePipe } from '@angular/common';
import { AssetUrlPipe } from '../../../pipes/asset-url.pipe';

@Component({
  selector: 'app-data-grid',
  standalone: true,

  imports: [
    DatePipe,
    AssetUrlPipe,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './app-data-grid.html',
  styleUrl: './app-data-grid.scss'
})
export class AppDataGrid<T extends object>
{
  private readonly assetUrl = new AssetUrlPipe();

  @Input() columns:
    GridColumn<T>[] = [];

  @Input() data:
    T[] = [];

  @Input() actions:
    GridAction<T>[] = [];

  @Input() loading = false;

  @Input() emptyMessage =
    'No records found.';

  @Output()
  sortChange =
    new EventEmitter<GridSortEvent>();


  sortColumn = '';

  sortDirection:
    | 'asc'
    | 'desc'
    = 'asc';


  @Output()
  rowClick =
    new EventEmitter<T>();


  /**
   * Executes the callback defined
   * by the parent component.
   */
  executeAction(
    action: GridAction<T>,
    row: T
  ): void
  {

    action.action(row);
  }


  getValue(
    row: T,
    key: string
  ): any
  {

    return (
      row as Record<string, any>
    )[key];
  }

  getImageUrl(value: unknown): string
  {
    let imageUrl: string | undefined;

    if (typeof value === 'string')
    {
      imageUrl = value;
    }
    else if (Array.isArray(value))
    {
      const image = value.find(item =>
        typeof item === 'object' &&
        item !== null &&
        'imageUrl' in item &&
        typeof item.imageUrl === 'string'
      );

      if (image && typeof image === 'object' && 'imageUrl' in image)
      {
        imageUrl = image.imageUrl as string;
      }
    }
    else if (typeof value === 'object' && value !== null && 'imageUrl' in value)
    {
      imageUrl = typeof value.imageUrl === 'string' ? value.imageUrl : undefined;
    }

    return this.assetUrl.transform(imageUrl);
  }


  sort(
    column: GridColumn<T>
  ): void
  {

    if (!column.sortable)
    {
      return;
    }


    const key =
      column.key;


    if (this.sortColumn === key)
    {

      this.sortDirection =
        this.sortDirection === 'asc'
          ? 'desc'
          : 'asc';

    } else
    {

      this.sortColumn = key;

      this.sortDirection = 'asc';
    }


    this.sortChange.emit({

      column: key,

      direction:
        this.sortDirection

    });
  }


  getSortIcon(
    column: string
  ): string
  {

    if (
      this.sortColumn !== column
    )
    {
      return 'unfold_more';
    }

    return this.sortDirection === 'asc'
      ? 'keyboard_arrow_up'
      : 'keyboard_arrow_down';
  }


  trackColumn(
    _: number,
    column: GridColumn<T>
  ): string
  {

    return column.key;
  }
}