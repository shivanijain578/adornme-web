import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/Customer/customer.service';
import { Order } from '../../core/models/Customer/customer.model';
import { AppButton } from '../../shared/components/Basic_Material_wrappers/app-button/app-button';

@Component({
    selector: 'app-orders',
    imports: [DatePipe, LowerCasePipe, RouterLink, AppButton],
    templateUrl: './orders.html',
    styleUrl: './orders.scss'
})
export class Orders implements OnInit
{
    private readonly customerService = inject(CustomerService);
    private readonly cdr = inject(ChangeDetectorRef);

    orders = signal<Order[]>([]);
    selectedStatus = signal('All');
    readonly statuses = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
    filteredOrders = computed(() =>
    {
        const status = this.selectedStatus();
        return status === 'All'
            ? this.orders()
            : this.orders().filter(order => order.status === status);
    });
    isLoading = signal(true);
    errorMessage = signal('');
    cancellingOrderId = signal<number | null>(null);

    selectStatus(status: string): void
    {
        this.selectedStatus.set(status);
    }

    cancelOrder(order: Order): void
    {
        if (this.cancellingOrderId() !== null || !this.canCancel(order.status))
        {
            return;
        }

        if (!window.confirm(`Cancel order #${order.id}?`))
        {
            return;
        }

        this.cancellingOrderId.set(order.id);
        this.errorMessage.set('');

        this.customerService.cancelOrder(order.id).subscribe({
            next: response =>
            {
                this.orders.update(orders => orders.map(current =>
                    current.id === order.id
                        ? { ...current, status: response.status }
                        : current
                ));
                this.cancellingOrderId.set(null);
                this.cdr.detectChanges();
            },
            error: error =>
            {
                this.errorMessage.set(error?.error?.message ?? 'Unable to cancel this order.');
                this.cancellingOrderId.set(null);
                this.cdr.detectChanges();
            }
        });
    }

    canCancel(status: string): boolean
    {
        return status === 'Pending' || status === 'Confirmed';
    }

    ngOnInit(): void
    {
        this.customerService.getOrders().subscribe({
            next: orders =>
            {
                this.orders.set(orders);
                this.isLoading.set(false);
                this.cdr.detectChanges();
            },
            error: error =>
            {
                this.errorMessage.set(error?.error?.message ?? 'Unable to load your orders.');
                this.isLoading.set(false);
                this.cdr.detectChanges();
            }
        });
    }

    statusClass(status: string): string
    {
        return status.toLowerCase();
    }
}
