import Link from 'next/link';
import { ComponentType, FC, ReactNode } from 'react';
import { BackLink } from '@/components/molecules/BackLink';
import type { ScheduleMeta } from '@/data';

export interface CourseItem {
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
}

export interface HomeTemplateProps {
  title: string;
  description: string;
  items: CourseItem[];
  children?: ReactNode;
  showBackLink?: boolean;
}

export const CourseGrid: FC<{ items: CourseItem[]; wide?: boolean }> = ({
  items,
  wide = false,
}) => (
  <div
    className={
      wide
        ? 'grid w-full grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-6'
        : 'grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
    }>
    {items.map(({ label, description: itemDescription, icon: Icon, href }) => (
      <Link
        key={href}
        href={href}
        data-testid={`tool-card-${href.replaceAll('/', '')}`}
        className="border-base-content/10 bg-base-200 hover:border-primary group rounded-xl border p-4 transition-colors">
        <div className="bg-primary/10 text-primary mb-3 flex h-9 w-9 items-center justify-center rounded-lg">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-base font-bold">{label}</h2>
        <p className="text-base-content/60 mt-0.5 text-xs">{itemDescription}</p>
      </Link>
    ))}
  </div>
);

CourseGrid.displayName = 'CourseGrid';

const emojiIcon = (emoji: string): FC<{ className?: string }> => {
  const EmojiIcon: FC<{ className?: string }> = () => (
    <span className="text-2xl leading-none" aria-hidden="true">
      {emoji}
    </span>
  );
  EmojiIcon.displayName = 'EmojiIcon';
  return EmojiIcon;
};

export const scheduleToCourseItem = (schedule: ScheduleMeta): CourseItem => ({
  label: schedule.label,
  description: schedule.description,
  icon: emojiIcon(schedule.emoji),
  href: `/schedule/${schedule.slug}/`,
});

export const HomeTemplate: FC<HomeTemplateProps> = ({
  title,
  description,
  items,
  children,
  showBackLink = false,
}) => (
  <main className="bg-base-100 flex min-h-dvh flex-col items-center justify-center gap-8 p-4 sm:p-6">
    {showBackLink && <BackLink />}
    <div className="text-center">
      <h1 className="text-primary font-serif text-4xl font-bold tracking-tight">
        {title}
      </h1>
      <p className="text-base-content/60 mt-2 text-sm">{description}</p>
    </div>
    <CourseGrid items={items} />
    {children}
  </main>
);
