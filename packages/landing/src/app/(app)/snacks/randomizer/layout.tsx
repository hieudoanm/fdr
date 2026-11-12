import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Snack Randomizer | FDR',
  description: "Can't decide on a snack? Spin the reel and let fate choose.",
  alternates: { canonical: '/snacks/randomizer/' },
};

const RandomizerLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <>{children}</>
);

export default RandomizerLayout;
