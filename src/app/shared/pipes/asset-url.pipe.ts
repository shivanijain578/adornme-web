import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({ name: 'assetUrl', standalone: true })
export class AssetUrlPipe implements PipeTransform
{
    private readonly apiOrigin = environment.apiUrl.replace(/\/api\/?$/, '');

    transform(value: string | null | undefined): string
    {
        if (!value) return '';
        if (/^https?:\/\//i.test(value)) return value;
        return `${this.apiOrigin}/${value.replace(/^\/+/, '')}`;
    }
}