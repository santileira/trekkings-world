'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            {t('madeWith')} ❤️ {t('forAdventurers')}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">
              {tCommon('privacy')}
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-slate-700 transition-colors">
              {tCommon('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
