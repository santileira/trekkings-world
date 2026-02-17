'use client';

import { useEffect, useRef } from 'react';

type Props = {
  slug: string;
};

export default function Comments({ slug }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Giscus configuration
    // Note: You'll need to set up Giscus with your GitHub repo
    // Visit https://giscus.app to configure
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', 'YOUR_GITHUB_USERNAME/trekkings-world');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
    script.setAttribute('data-category', 'Comments');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', slug);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'es');
    script.setAttribute('data-loading', 'lazy');

    if (ref.current) {
      ref.current.appendChild(script);
    }

    return () => {
      if (ref.current) {
        const giscusFrame = ref.current.querySelector('.giscus-frame');
        if (giscusFrame) {
          giscusFrame.remove();
        }
      }
    };
  }, [slug]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div ref={ref} className="giscus" />
      {/* Placeholder while Giscus loads or if not configured */}
      <div className="text-center py-6 sm:py-8 text-gray-500">
        <svg className="mx-auto w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm sm:text-base">Comments will appear here once Giscus is configured.</p>
        <p className="text-xs sm:text-sm mt-2">
          Set up at{' '}
          <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:underline">
            giscus.app
          </a>
        </p>
      </div>
    </div>
  );
}
