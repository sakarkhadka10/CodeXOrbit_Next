'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';

export default function FastLoadingBar() {
  const pathname = usePathname();

  useEffect(() => {
    // Configure NProgress with minimal settings
    NProgress.configure({
      showSpinner: false,
      minimum: 0.3,
      speed: 200,
      trickleSpeed: 100,
      easing: 'linear',
    });
  }, []);

  // Only run this effect when the pathname changes
  useEffect(() => {
    // Start and immediately complete to show a quick flash of the loading bar
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done(true);
    }, 200); // Short timeout for a quick loading indicator

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return null;
}
