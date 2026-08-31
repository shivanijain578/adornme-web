export interface WishlistItem
{
    id: number;
    productId: number;
    productName: string;
    price: number;
    imageUrl?: string;
    stockQuantity: number;
    addedAt: string;
}

export interface CartItem
{
    id: number;
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    imageUrl?: string;
    availableStock: number;
}

export interface Cart
{
    id: number;
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
}

export interface Address
{
    id: number;
    userId: number;
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    isDefault: boolean;
    userEmail: string;
}

export interface Profile
{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    addresses: Address[];
}

export interface CheckoutRequest
{
    amount: number;
    paymentMethod: string;
    paymentMethodId?: number;
    addressId: number;
}

export interface CheckoutResult
{
    success: boolean;
    transactionId: string;
    message: string;
}
