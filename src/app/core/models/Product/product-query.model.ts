export interface ProductQuery
{
    search?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortDescending?: boolean;
    pageNumber?: number;
    pageSize?: number;
}