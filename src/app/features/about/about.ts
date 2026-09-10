import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { StoreInfoService } from '../../core/services/Store/store-info.service';
import { AboutInfo } from '../../core/models/Store/store-info.model';

@Component({
    selector: 'app-about',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './about.html',
    styleUrl: './about.scss'
})
export class About implements OnInit
{
    private readonly storeInfoService = inject(StoreInfoService);

    readonly about = signal<AboutInfo | null>(null);
    readonly isLoading = signal(true);
    readonly errorMessage = signal('');

    ngOnInit(): void
    {
        this.storeInfoService.getAbout().subscribe({
            next: about =>
            {
                this.about.set(about);
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
