'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import Sidebar from './Sidebar';

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
};

export default function MobileSidebar({ isOpen, onClose, locale }: MobileSidebarProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl transform transition-transform">
        {/* Close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar content */}
        <div className="overflow-y-auto h-[calc(100vh-65px)]">
          <Sidebar locale={locale} onLinkClick={onClose} />
        </div>
      </div>
    </div>
  );
}
