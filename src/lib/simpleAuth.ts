import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// Constants
export const AUTH_COOKIE = 'admin_session';

// Types
export interface UserData {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

// Create a simple session token (no JWT)
export function createSessionToken(userId: string): string {
  // Simple session token format: userId + timestamp + random string
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `${userId}_${timestamp}_${randomStr}`;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare password with hash
export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Set session cookie
export function setSessionCookie(response: NextResponse, token: string): void {
  console.log('Setting session cookie:', AUTH_COOKIE);

  try {
    response.cookies.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });
    console.log('Session cookie set successfully');
  } catch (error) {
    console.error('Error setting session cookie:', error);
  }
}

// Clear session cookie
export function clearSessionCookie(response: NextResponse): void {
  console.log('Clearing session cookie');

  try {
    response.cookies.set({
      name: AUTH_COOKIE,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    console.log('Session cookie cleared successfully');
  } catch (error) {
    console.error('Error clearing session cookie:', error);
  }
}

// Get user from session token
export async function getUserFromSession(token: string): Promise<UserData | null> {
  if (!token) {
    console.log('No token provided to getUserFromSession');
    return null;
  }

  try {
    // Extract userId from token
    const parts = token.split('_');
    if (parts.length < 2) {
      console.log('Invalid token format');
      return null;
    }

    const userId = parts[0];

    if (!userId) {
      console.log('No userId found in token');
      return null;
    }

    console.log('Looking up user with ID:', userId);

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      console.log('No user found with ID:', userId);
      return null;
    }

    console.log('User found:', user.email, user.role);
    return user;
  } catch (error) {
    console.error('Error getting user from session:', error);
    return null;
  }
}

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<UserData | null> {
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return getUserFromSession(token);
}

// Get current user from server component
export async function getServerUser(): Promise<UserData | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return getUserFromSession(token);
}

// Check if user is admin
export function isAdmin(user: UserData | null): boolean {
  return user?.role === 'ADMIN';
}

// Check if user is authenticated
export function isAuthenticated(user: UserData | null): boolean {
  return !!user;
}
