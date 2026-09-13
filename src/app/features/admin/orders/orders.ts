import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/Admin/admin.service';
import { AdminOrder } from '../../../core/models/Admin/admin.model';

interface OrderStatusTab
{
    label: string;
    value?: number;
}

@Component({
    selector: 'app-admin-orders',
    imports: [DatePipe, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './orders.html',
    styleUrl: './orders.scss'
})
export class AdminOrders implements OnInit
{
    private readonly adminService = inject(AdminService);

    readonly orders = signal<AdminOrder[]>([]);
    readonly isLoading = signal(true);
    readonly errorMessage = signal('');

    readonly selectedStatus = signal<number | undefined>(undefined);

    readonly statusTabs: OrderStatusTab[] = [
        { label: 'All' },
        { label: 'Pending', value: 1 },
        { label: 'Confirmed', value: 2 },
        { label: 'Shipped', value: 3 },
        { label: 'Delivered', value: 4 },
        { label: 'Cancelled', value: 5 },
        { label: 'Returned', value: 6 }
    ];

    ngOnInit(): void
    {
        this.load();
    }

    selectStatus(status?: number): void
    {
        this.selectedStatus.set(status);
        this.load();
    }

    isSelected(status?: number): boolean
    {
        return this.selectedStatus() === status;
    }

    private load(): void
    {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.adminService.getAdminOrders(this.selectedStatus()).subscribe({
            next: orders =>
            {
                this.orders.set(orders);
                this.isLoading.set(false);
            },
            error: error =>
            {
                this.errorMessage.set(
                    error?.error?.message ?? 'Unable to load orders.'
                );
                this.isLoading.set(false);
            }
        });
    }
}