import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import
{
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    AuthUser
} from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService
{

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/auth`;

    login(
        request: LoginRequest
    ): Observable<AuthResponse>
    {

        return this.http
            .post<AuthResponse>(
                `${this.apiUrl}/login`,
                request
            )
            .pipe(
                tap(response =>
                {
                    this.storeTokens(response);
                })
            );
    }

    register(
        request: RegisterRequest
    ): Observable<any>
    {

        return this.http.post(
            `${this.apiUrl}/register`,
            request
        );
    }

    refreshToken(): Observable<AuthResponse>
    {

        const refreshToken =
            localStorage.getItem('refreshToken');

        return this.http
            .post<AuthResponse>(
                `${this.apiUrl}/refresh-token`,
                {
                    refreshToken
                }
            )
            .pipe(
                tap(response =>
                {
                    this.storeTokens(response);
                })
            );
    }

    logout(): void
    {

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('user');
    }

    isLoggedIn(): boolean
    {

        const token =
            localStorage.getItem('accessToken');

        return !!token;
    }

    isAdmin(): boolean
    {
        const storedUser = this.getStoredUser();

        if (storedUser?.role?.toLowerCase() === 'admin')
        {
            return true;
        }

        const token = this.getAccessToken();

        if (!token)
        {
            return false;
        }

        try
        {
            const payload = JSON.parse(
                this.decodeTokenPayload(token)
            ) as Record<string, unknown>;
            const role = payload['role'] ??
                payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

            return typeof role === 'string' &&
                role.toLowerCase() === 'admin';
        }
        catch
        {
            return false;
        }
    }

    getAccessToken(): string | null
    {

        return localStorage.getItem('accessToken');
    }

    private storeTokens(
        response: AuthResponse
    ): void
    {

        localStorage.setItem(
            'accessToken',
            response.accessToken
        );

        localStorage.setItem(
            'refreshToken',
            response.refreshToken
        );

        localStorage.setItem(
            'expiresAt',
            response.expiresAt
        );

        if (response.user)
        {
            localStorage.setItem(
                'user',
                JSON.stringify(response.user)
            );
        }
    }

    private getStoredUser(): AuthUser | null
    {
        const userJson = localStorage.getItem('user');

        if (!userJson)
        {
            return null;
        }

        try
        {
            return JSON.parse(userJson) as AuthUser;
        }
        catch
        {
            return null;
        }
    }

    private decodeTokenPayload(token: string): string
    {
        const payload = token.split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const paddedPayload = payload.padEnd(
            payload.length + (4 - payload.length % 4) % 4,
            '='
        );

        return decodeURIComponent(
            Array.from(atob(paddedPayload))
                .map(character =>
                    `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`
                )
                .join('')
        );
    }
}