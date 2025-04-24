import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession, AUTH_COOKIE } from '@/lib/simpleAuth';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching current user');

    // Check for session cookie
    const sessionCookie = request.cookies.get(AUTH_COOKIE);
    console.log('Session cookie present:', !!sessionCookie);

    if (!sessionCookie) {
      console.log('No session cookie found');
      // List all cookies for debugging
      console.log('All cookies:', [...request.cookies.getAll().map(c => c.name)]);

      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('Session cookie value (first 10 chars):', sessionCookie.value.substring(0, 10) + '...');

    // Get user from session
    const user = await getUserFromSession(sessionCookie.value);
    console.log('User from session:', user);

    if (!user) {
      console.log('Invalid session or user not found');
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', user.email, user.role);

    // Set cache control headers to prevent caching
    const response = NextResponse.json({
      success: true,
      user,
    });

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
