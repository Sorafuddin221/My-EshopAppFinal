export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: { _id: string; name: string };
    imageUrl: string;
    stock: number;
    rating: number;
    views: number;
    createdAt: string;
    brand: { _id: string; name: string };
}
