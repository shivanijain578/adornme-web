import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WishlistItem, Cart, Profile, Address, CreateAddressRequest, CheckoutRequest, CheckoutResult, Order } from '../../models/Customer/customer.model';
import { Invoice } from '../../models/Customer/invoice.model';

@Injectable({ providedIn: 'root' })
export class CustomerService
{
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    getWishlist(): Observable<WishlistItem[]>
    {
        return this.http.get<WishlistItem[]>(`${this.apiUrl}/wishlist`);
    }

    removeFromWishlist(productId: number): Observable<unknown>
    {
        return this.http.delete(`${this.apiUrl}/wishlist/${productId}`);
    }

    addToWishlist(productId: number): Observable<unknown>
    {
        return this.http.post(`${this.apiUrl}/wishlist/${productId}`, {});
    }

    wishlistContains(productId: number): Observable<{ exists: boolean }>
    {
        return this.http.get<{ exists: boolean }>(`${this.apiUrl}/wishlist/exists/${productId}`);
    }

    getCart(): Observable<Cart>
    {
        return this.http.get<Cart>(`${this.apiUrl}/cart`);
    }

    updateCartItem(productId: number, quantity: number): Observable<Cart>
    {
        return this.http.put<Cart>(
            `${this.apiUrl}/cart/items/${productId}`,
            { quantity }
        );
    }

    removeCartItem(productId: number): Observable<unknown>
    {
        return this.http.delete(`${this.apiUrl}/cart/items/${productId}`);
    }

    clearCart(): Observable<unknown>
    {
        return this.http.delete(`${this.apiUrl}/cart`);
    }

    addToCart(productId: number, quantity = 1): Observable<Cart>
    {
        return this.http.post<Cart>(
            `${this.apiUrl}/cart/items`,
            { productId, quantity }
        );
    }

    getProfile(): Observable<Profile>
    {
        return this.http.get<Profile>(`${this.apiUrl}/profile`);
    }

    addAddress(request: CreateAddressRequest): Observable<Address>
    {
        return this.http.post<Address>(`${this.apiUrl}/profile/addresses`, request);
    }

    checkout(request: CheckoutRequest): Observable<CheckoutResult>
    {
        return this.http.post<CheckoutResult>(
            `${this.apiUrl}/checkout`,
            request
        );
    }

    getOrders(): Observable<Order[]>
    {
        return this.http.get<Order[]>(`${this.apiUrl}/orders`);
    }

    getOrder(orderId: number): Observable<Order>
    {
        return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`);
    }

    getInvoice(orderId: number): Observable<Invoice>
    {
        return this.http.get<Invoice>(`${this.apiUrl}/orders/${orderId}/invoice`);
    }

    cancelOrder(orderId: number): Observable<{ message: string; status: string }>
    {
        return this.http.post<{ message: string; status: string }>(
            `${this.apiUrl}/orders/${orderId}/cancel`,
            {}
        );
    }
}
