import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    Cart,
    CheckoutRequest,
    CheckoutResult,
    Profile,
    WishlistItem
} from '../models/customer.model';

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

    checkout(request: CheckoutRequest): Observable<CheckoutResult>
    {
        return this.http.post<CheckoutResult>(
            `${this.apiUrl}/checkout`,
            request
        );
    }
}
