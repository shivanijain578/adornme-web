import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AboutInfo, SupportInfo } from '../../models/Store/store-info.model';

@Injectable({ providedIn: 'root' })
export class StoreInfoService
{
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/store`;

    getAbout(): Observable<AboutInfo>
    {
        return this.http.get<AboutInfo>(`${this.apiUrl}/about`);
    }

    getSupport(): Observable<SupportInfo>
    {
        return this.http.get<SupportInfo>(`${this.apiUrl}/support`);
    }
}
