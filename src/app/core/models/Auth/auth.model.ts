export interface LoginRequest
{
    email: string;
    password: string;
}

export interface RegisterRequest
{
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse
{
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user?: AuthUser;
}

export interface AuthUser
{
    id?: number | string;
    name?: string;
    email?: string;
    role?: string;
}