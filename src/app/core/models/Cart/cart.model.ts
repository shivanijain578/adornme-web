export interface CartItem
{
    id: number;
    productId: number;
    productName: string;
    imageUrl?: string;
    price: number;
    discountPrice?: number | null;
    quantity: number;
    stockQuantity: number;
    subtotal: number;
}

export interface CartSummary
{
    cartId: number;
    userId?: number;
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    total: number;
    deliveryCharge?: number;
}

export interface ApiResponse<T>
{
    success: boolean;
    message?: string;
    data: T;
}

export interface AddToCartRequest
{
    productId: number;
    quantity: number;
}

export interface UpdateCartItemRequest
{
    quantity: number;
}