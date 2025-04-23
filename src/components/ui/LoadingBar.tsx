'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export default function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);

  useEffect(() => {
    // Configure NProgress
    NProgress.configure({
      showSpinner: false,
      minimum: 0.1,
      easing: 'ease',
      speed: 500,
      trickleSpeed: 200,
      parent: 'body',
    });
  }, []);

  useEffect(() => {
    // Only trigger loading bar when the route changes
    if (pathname !== prevPathname || searchParams !== prevSearchParams) {
      // Start the progress bar
      NProgress.start();

      // Complete the progress bar when the route is fully loaded
      const timer = setTimeout(() => {
        NProgress.done(true); // Force complete
      }, 500);

      // Update previous values
      setPrevPathname(pathname);
      setPrevSearchParams(searchParams);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [pathname, searchParams, prevPathname, prevSearchParams]);

  return null;
}
