import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/Customer/customer.service';
import { Order } from '../../core/models/Customer/customer.model';
import { AppButton } from '../../shared/components/Basic_Material_wrappers/app-button/app-button';

@Component({
    selector: 'app-orders',
    imports: [DatePipe, RouterLink, AppButton],
    templateUrl: './orders.html',
    styleUrl: './orders.scss'
})
export class Orders implements OnInit
{
    private readonly customerService = inject(CustomerService);
    private readonly cdr = inject(ChangeDetectorRef);

    orders = signal<Order[]>([]);
    isLoading = signal(true);
    errorMessage = signal('');
    cancellingOrderId = signal<number | null>(null);

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
