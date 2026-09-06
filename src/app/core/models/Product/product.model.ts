export interface Product
{
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    categoryId: number;
    categoryName: string;
    isActive: boolean;
    createdAt: string;
}

export interface ProductRequest
{
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    categoryId: number;
    isActive: boolean;
}

export interface ProductSummary
{
    id: number;
    name: string;
    price: number;
    discountPrice?: number;
    imageUrl?: string;
    categoryId: number;
    categoryName: string;
}

export interface ProductDetail
{
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stockQuantity: number;
    imageUrl?: string;
    material?: string;
    gender?: string;
    categoryId: number;
    categoryName: string;
}