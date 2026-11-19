'use client';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

// Adjust displayed during render (React's "derive state from props" pattern)
// so the reel always starts a spin on the current topic without a
// synchronous setState inside an effect.
const useDisplayedTopic = (
  current: string,
  spinning: boolean
): [string, (topic: string) => void] => {
  const [displayed, setDisplayed] = useState(current);
  const [prev, setPrev] = useState({ current, spinning });
  if (prev.current !== current || prev.spinning !== spinning) {
    setPrev({ current, spinning });
    setDisplayed(current);
  }
  return [displayed, setDisplayed];
};

interface ReelProps {
  topics: string[];
  spinning: boolean;
  landed: boolean;
  current: string;
  itemLabel?: string;
  cuisineLabel?: string;
}

export const Reel: FC<ReelProps> = ({
  topics,
  spinning,
  landed,
  current,
  itemLabel,
  cuisineLabel,
}) => {
  const [displayed, setDisplayed] = useDisplayedTopic(current, spinning);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!spinning || topics.length === 0) return;
    let index = topics.indexOf(current);
    if (index < 0) index = 0;
    intervalRef.current = setInterval(() => {
      index = (index + 1) % topics.length;
      setDisplayed(topics[index]);
    }, 80);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [spinning, current, topics, setDisplayed]);

  const showLabel = landed || spinning;

  let label = '';
  if (showLabel && landed) {
    const parts = ['Your Meal'];
    if (cuisineLabel) parts.push(cuisineLabel);
    if (itemLabel) parts.push(itemLabel);
    label = parts.join(' · ');
  } else if (showLabel) {
    label = 'Rolling…';
  }

  return (
    <div className="flex min-h-40 w-full flex-col items-center justify-center gap-2">
      {showLabel && (
        <p className="text-accent m-0 text-xs font-bold tracking-widest uppercase">
          {label}
        </p>
      )}
      <p
        data-testid="reel-display"
        className={`container m-0 mx-auto text-center font-serif text-5xl leading-tight font-medium tracking-tighter capitalize transition-all duration-300 sm:text-6xl md:text-7xl ${
          spinning ? 'text-base-content/90' : 'text-base-content'
        }`}>
        {spinning ? (
          displayed
        ) : current ? (
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(current + ' food')}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Search Google for "${current}"`}
            className="underline-offset-8 hover:underline">
            {current}
          </a>
        ) : (
          '🍽️'
        )}
      </p>
    </div>
  );
};

Reel.displayName = 'Reel';
