import
{
    HttpErrorResponse,
    HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/Notification/notification';


export const errorInterceptor: HttpInterceptorFn = (req, next) =>
{
    const notificationService = inject(NotificationService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) =>
        {
            const message = getErrorMessage(error);

            notificationService.showError(message);

            return throwError(() => error);
        })
    );
};

function getErrorMessage(error: HttpErrorResponse): string
{
    // Network/server unavailable
    if (error.status === 0)
    {
        return 'Unable to connect to the server. Please check your connection.';
    }

    // Authentication
    if (error.status === 401)
    {
        return 'Your session has expired. Please login again.';
    }

    // Authorization
    if (error.status === 403)
    {
        return 'You do not have permission to perform this action.';
    }

    // Not found
    if (error.status === 404)
    {
        return 'The requested resource was not found.';
    }

    // Conflict
    if (error.status === 409)
    {
        return extractBackendMessage(error) || 'This action could not be completed because of a conflict.';
    }

    // Validation
    if (error.status === 400 || error.status === 422)
    {
        return extractBackendMessage(error) || 'Please check the entered information.';
    }

    // Server error
    if (error.status >= 500)
    {
        return 'Something went wrong on the server. Please try again later.';
    }

    return extractBackendMessage(error) || 'Something went wrong. Please try again.';
}

function extractBackendMessage(error: HttpErrorResponse): string | null
{
    const body = error.error;

    if (!body)
    {
        return null;
    }

    // ASP.NET Core style:
    // { message: "..." }
    if (typeof body === 'object' && typeof body.message === 'string')
    {
        return body.message;
    }

    // ASP.NET Core ProblemDetails:
    // { detail: "..." }
    if (typeof body === 'object' && typeof body.detail === 'string')
    {
        return body.detail;
    }

    // ASP.NET Core:
    // { title: "..." }
    if (typeof body === 'object' && typeof body.title === 'string')
    {
        return body.title;
    }

    // Plain string response
    if (typeof body === 'string' && body.trim())
    {
        return body;
    }

    // Validation response:
    // { errors: { Name: ["Name is required"] } }
    if (typeof body === 'object' && body.errors)
    {
        const errors = body.errors as Record<string, string[]>;
        const messages = Object.values(errors)
            .flat()
            .filter(Boolean);

        if (messages.length > 0)
        {
            return messages[0];
        }
    }

    return null;
}