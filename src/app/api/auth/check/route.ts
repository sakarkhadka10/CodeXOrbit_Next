import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const COOKIE_NAME = 'auth_token';

export async function GET(request: NextRequest) {
  try {
    console.log('Auth check request received');
    
    // Get all cookies
    const allCookies = request.cookies.getAll();
    console.log('All cookies:', allCookies.map(c => c.name));
    
    // Get auth token
    const authCookie = request.cookies.get(COOKIE_NAME);
    console.log('Auth cookie present:', !!authCookie);
    
    if (!authCookie) {
      return NextResponse.json({
        success: false,
        message: 'No auth token found',
        cookies: allCookies.map(c => c.name),
      });
    }
    
    // Verify token
    try {
      const token = authCookie.value;
      console.log('Token (first 10 chars):', token.substring(0, 10) + '...');
      
      const payload = jwt.verify(token, JWT_SECRET);
      console.log('Token verified successfully:', payload);
      
      return NextResponse.json({
        success: true,
        message: 'Token verified successfully',
        payload,
        cookies: allCookies.map(c => c.name),
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      
      return NextResponse.json({
        success: false,
        message: 'Token verification failed',
        error: error instanceof Error ? error.message : String(error),
        cookies: allCookies.map(c => c.name),
      });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'An error occurred during auth check',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
