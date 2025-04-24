// Global type definitions

// Google Analytics
interface Window {
  gtag: (
    command: 'config' | 'event' | 'set',
    targetId: string,
    config?: Record<string, any> | undefined
  ) => void;
}

// Extend the process.env type
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_GA_MEASUREMENT_ID: string;
    NEXT_PUBLIC_API_URL: string;
    GOOGLE_SITE_VERIFICATION: string;
    DATABASE_URL: string;
    NEXT_PUBLIC_CDN_URL: string;
  }
}
