import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Generate slug from name if not provided
    const slug = data.slug || data.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    // Check if category with this slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: slug }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        slug: slug,
        name: data.name
      }
    });

    // Trigger sitemap regeneration
    try {
      // Call the regenerate-sitemaps API endpoint
      const sitemapResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/regenerate-sitemaps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.SITEMAP_API_KEY || 'your-secret-key'
        }
      });

      if (sitemapResponse.ok) {
        console.log('Sitemaps regenerated successfully after creating category');
      } else {
        console.error('Failed to regenerate sitemaps after creating category');
      }

      // Notify search engines via IndexNow
      // Import from our utility library
      const { scheduleIndexNowNotificationSingle } = await import('@/lib/indexnow');
      const categoryUrl = `/category/${category.slug}`;

      // Schedule the notification to run in the background
      // This way, we don't delay the response to the user
      scheduleIndexNowNotificationSingle(categoryUrl);
      console.log(`Scheduled IndexNow notification for: ${categoryUrl}`);
    } catch (sitemapError) {
      console.error('Error regenerating sitemaps or notifying IndexNow:', sitemapError);
      // Don't fail the main request if sitemap regeneration fails
    }

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
