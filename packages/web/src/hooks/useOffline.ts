'use client';

import { useEffect, useState } from 'react';

export const useOffline = (): boolean => {
  const [offline, setOffline] = useState<boolean>(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const goOffline = (): void => setOffline(true);
    const goOnline = (): void => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  return offline;
};
