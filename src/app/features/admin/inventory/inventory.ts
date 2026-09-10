import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/Admin/admin.service';
import { InventoryItem, InventoryTransaction } from '../../../core/models/Admin/admin.model';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';

@Component({ selector: 'app-admin-inventory', imports: [ReactiveFormsModule, DatePipe, AppButton], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './inventory.html', styleUrl: './inventory.scss' })
export class Inventory implements OnInit
{
    private readonly adminService = inject(AdminService); private readonly fb = inject(FormBuilder);
    readonly items = signal<InventoryItem[]>([]); readonly transactions = signal<InventoryTransaction[]>([]); readonly isLoading = signal(true); readonly isSaving = signal(false); readonly errorMessage = signal('');
    readonly form = this.fb.nonNullable.group({ productId: [0, Validators.min(1)], quantity: [1, [Validators.required, Validators.min(1)]], type: [1, Validators.required], reason: [''], reference: [''] });
    ngOnInit(): void { this.load(); }
    load(): void { this.isLoading.set(true); this.adminService.getInventory().subscribe({ next: items => { this.items.set(items); this.isLoading.set(false); }, error: error => { this.errorMessage.set(error?.error?.message ?? 'Unable to load inventory.'); this.isLoading.set(false); } }); this.adminService.getInventoryTransactions().subscribe({ next: items => this.transactions.set(items) }); }
    adjust(): void { if (this.form.invalid || this.isSaving()) { this.form.markAllAsTouched(); return; } this.isSaving.set(true); this.adminService.adjustInventory(this.form.getRawValue()).subscribe({ next: () => { this.isSaving.set(false); this.form.patchValue({ quantity: 1, reason: '', reference: '' }); this.load(); }, error: error => { this.errorMessage.set(error?.error?.message ?? 'Unable to adjust stock.'); this.isSaving.set(false); } }); }
}
