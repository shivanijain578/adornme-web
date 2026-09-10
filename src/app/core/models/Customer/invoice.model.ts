export interface Invoice
{
    invoiceNumber: string;
    orderId: number;
    orderDate: string;
    status: string;
    customer: {
        name: string;
        email?: string;
    };
    billingAddress?: {
        fullName: string;
        phoneNumber: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    totalAmount: number;
    payment?: {
        method: string;
        status: string;
        transactionId?: string;
        paidAt?: string;
    };
}

export interface InvoiceItem
{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
