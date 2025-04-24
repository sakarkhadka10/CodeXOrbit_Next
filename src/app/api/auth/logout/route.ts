import { NextResponse } from 'next/server';
import { clearSessionCookie, AUTH_COOKIE } from '@/lib/simpleAuth';

export async function POST() {
  try {
    console.log('Logout request received');

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    // Clear session cookie
    clearSessionCookie(response);

    // Clear cookie directly as a backup
    response.cookies.set({
      name: AUTH_COOKIE,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    console.log('Logout successful');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
