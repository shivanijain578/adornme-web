import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/Admin/admin.service';
import { Banner, BannerRequest } from '../../../core/models/Admin/admin.model';
import { AppButton } from '../../../shared/components/Basic_Material_wrappers/app-button/app-button';
import { AssetUrlPipe } from '../../../shared/pipes/asset-url.pipe';

@Component({ selector: 'app-admin-banners', imports: [ReactiveFormsModule, AppButton, AssetUrlPipe], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './banners.html', styleUrl: './banners.scss' })
export class Banners implements OnInit
{
    private readonly adminService = inject(AdminService); private readonly fb = inject(FormBuilder);
    readonly banners = signal<Banner[]>([]); readonly isLoading = signal(true); readonly isSaving = signal(false); readonly errorMessage = signal(''); readonly editingId = signal<number | null>(null); selectedImage?: File;
    readonly form = this.fb.nonNullable.group({ title: ['', [Validators.required, Validators.maxLength(200)]], linkUrl: [''], displayOrder: [0, [Validators.required, Validators.min(0)]], isActive: [true] });
    ngOnInit(): void { this.load(); }
    selectImage(event: Event): void { const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return; if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) { this.errorMessage.set('Choose an image smaller than 5 MB.'); return; } this.selectedImage = file; this.errorMessage.set(''); }
    save(): void { if (this.form.invalid || (!this.editingId() && !this.selectedImage) || this.isSaving()) { this.form.markAllAsTouched(); return; } this.isSaving.set(true); const request: BannerRequest = { ...this.form.getRawValue(), image: this.selectedImage }; const call = this.editingId() ? this.adminService.updateBanner(this.editingId()!, request) : this.adminService.createBanner(request); call.subscribe({ next: () => { this.reset(); this.load(); }, error: error => { this.errorMessage.set(error?.error?.message ?? 'Unable to save banner.'); this.isSaving.set(false); } }); }
    edit(banner: Banner): void { this.editingId.set(banner.id); this.form.patchValue({ title: banner.title, linkUrl: banner.linkUrl ?? '', displayOrder: banner.displayOrder, isActive: banner.isActive }); }
    toggle(banner: Banner): void { this.adminService.updateBannerStatus(banner.id, !banner.isActive).subscribe({ next: () => this.load(), error: error => this.errorMessage.set(error?.error?.message ?? 'Unable to update banner.') }); }
    remove(banner: Banner): void { if (window.confirm(`Delete ${banner.title}?`)) this.adminService.deleteBanner(banner.id).subscribe({ next: () => this.load(), error: error => this.errorMessage.set(error?.error?.message ?? 'Unable to delete banner.') }); }
    reset(): void { this.editingId.set(null); this.selectedImage = undefined; this.form.reset({ title: '', linkUrl: '', displayOrder: 0, isActive: true }); this.isSaving.set(false); }
    private load(): void { this.isLoading.set(true); this.adminService.getBanners().subscribe({ next: banners => { this.banners.set(banners); this.isLoading.set(false); }, error: error => { this.errorMessage.set(error?.error?.message ?? 'Unable to load banners.'); this.isLoading.set(false); } }); }
}
