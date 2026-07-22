'use client';

import { useEffect } from 'react';

type Props = {
  bisnisId: string;
};

/**
 * Tracker — client component to track tenant page views.
 * Fires a POST request to /api/track with the business ID, current path, and referrer.
 */
export function Tracker({ bisnisId }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bisnisId,
        path: window.location.pathname,
        referrer: document.referrer || null,
      }),
    }).catch((err) => {
      // Quietly warn, don't affect UX
      console.warn('Tracking failed:', err);
    });
  }, [bisnisId]);

  return null;
}
