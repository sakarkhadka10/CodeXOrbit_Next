import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check if the User table exists and has records
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: `Found ${userCount} users in the database`,
      userCount
    });
  } catch (error) {
    console.error('Error testing auth:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error testing auth', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
