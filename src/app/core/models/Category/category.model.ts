export interface Category
{
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    isVisible: boolean;
}

export interface CategoryRequest
{
    name: string;
    description?: string;
    imageUrl?: string;
    isVisible: boolean;
}