export interface BlogPost {
    _id: string;
    title: string;
    content: string;
    author: string;
    category?: { _id: string; name: string; } | string;
    imageUrl?: string;
    createdAt: string;
}
