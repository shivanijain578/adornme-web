import { Injectable, inject } from '@angular/core';

import
{
    HttpClient
} from '@angular/common/http';

import
{
    Observable
} from 'rxjs';

import
{
    environment
} from '../../../../environments/environment';

import
{
    Category,
    CategoryRequest
} from '../../models/Category/category.model';


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


    getHomeCategories():
        Observable<Category[]>
    {
        return this.http.get<Category[]>(
            this.homeApiUrl
        );
    }


    getCategories():
        Observable<Category[]>
    {
        return this.http.get<Category[]>(
            this.apiUrl
        );
    }


    createCategory(
        request: CategoryRequest,
        image: File
    ): Observable<Category>
    {
        const formData =
            this.createFormData(
                request,
                image
            );

        return this.http.post<Category>(
            this.apiUrl,
            formData
        );
    }


    updateCategory(
        id: number,
        request: CategoryRequest,
        image?: File
    ): Observable<Category>
    {
        const formData =
            this.createFormData(
                request,
                image
            );

        return this.http.put<Category>(
            `${this.apiUrl}/${id}`,
            formData
        );
    }


    deleteCategory(
        id: number
    ): Observable<void>
    {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }


    private createFormData(
        request: CategoryRequest,
        image?: File
    ): FormData
    {
        const formData =
            new FormData();


        formData.append(
            'Name',
            request.name
        );


        formData.append(
            'Description',
            request.description ?? ''
        );


        formData.append(
            'IsVisible',
            String(request.isVisible)
        );


        if (image)
        {
            formData.append(
                'Image',
                image
            );
        }


        return formData;
    }
}