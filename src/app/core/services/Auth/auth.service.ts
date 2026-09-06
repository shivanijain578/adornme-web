import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';

import
{
    LoginRequest,
    AuthResponse,
    RegisterRequest,
    AuthUser
} from '../../models/Auth/auth.model';


@Injectable({
    providedIn: 'root'
})
export class AuthService
{
    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/auth`;


    // ============================================================
    // LOGIN
    // ============================================================

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


    // ============================================================
    // REGISTER
    // ============================================================

    register(
        request: RegisterRequest
    ): Observable<any>
    {
        return this.http.post(
            `${this.apiUrl}/register`,
            request
        );
    }


    // ============================================================
    // REFRESH TOKEN
    // ============================================================

    refreshToken(): Observable<AuthResponse>
    {
        const refreshToken =
            sessionStorage.getItem('refreshToken');

        return this.http
            .post<AuthResponse>(
                `${this.apiUrl}/refresh`,
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


    // ============================================================
    // LOGOUT
    // ============================================================

    logout(): void
    {
        const refreshToken =
            sessionStorage.getItem('refreshToken');

        if (refreshToken)
        {
            this.http
                .post<void>(
                    `${this.apiUrl}/revoke`,
                    { refreshToken }
                )
                .subscribe({ error: () => undefined });
        }

        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('expiresAt');
        sessionStorage.removeItem('user');
    }


    // ============================================================
    // CHECK LOGIN
    // ============================================================

    isLoggedIn(): boolean
    {
        const token =
            sessionStorage.getItem('accessToken');

        return !!token;
    }


    // ============================================================
    // CHECK ADMIN
    // ============================================================

    isAdmin(): boolean
    {
        const storedUser =
            this.getStoredUser();

        if (
            storedUser?.role?.toLowerCase() === 'admin'
        )
        {
            return true;
        }

        const token =
            this.getAccessToken();

        if (!token)
        {
            return false;
        }

        try
        {
            const payload = JSON.parse(
                this.decodeTokenPayload(token)
            ) as Record<string, unknown>;

            const role =
                payload['role'] ??
                payload[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ];

            return typeof role === 'string' &&
                role.toLowerCase() === 'admin';
        }
        catch
        {
            return false;
        }
    }


    // ============================================================
    // GET ACCESS TOKEN
    // ============================================================

    getAccessToken(): string | null
    {
        return sessionStorage.getItem(
            'accessToken'
        );
    }


    // ============================================================
    // STORE TOKENS
    // ============================================================

    private storeTokens(
        response: AuthResponse
    ): void
    {
        sessionStorage.setItem(
            'accessToken',
            response.accessToken
        );

        sessionStorage.setItem(
            'refreshToken',
            response.refreshToken
        );

        sessionStorage.setItem(
            'expiresAt',
            response.expiresAt
        );

        if (response.user)
        {
            sessionStorage.setItem(
                'user',
                JSON.stringify(response.user)
            );
        }
    }


    // ============================================================
    // GET STORED USER
    // ============================================================

    private getStoredUser(): AuthUser | null
    {
        const userJson =
            sessionStorage.getItem('user');

        if (!userJson)
        {
            return null;
        }

        try
        {
            return JSON.parse(
                userJson
            ) as AuthUser;
        }
        catch
        {
            return null;
        }
    }


    // ============================================================
    // DECODE JWT
    // ============================================================

    private decodeTokenPayload(
        token: string
    ): string
    {
        const payload =
            token.split('.')[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/');

        const paddedPayload =
            payload.padEnd(
                payload.length +
                (4 - payload.length % 4) % 4,
                '='
            );

        return decodeURIComponent(
            Array.from(
                atob(paddedPayload)
            )
                .map(character =>
                    `%${character
                        .charCodeAt(0)
                        .toString(16)
                        .padStart(2, '0')}`
                )
                .join('')
        );
    }
}