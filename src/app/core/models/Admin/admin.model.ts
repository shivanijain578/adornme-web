export interface Offer
{
    id: number;
    name: string;
    offerType: number;
    scope: number;
    discountValue: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    isCurrentlyActive: boolean;
    createdAt: string;
    updatedAt: string;
    productIds: number[];
    categoryIds: number[];
}

export interface OfferRequest
{
    name: string;
    offerType: number;
    scope: number;
    discountValue: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    productIds: number[];
    categoryIds: number[];
}

export interface Banner
{
    id: number;
    title: string;
    imageUrl: string;
    linkUrl?: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: string;
}

export interface BannerRequest
{
    title: string;
    image?: File;
    linkUrl?: string;
    isActive: boolean;
    displayOrder: number;
}

export interface InventoryItem
{
    productId: number;
    productName: string;
    stockQuantity: number;
    lowStockThreshold: number;
    isLowStock: boolean;
    isOutOfStock: boolean;
}

export interface InventoryTransaction
{
    id: number;
    productId: number;
    productName: string;
    type: number;
    quantity: number;
    previousStock: number;
    newStock: number;
    reason?: string;
    reference?: string;
    createdBy?: number;
    createdAt: string;
}

export interface AdminOrder
{
    id: number;
    userId: number;
    customerEmail?: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    address: string;
    itemCount: number;
    items: { productId: number; productName: string; quantity: number; unitPrice: number }[];
    payment?: { amount: number; method: string; status: string; transactionId?: string; paidAt?: string };
}
