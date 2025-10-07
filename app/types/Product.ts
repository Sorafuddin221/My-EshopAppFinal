export interface Button {
    url: string;
    buttonText: string;
    regularPrice: number;
    salePrice: number;
  }
  
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
    buttons?: Button[];
  }
