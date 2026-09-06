import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, CartSummary } from '../../models/Cart/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService
{
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7001/api/Cart';

  getCart(): Observable<CartSummary>
  {
    return this.http.get<ApiResponse<CartSummary> | CartSummary>(this.baseUrl).pipe(
      map((response) =>
      {
        const payload = (response as ApiResponse<CartSummary>)?.data ?? (response as CartSummary);

        return payload ?? {
          cartId: 0,
          items: [],
          totalItems: 0,
          subtotal: 0,
          total: 0
        };
      }),
      catchError(() => of({
        cartId: 0,
        items: [],
        totalItems: 0,
        subtotal: 0,
        total: 0
      }))
    );
  }

  addToCart(productId: number, quantity: number = 1): Observable<any>
  {
    return this.http.post<any>(`${this.baseUrl}/add`, { productId, quantity }).pipe(
      map((response) => response?.data ?? response),
      catchError((error) =>
      {
        console.error('Error adding item to cart:', error);
        return of({ success: false, message: 'Unable to add to cart.' });
      })
    );
  }

  removeFromCart(productId: number): Observable<any>
  {
    return this.http.delete<any>(`${this.baseUrl}/${productId}`).pipe(
      map((response) => response?.data ?? response),
      catchError((error) =>
      {
        console.error('Error removing item from cart:', error);
        return of({ success: false, message: 'Unable to remove from cart.' });
      })
    );
  }

  updateCartItem(productId: number, quantity: number): Observable<any>
  {
    return this.http.put<any>(`${this.baseUrl}/${productId}`, { quantity }).pipe(
      map((response) => response?.data ?? response),
      catchError((error) =>
      {
        console.error('Error updating cart item:', error);
        return of({ success: false, message: 'Unable to update cart item.' });
      })
    );
  }
}