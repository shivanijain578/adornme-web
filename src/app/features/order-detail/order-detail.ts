import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/Customer/customer.service';
import { Order } from '../../core/models/Customer/customer.model';
import { AppButton } from '../../shared/components/Basic_Material_wrappers/app-button/app-button';

@Component({
    selector: 'app-order-detail',
    imports: [DatePipe, RouterLink, AppButton],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './order-detail.html',
    styleUrl: './order-detail.scss'
})
export class OrderDetail implements OnInit
{
    private readonly route = inject(ActivatedRoute);
    private readonly customerService = inject(CustomerService);

    readonly order = signal<Order | null>(null);
    readonly isLoading = signal(true);
    readonly errorMessage = signal('');
    readonly isCancelling = signal(false);

    ngOnInit(): void
    {
        const orderId = Number(this.route.snapshot.paramMap.get('id'));
        if (!orderId)
        {
            this.errorMessage.set('Invalid order ID.');
            this.isLoading.set(false);
            return;
        }
        this.customerService.getOrder(orderId).subscribe({
            next: order => { this.order.set(order); this.isLoading.set(false); },
            error: error => { this.errorMessage.set(error?.error?.message ?? 'Unable to load this order.'); this.isLoading.set(false); }
        });
    }

    canCancel(): boolean
    {
        return this.order()?.status === 'Pending';
    }

    cancel(): void
    {
        const currentOrder = this.order();
        if (!currentOrder || !this.canCancel() || this.isCancelling()) return;
        this.isCancelling.set(true);
        this.customerService.cancelOrder(currentOrder.id).subscribe({
            next: response => { this.order.update(order => order ? { ...order, status: response.status } : order); this.isCancelling.set(false); },
            error: error => { this.errorMessage.set(error?.error?.message ?? 'Unable to cancel this order.'); this.isCancelling.set(false); }
        });
    }
}
