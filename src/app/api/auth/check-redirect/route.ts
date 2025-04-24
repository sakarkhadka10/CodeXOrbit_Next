import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession, AUTH_COOKIE } from '@/lib/simpleAuth';

export async function GET(request: NextRequest) {
  try {
    console.log('Auth check redirect API called');

    // Get the redirect URL from query params
    const searchParams = request.nextUrl.searchParams;
    const redirectPath = searchParams.get('redirect') || '/admin';
    console.log('Redirect path:', redirectPath);

    // Get session token from cookies
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    console.log('Session token present:', !!token);

    if (!token) {
      console.log('No session token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Get user from session
    const user = await getUserFromSession(token);
    console.log('User from session:', user);

    if (!user) {
      console.log('Invalid session or user not found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user is admin
    console.log('User role:', user.role);
    if (user.role !== 'ADMIN') {
      console.log('User is not admin, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log('User is authenticated and is admin, redirecting to:', redirectPath);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  } catch (error) {
    console.error('Auth check redirect error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
