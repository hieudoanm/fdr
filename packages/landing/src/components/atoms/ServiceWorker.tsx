'use client';

import type { FC } from 'react';
import { useSWRegister } from '@/hooks/useSWRegister';

export const ServiceWorker: FC = () => {
  useSWRegister();
  return null;
};
