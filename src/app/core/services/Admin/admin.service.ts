import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminSummary } from '../../models/Customer/customer.model';
import { AdminOrder, Banner, BannerRequest, InventoryItem, InventoryTransaction, Offer, OfferRequest } from '../../models/Admin/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService
{
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/admin`;

    getSummary(): Observable<AdminSummary>
    {
        return this.http.get<AdminSummary>(`${this.apiUrl}/summary`);
    }

    getOffers(): Observable<Offer[]>
    {
        return this.http.get<Offer[]>(`${this.apiUrl}/offers`);
    }

    createOffer(request: OfferRequest): Observable<Offer>
    {
        return this.http.post<Offer>(`${this.apiUrl}/offers`, request);
    }

    updateOffer(id: number, request: OfferRequest): Observable<Offer>
    {
        return this.http.put<Offer>(`${this.apiUrl}/offers/${id}`, request);
    }

    updateOfferStatus(id: number, isActive: boolean): Observable<unknown>
    {
        return this.http.patch(`${this.apiUrl}/offers/${id}/status`, isActive);
    }

    deleteOffer(id: number): Observable<void>
    {
        return this.http.delete<void>(`${this.apiUrl}/offers/${id}`);
    }

    getBanners(): Observable<Banner[]>
    {
        return this.http.get<Banner[]>(`${environment.apiUrl}/banners/admin`);
    }

    createBanner(request: BannerRequest): Observable<unknown>
    {
        return this.http.post(`${environment.apiUrl}/banners`, this.toBannerFormData(request));
    }

    updateBanner(id: number, request: BannerRequest): Observable<unknown>
    {
        return this.http.put(`${environment.apiUrl}/banners/${id}`, this.toBannerFormData(request));
    }

    updateBannerStatus(id: number, isActive: boolean): Observable<unknown>
    {
        return this.http.patch(`${environment.apiUrl}/banners/${id}/status`, null, { params: { isActive } });
    }

    deleteBanner(id: number): Observable<void>
    {
        return this.http.delete<void>(`${environment.apiUrl}/banners/${id}`);
    }

    getInventory(): Observable<InventoryItem[]>
    {
        return this.http.get<InventoryItem[]>(`${this.apiUrl}/inventory`);
    }

    adjustInventory(request: { productId: number; quantity: number; type: number; reason?: string; reference?: string }): Observable<unknown>
    {
        return this.http.post(`${this.apiUrl}/inventory/adjust`, request);
    }

    getInventoryTransactions(productId?: number): Observable<InventoryTransaction[]>
    {
        const url = `${this.apiUrl}/inventory/transactions`;
        return this.http.get<InventoryTransaction[]>(url, productId ? { params: { productId } } : undefined);
    }

    getAdminOrders(status?: number): Observable<AdminOrder[]>
    {
        return this.http.get<AdminOrder[]>(`${environment.apiUrl}/orders/admin`, status ? { params: { status } } : undefined);
    }

    getAdminOrder(id: number): Observable<AdminOrder>
    {
        return this.http.get<AdminOrder>(`${environment.apiUrl}/orders/admin/${id}`);
    }

    updateOrderStatus(id: number, status: number): Observable<unknown>
    {
        return this.http.patch(`${environment.apiUrl}/orders/admin/${id}/status`, { status });
    }

    private toBannerFormData(request: BannerRequest): FormData
    {
        const formData = new FormData();
        formData.append('Title', request.title);
        formData.append('LinkUrl', request.linkUrl ?? '');
        formData.append('IsActive', request.isActive.toString());
        formData.append('DisplayOrder', request.displayOrder.toString());
        if (request.image) formData.append('Image', request.image, request.image.name);
        return formData;
    }
}
