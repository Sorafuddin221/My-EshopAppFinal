import { Metadata } from 'next';
import api from '../../../utils/api'; // Adjust path as needed

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const postId = params.id;
  try {
    const blogPost = await api.get(`/blogposts/${postId}`);
    return {
      title: blogPost.title,
    };
  } catch (error) {
    console.error('Error fetching blog post for metadata:', error);
    return {
      title: 'Blog Post Not Found',
    };
  }
}

import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AuthModal from "../../components/AuthModal";
import BackToTopButton from "../../components/BackToTopButton";
import api from '../../../utils/api';
import { BlogPost } from '@/app/types/BlogPost';
import SingleBlogHeroSection from "../SingleBlogHeroSection";
import SingleBlogPostContent from "../SingleBlogPostContent";



const SingleBlogPostPage = async ({ params }: { params: { id: string } }) => {
    const postId = params.id;
    let blogPost: BlogPost | null = null;
    let error: string | null = null;

    try {
        const data = await api.get(`/blogposts/${postId}`);
        if (data._id) {
            blogPost = data;
        } else {
            error = data.msg || 'Blog post not found.';
        }
    } catch (err: any) {
        error = err.message || 'Server error. Could not fetch blog post.';
    }

    if (error) {
        return (
            <div className="font-sans bg-gray-100">
                <Header />
                <Navbar />
                <main className="container mx-auto px-4 py-12 text-center text-red-500">
                    Error: {error}
                </main>
                <Footer />
                <BackToTopButton />
            </div>
        );
    }

    if (!blogPost) {
        return (
            <div className="font-sans bg-gray-100">
                <Header />
                <Navbar />
                <main className="container mx-auto px-4 py-12 text-center">
                    Blog post not found.
                </main>
                <Footer />
                <BackToTopButton />
            </div>
        );
    }

    return (
        <div className="font-sans bg-gray-100">
            <Header />
            <Navbar />
            <SingleBlogHeroSection title={blogPost.title} category={blogPost.category && typeof blogPost.category !== 'string' ? blogPost.category : undefined} />
            <main className="container mx-auto px-4 py-12">
                <SingleBlogPostContent blogPost={blogPost} />
            </main>
            <Footer />
            <BackToTopButton />
        </div>
    );
};

export default SingleBlogPostPage;
