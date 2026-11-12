import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Drink Randomizer | FDR',
  description: "Can't decide what to drink? Spin the reel and let fate choose.",
  alternates: { canonical: '/drinks/randomizer/' },
};

const RandomizerLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <>{children}</>
);

export default RandomizerLayout;
