import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper function to truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

interface Author {
  name: string;
  avatarUrl: string;
  readTime: string;
}

export interface DisplayCardProps {
  href: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  author: Author;
  variant?: 'default' | 'compact';
  className?: string;
}

export const DisplayCardsDefault: React.FC<DisplayCardProps> = ({
  href,
  imageUrl,
  category,
  title,
  description,
  author,
  variant = 'default',
  className,
}) => {
  const isCompact = variant === 'compact';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read more about ${title}`}
      className={cn(
        'group relative block overflow-hidden rounded-lg bg-slate-800 shadow-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-3 hover:scale-[1.04] hover:-rotate-y-1 hover:rotate-x-2',
        className
      )}
    >
      <article className="flex h-full flex-col">
        {/* Card Image */}
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              {category}
            </p>
            <h3 className={cn('mt-2 font-bold text-slate-100', isCompact ? 'text-lg' : 'text-xl')}>
              {title}
            </h3>
            {!isCompact && (
              <p className="mt-2 text-sm text-slate-400">
                {truncateText(description, 100)}
              </p>
            )}
          </div>

          {/* Card Footer / Author Info */}
          <div className="mt-4 flex items-center pt-4 border-t border-slate-700/80">
            <img
              src={author.avatarUrl}
              alt={`${author.name}'s avatar`}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-100">{author.name}</p>
              <div className="flex items-center text-xs text-slate-400">
                <Clock className="mr-1.5 h-3 w-3" />
                <span>{author.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </a>
  );
};