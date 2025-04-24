import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Constants
import { AUTH_COOKIE } from '@/lib/simpleAuth';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Add cache control for static assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/icons/') ||
    pathname.includes('.') // Any file with extension
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  // Skip middleware for admin-direct route (for debugging)
  if (pathname.startsWith('/admin-direct')) {
    console.log('Middleware: Skipping middleware for admin-direct route');
    return response;
  }

  // Skip middleware for auth API routes
  if (pathname.startsWith('/api/auth')) {
    console.log('Middleware: Skipping middleware for auth API route');
    return response;
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    console.log('Middleware: Protecting admin route:', pathname);

    // Skip middleware for API routes
    if (pathname.includes('/api/')) {
      console.log('Middleware: Skipping middleware for API route');
      return response;
    }

    // Get session token from cookies
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    console.log('Middleware: Session token present:', !!token);

    // If no token, redirect to login
    if (!token) {
      console.log('Middleware: No session token found, redirecting to login');
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    // Add a header to indicate that the request has been processed by middleware
    // This helps prevent redirect loops
    response.headers.set('x-middleware-processed', 'true');

    // Continue with the request - we'll check authentication in the page component
    return response;
  }

  return response;
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    // Apply to all paths except API routes and Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
