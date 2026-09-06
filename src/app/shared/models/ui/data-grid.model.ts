export type GridColumnType =
    | 'text'
    | 'number'
    | 'currency'
    | 'date'
    | 'image'
    | 'status'
    | 'boolean';

export interface GridColumn<T = any>
{
    key: keyof T & string;
    header: string;
    type?: GridColumnType;
    sortable?: boolean;
    width?: string;
}

export interface GridAction<T = any>
{
    label: string;
    icon: string;
    color?: 'primary' | 'warn' | 'accent';
    action: (row: T) => void;
}

export interface GridSortEvent
{
    column: string;
    direction: 'asc' | 'desc';
}