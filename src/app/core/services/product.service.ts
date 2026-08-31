import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
    Product,
    ProductDetail,
    ProductRequest,
    ProductSummary
} from '../models/product.model';
import { PagedResult } from '../models/paged-result.model';
import { ProductQuery } from '../models/product-query.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService
{

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/products`;

    private readonly homeApiUrl =
        `${environment.apiUrl}/home/products`;

    getHomeProducts(
        categoryId?: number,
        page = 1,
        pageSize = 20
    ): Observable<ProductSummary[]>
    {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (categoryId !== undefined)
        {
            params = params.set('categoryId', categoryId.toString());
        }

        return this.http.get<ProductSummary[]>(
            this.homeApiUrl,
            { params }
        );
    }

    getHomeProductById(id: number): Observable<ProductDetail>
    {
        return this.http.get<ProductDetail>(
            `${this.homeApiUrl}/${id}`
        );
    }

    getProducts(
        query: ProductQuery = {}
    ): Observable<PagedResult<Product>>
    {

        let params = new HttpParams();

        if (query.search)
        {
            params = params.set('search', query.search);
        }

        if (query.categoryId !== undefined)
        {
            params = params.set(
                'categoryId',
                query.categoryId.toString()
            );
        }

        if (query.minPrice !== undefined)
        {
            params = params.set(
                'minPrice',
                query.minPrice.toString()
            );
        }

        if (query.maxPrice !== undefined)
        {
            params = params.set(
                'maxPrice',
                query.maxPrice.toString()
            );
        }

        if (query.sortBy)
        {
            params = params.set('sortBy', query.sortBy);
        }

        if (query.sortDescending !== undefined)
        {
            params = params.set(
                'sortDescending',
                query.sortDescending.toString()
            );
        }

        params = params.set(
            'pageNumber',
            (query.pageNumber ?? 1).toString()
        );

        params = params.set(
            'pageSize',
            (query.pageSize ?? 10).toString()
        );

        return this.http.get<PagedResult<Product>>(
            this.apiUrl,
            { params }
        );
    }

    getProductById(id: number): Observable<Product>
    {

        return this.http.get<Product>(
            `${this.apiUrl}/${id}`
        );
    }

    createProduct(request: ProductRequest): Observable<Product>
    {
        return this.http.post<Product>(this.apiUrl, request);
    }

    updateProduct(
        id: number,
        request: ProductRequest
    ): Observable<Product>
    {
        return this.http.put<Product>(
            `${this.apiUrl}/${id}`,
            request
        );
    }
}