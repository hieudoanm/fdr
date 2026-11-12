import type { FC } from 'react';

const SectionHead: FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="mb-10 max-w-2xl">
    <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
      {title}
    </h2>
    <p className="text-base-content/60 mt-3 text-base">{description}</p>
  </div>
);

SectionHead.displayName = 'SectionHead';

export default SectionHead;
