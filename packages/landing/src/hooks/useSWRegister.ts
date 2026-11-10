'use client';

import { useEffect } from 'react';

export const useSWRegister = (): void => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV === 'development') {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((sw) => sw.unregister()))
        )
        .then(() => {
          if (typeof caches === 'undefined') return;
          caches
            .keys()
            .then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
        })
        .catch(() => undefined);
      return;
    }
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    navigator.serviceWorker
      .register(`${basePath}/sw.js`)
      .catch(() => undefined);
  }, []);
};
