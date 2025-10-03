'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className="fixed bottom-8 right-8 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-300 z-50"
      onClick={scrollToTop}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </button>
  );
}
