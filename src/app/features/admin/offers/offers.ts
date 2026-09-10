import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/Admin/admin.service';
import { Offer, OfferRequest } from '../../../core/models/Admin/admin.model';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';

@Component({
    selector: 'app-admin-offers',
    imports: [ReactiveFormsModule, AppButton],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './offers.html',
    styleUrl: './offers.scss'
})
export class Offers implements OnInit
{
    private readonly adminService = inject(AdminService);
    private readonly fb = inject(FormBuilder);
    readonly offers = signal<Offer[]>([]);
    readonly isLoading = signal(true);
    readonly isSaving = signal(false);
    readonly errorMessage = signal('');
    readonly editingId = signal<number | null>(null);

    readonly form = this.fb.nonNullable.group({
        name: ['', [Validators.required, Validators.maxLength(200)]], offerType: [1, Validators.required], scope: [1, Validators.required],
        discountValue: [0, [Validators.required, Validators.min(0.01)]], startDate: ['', Validators.required], endDate: ['', Validators.required],
        isActive: [true], productIds: [''], categoryIds: ['']
    });

    ngOnInit(): void { this.load(); }

    save(): void
    {
        if (this.form.invalid || this.isSaving()) { this.form.markAllAsTouched(); return; }
        this.isSaving.set(true); this.errorMessage.set('');
        const value = this.form.getRawValue();
        const request: OfferRequest = { ...value, productIds: this.ids(value.productIds), categoryIds: this.ids(value.categoryIds) };
        const call = this.editingId() === null ? this.adminService.createOffer(request) : this.adminService.updateOffer(this.editingId()!, request);
        call.subscribe({ next: () => { this.reset(); this.load(); }, error: error => { this.errorMessage.set(error?.error?.message ?? 'Unable to save offer.'); this.isSaving.set(false); } });
    }

    edit(offer: Offer): void
    {
        this.editingId.set(offer.id);
        this.form.patchValue({ ...offer, startDate: offer.startDate.slice(0, 10), endDate: offer.endDate.slice(0, 10), productIds: offer.productIds.join(', '), categoryIds: offer.categoryIds.join(', ') });
    }

    toggle(offer: Offer): void { this.adminService.updateOfferStatus(offer.id, !offer.isActive).subscribe({ next: () => this.load(), error: error => this.errorMessage.set(error?.error?.message ?? 'Unable to update offer.') }); }
    remove(offer: Offer): void { if (window.confirm(`Delete ${offer.name}?`)) this.adminService.deleteOffer(offer.id).subscribe({ next: () => this.load(), error: error => this.errorMessage.set(error?.error?.message ?? 'Unable to delete offer.') }); }
    reset(): void { this.editingId.set(null); this.form.reset({ name: '', offerType: 1, scope: 1, discountValue: 0, startDate: '', endDate: '', isActive: true, productIds: '', categoryIds: '' }); this.isSaving.set(false); }

    private load(): void { this.isLoading.set(true); this.adminService.getOffers().subscribe({ next: offers => { this.offers.set(offers); this.isLoading.set(false); }, error: error => { this.errorMessage.set(error?.error?.message ?? 'Unable to load offers.'); this.isLoading.set(false); } }); }
    private ids(value: string): number[] { return value.split(',').map(item => Number(item.trim())).filter(Number.isFinite).filter(item => item > 0); }
}
