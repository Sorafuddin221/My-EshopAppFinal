"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faTags } from '@fortawesome/free-solid-svg-icons';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
}


interface SingleBlogPostContentProps {
  blogPost?: {
    _id: string;
    title: string;
    content: string;
    author: string;
    category?: string;
    imageUrl?: string;
    createdAt: string;
  };
}

const SingleBlogPostContent = ({ blogPost }: SingleBlogPostContentProps) => {
    const { token, user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [commentAuthor, setCommentAuthor] = useState(user?.username || '');
    const [commentEmail, setCommentEmail] = useState(user?.email || '');
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (blogPost?._id) {
            const fetchComments = async () => {
                try {
                    const data = await api.get(`/comments/${blogPost._id}`);
                    setComments(data);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                }
            };
            fetchComments();
        }
    }, [blogPost?._id]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (!token) {
            setMessage('Please log in to comment.');
            return;
        }

        if (!newCommentContent.trim()) {
            setMessage('Comment cannot be empty.');
            return;
        }

        try {
            const commentData = {
                blogPost: blogPost?._id,
                author: commentAuthor,
                content: newCommentContent,
            };
            const response = await api.post('/comments', commentData, token);
            if (response._id) {
                setComments([...comments, response]);
                setNewCommentContent('');
                setMessage('Comment added successfully!');
            } else {
                setMessage(response.msg || 'Failed to add comment.');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            setMessage('Server error. Could not add comment.');
        }
    };

    if (!blogPost) {
        return <div className="lg:col-span-2 text-center py-8">Loading post...</div>;
    }

    return (
        <div className="lg:col-span-2 space-y-8">
            {/* Blog Post Content */}
            <article className="bg-white p-8 rounded-lg shadow-lg">
                <img src={blogPost.imageUrl && blogPost.imageUrl.startsWith('/uploads/') ? blogPost.imageUrl : "https://via.placeholder.com/800x450?text=Blog+Post+Image"} alt={blogPost.title} className="w-full h-auto object-cover rounded-lg mb-6" />

                <h1 className="text-3xl font-bold text-gray-800 mb-4">{blogPost.title}</h1>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-1">
                        <FontAwesomeIcon icon={faUser} />
                        <span>by {blogPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <FontAwesomeIcon icon={faCalendar} />
                        <span>{new Date(blogPost.createdAt).toLocaleDateString()}</span>
                    </div>
                    {blogPost.category && (
                        <div className="flex items-center space-x-1">
                            <FontAwesomeIcon icon={faTags} />
                            <span>{blogPost.category}</span>
                        </div>
                    )}
                </div>

                <div className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: blogPost.content }} />

                {/* Post Tags */}
                {blogPost.category && (
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2">Category:</h4>
                        <div className="flex flex-wrap space-x-2">
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200">{blogPost.category}</span>
                        </div>
                    </div>
                )}

                {/* Author Box */}
                <div className="mt-8 p-6 bg-gray-100 rounded-lg flex items-center space-x-4">
                    <img src="https://via.placeholder.com/100x100?text=Author" alt="Author photo" className="w-20 h-20 rounded-full object-cover" />
                    <div>
                        <h5 className="font-bold text-lg text-gray-800">{blogPost.author}</h5>
                        <p className="text-gray-600 text-sm">Web developer and tech enthusiast. I write about new trends and product reviews.</p>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">{comments.length} Comments</h3>
                    <div className="space-y-6">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment._id} className="bg-gray-50 p-4 rounded-lg flex space-x-4">
                                    <img src="https://via.placeholder.com/60x60?text=User" alt="User photo" className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h6 className="font-semibold text-gray-800">{comment.author}</h6>
                                            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>

                {/* Comment Form */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Leave a Reply</h3>
                    {message && <p className="text-sm mt-4" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
                    <form className="space-y-4" onSubmit={handleCommentSubmit}>
                        <div>
                            <label htmlFor="comment" className="sr-only">Comment</label>
                            <textarea
                                id="comment"
                                name="comment"
                                rows={6}
                                className="w-full p-4 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                placeholder="Your Comment..."
                                value={newCommentContent}
                                onChange={(e) => setNewCommentContent(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="name" className="sr-only">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                    placeholder="Name"
                                    value={commentAuthor}
                                    onChange={(e) => setCommentAuthor(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                    placeholder="Email"
                                    value={commentEmail}
                                    onChange={(e) => setCommentEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="website" className="sr-only">Website</label>
                                <input type="text" id="website" name="website" className="w-full p-4 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="Website" />
                            </div>
                        </div>
                        <button type="submit" className="w-full md:w-auto bg-red-500 text-white font-bold py-3 px-8 rounded-md hover:bg-red-600 transition-colors duration-300">
                            Post Comment
                        </button>
                    </form>
                </div>

            </article>
        </div>
    );
};

export default SingleBlogPostContent;