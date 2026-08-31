import { Injectable, inject } from '@angular/core';

import
    {
        HttpClient
    } from '@angular/common/http';

import
    {
        Observable
    } from 'rxjs';

import { environment }
    from '../../../environments/environment';

import { Category, CategoryRequest }
    from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService
{

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/categories`;

    private readonly homeApiUrl =
        `${environment.apiUrl}/home/categories`;

    getHomeCategories(): Observable<Category[]>
    {
        return this.http.get<Category[]>(this.homeApiUrl);
    }

    getCategories():
        Observable<Category[]>
    {

        return this.http.get<Category[]>(
            this.apiUrl
        );
    }

    createCategory(request: CategoryRequest): Observable<Category>
    {
        return this.http.post<Category>(this.apiUrl, request);
    }

    updateCategory(
        id: number,
        request: CategoryRequest
    ): Observable<Category>
    {
        return this.http.put<Category>(
            `${this.apiUrl}/${id}`,
            request
        );
    }

    deleteCategory(id: number): Observable<void>
    {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}