'use client';

import { useEffect, useRef } from 'react';

type Props = {
  position: 'header' | 'sidebar' | 'inline';
  slot?: string;
};

export default function AdBanner({ position, slot }: Props) {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (!isAdsEnabled || !publisherId) return;

    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [isAdsEnabled, publisherId]);

  const getAdStyles = () => {
    switch (position) {
      case 'header':
        return 'h-24 md:h-28';
      case 'sidebar':
        return 'h-64';
      case 'inline':
        return 'h-32';
      default:
        return 'h-24';
    }
  };

  // Don't render anything if ads are not enabled
  if (!isAdsEnabled || !publisherId) {
    return null;
  }

  return (
    <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${getAdStyles()}`}>
      <div ref={adRef} className="w-full h-full">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={slot || ''}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
