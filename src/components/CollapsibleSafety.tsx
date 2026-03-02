'use client';

import { useState, useRef, useEffect } from 'react';
import { PortableText } from '@portabletext/react';

type CollapsibleSafetyProps = {
  value: any[];
  expandLabel: string;
  collapseLabel: string;
};

const COLLAPSED_HEIGHT = 160; // ~5 lines

export default function CollapsibleSafety({ value, expandLabel, collapseLabel }: CollapsibleSafetyProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setNeedsCollapse(contentRef.current.scrollHeight > COLLAPSED_HEIGHT + 40);
    }
  }, [value]);

  return (
    <div>
      <div
        ref={contentRef}
        className="relative overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: expanded || !needsCollapse ? contentRef.current?.scrollHeight ?? 'none' : COLLAPSED_HEIGHT }}
      >
        <div className="prose prose-slate max-w-none prose-li:marker:text-blue-500 prose-li:my-1 prose-h2:text-lg prose-h2:mt-0 prose-h3:text-base prose-h3:mt-3 prose-h4:text-sm">
          <PortableText value={value} />
        </div>
        {!expanded && needsCollapse && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50 to-transparent pointer-events-none" />
        )}
      </div>
      {needsCollapse && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          {expanded ? collapseLabel : expandLabel}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
