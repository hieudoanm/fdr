import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Food Randomizer | FDR',
  description: "Can't decide what to eat? Spin the reel and let fate choose.",
  alternates: { canonical: '/foods/randomizer/' },
};

const RandomizerLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <>{children}</>
);

export default RandomizerLayout;
