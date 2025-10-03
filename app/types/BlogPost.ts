export interface BlogPost {
    _id: string;
    title: string;
    content: string;
    author: string;
    category?: string;
    imageUrl?: string;
    createdAt: string;
}
