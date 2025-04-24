import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

// Types
export interface UserData {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days
const COOKIE_NAME = 'auth_token';

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare password with hash
export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(user: UserData): string {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Set auth cookie
export function setAuthCookie(response: NextResponse, token: string): void {
  console.log('Setting auth cookie:', COOKIE_NAME, token.substring(0, 10) + '...');

  try {
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });
    console.log('Auth cookie set successfully');
  } catch (error) {
    console.error('Error setting auth cookie:', error);
  }
}

// Clear auth cookie
export function clearAuthCookie(response: NextResponse): void {
  console.log('Clearing auth cookie');

  try {
    response.cookies.set({
      name: COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    console.log('Auth cookie cleared successfully');
  } catch (error) {
    console.error('Error clearing auth cookie:', error);
  }
}

// Verify JWT token
export function verifyToken(token: string): JwtPayload | null {
  try {
    console.log('Verifying token...');
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log('Token verified successfully');
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<UserData | null> {
  console.log('Getting current user from request');
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    console.log('No auth token found in cookies');
    return null;
  }

  console.log('Auth token found, verifying...');
  const payload = verifyToken(token);
  if (!payload) {
    console.log('Invalid or expired token');
    return null;
  }

  console.log('Token verified, user ID:', payload.id);

  try {
    console.log('Fetching user from database');
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      console.log('User not found in database');
      return null;
    }

    console.log('User found:', user.email, user.role);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Get current user from server component
export async function getServerUser(): Promise<UserData | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Check if user is admin
export function isAdmin(user: UserData | null): boolean {
  return user?.role === 'ADMIN';
}

// Check if user is authenticated
export function isAuthenticated(user: UserData | null): boolean {
  return !!user;
}
