import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePasswords, createSessionToken, setSessionCookie, AUTH_COOKIE } from '@/lib/simpleAuth';

export async function POST(request: NextRequest) {
  try {
    console.log('Login request received');
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      console.log('Login failed: Email and password are required');
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    console.log('Finding user with email:', email);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      console.log('Login failed: User not found');
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('User found:', user.id, user.email, user.role);

    // Verify password
    console.log('Verifying password');
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Password verified successfully');

    // Create session token
    console.log('Creating session token');
    const sessionToken = createSessionToken(user.id);
    console.log('Session token created successfully');

    // Create response
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    console.log('Creating response with user data:', userData);
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
    });

    // Set session cookie
    console.log('Setting session cookie');
    setSessionCookie(response, sessionToken);

    // Set cookie directly as a backup
    response.cookies.set({
      name: AUTH_COOKIE,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    console.log('Login successful');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
