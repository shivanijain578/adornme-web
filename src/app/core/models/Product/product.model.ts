export interface ProductImage
{
    id: number;
    imageUrl: string;
    displayOrder: number;
}

export interface Product
{
    id: number;
    name: string;
    description: string;
    originalPrice: number;
    sellingPrice: number;
    discountPercentage: number;
    stockQuantity: number;
    material?: string;
    gender: number;
    images: ProductImage[];
    categoryId: number;
    categoryName: string;
    isActive: boolean;
    createdAt: string;
}

export interface ProductRequest
{
    name: string;
    description: string;
    originalPrice: number;
    sellingPrice: number;
    stockQuantity: number;
    material?: string;
    gender: number;
    categoryId: number;
    isActive: boolean;
    images?: File[];
}

export interface ProductSummary
{
    id: number;
    name: string;
    originalPrice: number;
    sellingPrice: number;
    discountPercentage: number;
    images: ProductImage[];
    categoryId: number;
    categoryName: string;
}

export interface ProductDetail
{
    id: number;
    name: string;
    description: string;
    originalPrice: number;
    sellingPrice: number;
    discountPercentage: number;
    stockQuantity: number;
    images: ProductImage[];
    material?: string;
    gender: number;
    categoryId: number;
    categoryName: string;
}

export interface HomeResponse
{
    banners: HomeBanner[];
    categories: { id: number; name: string; description?: string }[];
    bestSellers: ProductSummary[];
    newArrivals: ProductSummary[];
}

export interface HomeBanner
{
    id: number;
    title: string;
    imageUrl: string;
    linkUrl?: string;
    displayOrder: number;
}