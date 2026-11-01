import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { formatDate } from '../lib/utils';
import OptimizedImage from './OptimizedImage';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background';

/**
 * One link wraps the whole card, so there is a single tab stop per story and the
 * accessible name is the headline (not a repeated "Read full story").
 */
const PressReleaseCard = ({ release, variant = 'vertical', className, headingLevel: Heading = 'h3' }) => {
  if (!release) return null;
  const isHorizontal = variant === 'horizontal';
  const href = `/press/${release.slug || release.id}`;

  return (
    <Link
      href={href}
      className={clsx(
        'group block rounded-card',
        isHorizontal ? 'grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12' : 'flex h-full flex-col',
        focusRing,
        className
      )}
    >
      <div
        className={clsx(
          'relative w-full overflow-hidden rounded-card bg-secondary/40',
          isHorizontal ? 'aspect-[4/3]' : 'mb-5 aspect-[16/10]'
        )}
      >
        <OptimizedImage
          src={release.imageUrl || release.image_url}
          alt=""
          fill
          optimize
          sizes={isHorizontal ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className={clsx('flex flex-col', isHorizontal ? 'justify-center md:py-6' : 'flex-1')}>
        <time dateTime={release.date} className="text-sm text-muted-foreground">
          {formatDate(release.date)}
        </time>

        <Heading
          className={clsx(
            'mt-2 font-medium tracking-tight text-foreground underline-offset-4 group-hover:underline',
            isHorizontal ? 'text-3xl leading-tight md:text-4xl' : 'line-clamp-2 text-xl leading-snug'
          )}
        >
          {release.title}
        </Heading>

        {release.excerpt && (
          <p className={clsx('mt-3 text-muted-foreground', isHorizontal ? 'line-clamp-5 text-lg leading-relaxed' : 'line-clamp-3 flex-1 leading-relaxed')}>
            {release.excerpt}
          </p>
        )}

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
          Read the story
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};

export default PressReleaseCard;
