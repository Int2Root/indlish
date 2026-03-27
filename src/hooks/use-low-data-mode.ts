'use client';

import { useState, useEffect } from 'react';

const KEY = 'indlish_low_data_mode';

export function useLowDataMode() {
  const [lowDataMode, setLowDataMode] = useState(false);

  useEffect(() => {
    // Check localStorage first
    const stored = localStorage.getItem(KEY);
    if (stored !== null) {
      setLowDataMode(stored === 'true');
      return;
    }
    // Auto-detect slow connections
    const conn = (navigator as any).connection;
    if (conn) {
      const slow = conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.saveData;
      setLowDataMode(slow);
    }
  }, []);

  useEffect(() => {
    // Apply CSS class to document
    if (lowDataMode) {
      document.documentElement.classList.add('low-data');
    } else {
      document.documentElement.classList.remove('low-data');
    }
  }, [lowDataMode]);

  const toggle = () => {
    setLowDataMode((prev) => {
      const next = !prev;
      localStorage.setItem(KEY, String(next));
      return next;
    });
  };

  return { lowDataMode, toggle };
}
