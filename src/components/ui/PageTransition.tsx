'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export default function PageTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Configure NProgress and handle route changes
  useEffect(() => {
    // Configure NProgress - minimal settings
    NProgress.configure({
      showSpinner: false,
      minimum: 0.2,
      speed: 300,
      trickleSpeed: 100,
    });

    // Start and complete immediately to avoid delays
    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    // Add event listeners for route changes
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    // Clean up event listeners
    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, []);

  // Handle route changes within Next.js
  useEffect(() => {
    NProgress.done();
    NProgress.start();

    // Complete the progress bar quickly
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
