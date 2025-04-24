import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSessionToken, setSessionCookie, AUTH_COOKIE } from '@/lib/simpleAuth';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration request received');
    const { email, password, name } = await request.json();
    console.log('Registration attempt for email:', email);

    // Validate input
    if (!email || !password) {
      console.log('Registration failed: Email and password are required');
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Registration failed: User already exists');
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password');
    const hashedPassword = await hashPassword(password);

    // Check if this is the first user
    const isAdmin = await isFirstUser();
    console.log('Is first user (admin):', isAdmin);

    // Create user
    console.log('Creating user');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        // First user is automatically an admin, others are regular users
        role: isAdmin ? 'ADMIN' : 'USER',
      },
    });
    console.log('User created:', user.id, user.email, user.role);

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
      message: 'User registered successfully',
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

    console.log('Registration successful');
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during registration', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Helper function to check if this is the first user
async function isFirstUser(): Promise<boolean> {
  const count = await prisma.user.count();
  return count === 0;
}
