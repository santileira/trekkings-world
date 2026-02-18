'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

type Props = {
  images: string[];
  alt?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
};

export default function ImageCarousel({
  images,
  alt = 'Gallery image',
  autoplay = false,
  autoplayDelay = 5000,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const autoplayPlugin = autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, skipSnaps: false },
    autoplayPlugin
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Show placeholder if no images
  if (!images || images.length === 0) {
    return (
      <div className="relative h-64 md:h-96 bg-slate-100 rounded-xl flex items-center justify-center">
        <svg className="w-24 h-24 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  // Single image - no carousel needed
  if (images.length === 1) {
    return (
      <>
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="relative h-64 md:h-96 w-full bg-slate-100 rounded-xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <Image
            src={images[0]}
            alt={alt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            priority
          />
        </button>
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          slides={images.map((src) => ({ src }))}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative group">
        {/* Main Carousel */}
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-64 md:h-96 flex-[0_0_100%] min-w-0"
              >
                <button
                  onClick={() => {
                    setSelectedIndex(index);
                    setIsLightboxOpen(true);
                  }}
                  className="relative w-full h-full cursor-pointer focus:outline-none"
                >
                  <Image
                    src={image}
                    alt={`${alt} ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-slate-500"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-slate-500"
          aria-label="Next image"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all focus:outline-none ${
                index === selectedIndex
                  ? 'bg-white scale-110 shadow-md'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Image Counter */}
        <div className="absolute top-3 right-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={selectedIndex}
        slides={images.map((src) => ({ src }))}
      />
    </>
  );
}
