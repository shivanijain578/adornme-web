import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/Admin/admin.service';
import { AdminOrder } from '../../../core/models/Admin/admin.model';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';

@Component({ selector: 'app-admin-order-detail', imports: [DatePipe, RouterLink, AppButton], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './order-detail.html', styleUrl: './order-detail.scss' })
export class AdminOrderDetail implements OnInit
{
    private readonly route = inject(ActivatedRoute); private readonly adminService = inject(AdminService);
    readonly order = signal<AdminOrder | null>(null); readonly isLoading = signal(true); readonly isSaving = signal(false); readonly errorMessage = signal('');
    readonly transitions: Record<string, { label: string; value: number }[]> = { Pending: [{ label: 'Confirm', value: 2 }, { label: 'Cancel', value: 5 }], Confirmed: [{ label: 'Ship', value: 3 }], Shipped: [{ label: 'Deliver', value: 4 }, { label: 'Return', value: 6 }], Delivered: [{ label: 'Return', value: 6 }], Cancelled: [], Returned: [] };
    ngOnInit(): void { const id = Number(this.route.snapshot.paramMap.get('id')); this.adminService.getAdminOrder(id).subscribe({ next: order => { this.order.set(order); this.isLoading.set(false); }, error: error => { this.errorMessage.set(error?.error?.message ?? 'Unable to load order.'); this.isLoading.set(false); } }); }
    update(value: number): void { const order = this.order(); if (!order || this.isSaving()) return; this.isSaving.set(true); this.adminService.updateOrderStatus(order.id, value).subscribe({ next: () => this.adminService.getAdminOrder(order.id).subscribe({ next: refreshed => { this.order.set(refreshed); this.isSaving.set(false); } }), error: error => { this.errorMessage.set(error?.error?.message ?? 'Unable to update order status.'); this.isSaving.set(false); } }); }
}
