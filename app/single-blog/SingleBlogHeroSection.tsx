import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface SingleBlogHeroSectionProps {
    title: string;
    category?: string;
}

const SingleBlogHeroSection = ({ title, category }: SingleBlogHeroSectionProps) => {
    return (
        <section className="hero-section text-light relative py-20 overflow-hidden" style={{ backgroundColor: 'rgb(239 68 68 / var(--tw-bg-opacity, 1))' }}>
            <div className="container py-20 mx-auto px-4 flex flex-col justify-center text-center sm:text-left z-10">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{title}</h1>
                <div className="mt-4 flex items-center justify-center sm:justify-start space-x-2 text-sm">
                    <a href="/" className="hover:text-gray-200">Home</a>
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                    <a href="/blog-posts" className="hover:text-gray-200">Blog</a>
                    {category && (
                        <>
                            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                            <span className="text-gray-300">{category}</span>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SingleBlogHeroSection;