'use client';

import { useState } from 'react';

type Props = {
  locale: string;
};

export default function FeedbackButton({ locale }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappLink = 'https://wa.me/5491135219400';

  const label = locale === 'es' ? 'Sugerencias' : 'Feedback';

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
      title={label}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <span className={`font-medium transition-all duration-300 ${isHovered ? 'opacity-100 max-w-32' : 'opacity-100 max-w-32 sm:opacity-0 sm:max-w-0'} overflow-hidden whitespace-nowrap`}>
        {label}
      </span>
    </a>
  );
}
