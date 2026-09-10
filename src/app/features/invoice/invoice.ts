import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/Customer/customer.service';
import { Invoice } from '../../core/models/Customer/invoice.model';
import { AppButton } from '../../shared/components/Basic_Material_wrappers/app-button/app-button';

@Component({
    selector: 'app-invoice',
    imports: [DatePipe, CurrencyPipe, RouterLink, AppButton],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './invoice.html',
    styleUrl: './invoice.scss'
})
export class InvoicePage implements OnInit
{
    private readonly route = inject(ActivatedRoute);
    private readonly customerService = inject(CustomerService);

    readonly invoice = signal<Invoice | null>(null);
    readonly isLoading = signal(true);
    readonly errorMessage = signal('');

    ngOnInit(): void
    {
        const orderId = Number(this.route.snapshot.paramMap.get('id'));
        if (!orderId)
        {
            this.errorMessage.set('Invalid order ID.');
            this.isLoading.set(false);
            return;
        }

        this.customerService.getInvoice(orderId).subscribe({
            next: invoice =>
            {
                this.invoice.set(invoice);
                this.isLoading.set(false);
            },
            error: error =>
            {
                this.errorMessage.set(error?.error?.message ?? 'Unable to load the invoice.');
                this.isLoading.set(false);
            }
        });
    }

    print(): void
    {
        window.print();
    }
}
