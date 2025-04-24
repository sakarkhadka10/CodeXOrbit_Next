import { NextRequest, NextResponse } from 'next/server';
import { notifyIndexNow } from '@/lib/indexnow';

// API endpoint to manually trigger IndexNow notifications
export async function POST(req: NextRequest) {
  try {
    // Check for API key
    const apiKey = req.headers.get('x-api-key');
    const secretKey = process.env.INDEXNOW_ADMIN_KEY || process.env.SITEMAP_API_KEY || 'your-secret-key';

    if (apiKey !== secretKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get URLs from request body
    const data = await req.json();
    const urls = data.urls;

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No URLs provided' },
        { status: 400 }
      );
    }

    // Notify search engines
    const success = await notifyIndexNow(urls);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Successfully notified search engines',
        urls,
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to notify search engines' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in IndexNow API:', error);

    return NextResponse.json(
      { success: false, message: 'Error processing request' },
      { status: 500 }
    );
  }
}
