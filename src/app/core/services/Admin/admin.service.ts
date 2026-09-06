import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminSummary } from '../../models/Customer/customer.model';

@Injectable({ providedIn: 'root' })
export class AdminService
{
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/admin`;

    getSummary(): Observable<AdminSummary>
    {
        return this.http.get<AdminSummary>(`${this.apiUrl}/summary`);
    }
}
