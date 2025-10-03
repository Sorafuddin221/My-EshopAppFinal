import api from '../../../utils/api';
import type { Metadata } from 'next';

interface BlogPost {
    _id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    imageUrl: string;
    createdAt: string; 
    updatedAt: string;
    metaDescription?: string;
    metaKeywords?: string;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const postId = params.id;
    let blogPost: BlogPost | null = null;
    try {
        blogPost = await api.get(`/blogposts/${postId}`);
    } catch (error) {
        console.error('Error fetching blog post for metadata:', error);
    }

    if (!blogPost) {
        return {
            title: 'Blog Post Not Found',
            description: 'The blog post you are looking for does not exist.',
        };
    }

    return {
        title: blogPost.title,
        description: blogPost.metaDescription || blogPost.content.substring(0, 160),
        keywords: blogPost.metaKeywords ? blogPost.metaKeywords.split(',').map(keyword => keyword.trim()) : [],
        openGraph: {
            title: blogPost.title,
            description: blogPost.metaDescription || blogPost.content.substring(0, 160),
            images: [blogPost.imageUrl],
            url: `https://yourwebsite.com/single-blog/${blogPost._id}`, // Replace with your actual domain
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: blogPost.title,
            description: blogPost.metaDescription || blogPost.content.substring(0, 160),
            images: [blogPost.imageUrl],
        },
    };
}