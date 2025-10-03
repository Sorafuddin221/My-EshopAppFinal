import { MetadataRoute } from 'next'
import api from '../utils/api';

interface Product {
  _id: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  updatedAt: string;
}

interface Brand {
  _id: string;
  updatedAt: string;
}

interface BlogPost {
  _id: string;
  updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';

  // Fetch dynamic data
  let products: Product[] = [];
  let categories: Category[] = [];
  let brands: Brand[] = [];
  let blogPosts: BlogPost[] = [];

  const results = await Promise.allSettled([
    api.get('/products'),
    api.get('/categories'),
    api.get('/brands'),
    api.get('/blogposts'),
  ]);

  products = results[0].status === 'fulfilled' ? (results[0].value as Product[]) : [];
  categories = results[1].status === 'fulfilled' ? (results[1].value as Category[]) : [];
  brands = results[2].status === 'fulfilled' ? (results[2].value as Brand[]) : [];
  blogPosts = results[3].status === 'fulfilled' ? (results[3].value as BlogPost[]) : [];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/single-product/${product._id}`,
    lastModified: product.updatedAt,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/products-by-category?category=${category._id}`,
    lastModified: category.updatedAt,
  }));

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/products/brand/${brand._id}`,
    lastModified: brand.updatedAt,
  }));

  const blogPostRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/single-blog/${post._id}`,
    lastModified: post.updatedAt,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products/category`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products/brand`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog-posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...blogPostRoutes,
  ];
}
