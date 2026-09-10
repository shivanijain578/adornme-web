import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { StoreInfoService } from '../../core/services/Store/store-info.service';
import { SupportInfo } from '../../core/models/Store/store-info.model';

@Component({
    selector: 'app-support',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './support.html',
    styleUrl: './support.scss'
})
export class Support implements OnInit
{
    private readonly storeInfoService = inject(StoreInfoService);

    readonly support = signal<SupportInfo | null>(null);
    readonly isLoading = signal(true);
    readonly errorMessage = signal('');

    ngOnInit(): void
    {
        this.storeInfoService.getSupport().subscribe({
            next: support =>
            {
                this.support.set(support);
                this.isLoading.set(false);
            },
            error: () =>
            {
                this.errorMessage.set('Something went wrong. Please try again.');
                this.isLoading.set(false);
            }
        });
    }
}
