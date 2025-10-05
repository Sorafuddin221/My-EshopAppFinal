'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlay, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import api from '../../utils/api';

export default function ReviewVideoSection() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewVideoUrl, setReviewVideoUrl] = useState('');
  const [reviewVideoTitle, setReviewVideoTitle] = useState('');
  const [reviewVideoDescription, setReviewVideoDescription] = useState('');
  const [reviewVideoPlaceholderImage, setReviewVideoPlaceholderImage] = useState('');
  const [teamLeaderVideoUrl, setTeamLeaderVideoUrl] = useState('');
  const [teamLeader, setTeamLeader] = useState({
    image: "",
    title: "",
    subtitle: "",
    avatar: "",
    author: "",
    role: "",
    rating: 0,
    text: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.get('/settings');
        setReviewVideoUrl(settings.reviewVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ');
        setReviewVideoTitle(settings.reviewVideoTitle || 'Watch Our Product Review');
        setReviewVideoDescription(settings.reviewVideoDescription || 'See what our customers are saying about our amazing products.');
        setReviewVideoPlaceholderImage(settings.reviewVideoPlaceholderImage || '');
        setTeamLeaderVideoUrl(settings.teamLeaderVideoUrl || '');
        setTeamLeader({
          image: settings.teamLeaderImage || "https://placehold.co/300x400?text=Phone+Image",
          title: settings.teamLeaderTitle || "DISCOVER PRO",
          subtitle: settings.teamLeaderSubtitle || "ULTIMATE MULTITASKING",
          avatar: settings.teamLeaderAvatar || "https://placehold.co/60x60?text=Avatar",
          author: settings.teamLeaderAuthor || "ThemeIM",
          role: settings.teamLeaderRole || "Team Leader",
          rating: settings.teamLeaderRating || 4,
          text: settings.teamLeaderText || "Lorem Ipsum is simply dummy text of the printing and type setting industry. The Lorem Ipsum has been the industry.",
        });
      } catch (err) {
        console.error('Error fetching review video settings:', err);
        // Fallback to default values
        setReviewVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
        setReviewVideoTitle('Watch Our Product Review');
        setReviewVideoDescription('See what our customers are saying about our amazing products.');
        setReviewVideoPlaceholderImage('https://placehold.co/600x400?text=Video+Placeholder');
        setTeamLeader({
          image: "https://placehold.co/300x400?text=Phone+Image",
          title: "DISCOVER PRO",
          subtitle: "ULTIMATE MULTITASKING",
          avatar: "https://placehold.co/60x60?text=Avatar",
          author: "ThemeIM",
          role: "Team Leader",
          rating: 4,
          text: "Lorem Ipsum is simply dummy text of the printing and type setting industry. The Lorem Ipsum has been the industry.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return null; // Or a loading spinner/placeholder
  }

  return (
    <section className="container mx-auto px-4 py-16 bg-gray-100">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">
          <span className="text-red-500">{reviewVideoTitle.split(' ')[0]}</span> {reviewVideoTitle.split(' ').slice(1).join(' ')}
        </h2>
        <p className="text-gray-500 mt-2">{reviewVideoDescription}</p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Review Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row p-6 items-center">
          <div className="w-full md:w-1/2 p-4 bg-indigo-600 text-white rounded-lg relative">
            <h3 className="text-2xl font-bold">{teamLeader.title}</h3>
            <p className="text-lg">{teamLeader.subtitle}</p>
            <img src={teamLeader.image} alt={teamLeader.title} className="mt-4 max-w-full h-auto" />
          </div>
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                <img src={teamLeader.avatar} alt={`${teamLeader.author} avatar`} className="h-10 w-10 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">{teamLeader.author}</h4>
                  <p className="text-sm text-gray-500">{teamLeader.role}</p>
                </div>
                <div className="flex items-center text-yellow-400 ml-auto text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={i < teamLeader.rating ? faStar : farStar} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{teamLeader.text}</p>
            </div>
          </div>
        </div>

        {/* Video Card */}
        <div className="bg-white rounded-xl shadow-lg relative flex items-center justify-center overflow-hidden">
          {reviewVideoUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${reviewVideoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/watch\?v=([^\s&]+)|youtu\.be\/([^\s&]+)|youtube\.com\/embed\/([^\s&]+)/)?.[1] || reviewVideoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/watch\?v=([^\s&]+)|youtu\.be\/([^\s&]+)|youtube\.com\/embed\/([^\s&]+)/)?.[2] || reviewVideoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/watch\?v=([^\s&]+)|youtu\.be\/([^\s&]+)|youtube\.com\/embed\/([^\s&]+)/)?.[3]}`}
              title={reviewVideoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          ) : (
            <img src={reviewVideoPlaceholderImage} alt="Video Placeholder" className="w-full h-full object-cover" />
          )}
          {!reviewVideoUrl && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <button className="bg-white text-red-500 p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faPlay} className="text-xl" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
