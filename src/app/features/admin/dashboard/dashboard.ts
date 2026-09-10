import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../core/services/Admin/admin.service';
import { AdminSummary } from '../../../core/models/Customer/customer.model';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin-dashboard',
    imports: [RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit
{
    private readonly adminService = inject(AdminService);

    readonly summary = signal<AdminSummary | null>(null);
    readonly isLoading = signal(true);
    readonly errorMessage = signal('');

    ngOnInit(): void
    {
        this.adminService.getSummary().subscribe({
            next: summary =>
            {
                this.summary.set(summary);
                this.isLoading.set(false);
            },
            error: error =>
            {
                this.errorMessage.set(error?.error?.message ?? 'Unable to load dashboard data.');
                this.isLoading.set(false);
            }
        });
    }
}
