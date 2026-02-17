'use client';

type ExternalLink = {
  title: string;
  url: string;
  description?: string;
};

type Props = {
  links: ExternalLink[];
  locale: string;
};

export default function ExternalLinks({ links, locale }: Props) {
  if (!links || links.length === 0) {
    return null;
  }

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-slate-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-grow min-w-0">
              <h4 className="text-base font-medium text-gray-900 group-hover:text-slate-700 transition-colors truncate">
                {link.title}
              </h4>
              <p className="text-sm text-gray-500 mt-1">{getDomain(link.url)}</p>
              {link.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{link.description}</p>
              )}
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-slate-600 flex-shrink-0 ml-3 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </a>
      ))}
    </div>
  );
}
