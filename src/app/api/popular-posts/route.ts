import { NextResponse } from "next/server";
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Fetch popular posts from database (most recent for now)
    const dbPosts = await prisma.blog.findMany({
      where: { published: true },
      include: { category: true }, // Include the related category
      orderBy: { createdAt: 'desc' },
      take: 12
    });

    // Transform database posts to match expected format
    const popularPosts = dbPosts.map(post => ({
      id: post.id,
      title: post.title,
      coverImage: "/img/frontendbg.png", // Default image
      shortDescription: (post.excerpt || '').length > 100 ? (post.excerpt || '').substring(0, 100) + '...' : (post.excerpt || ''),
      author: post.author,
      date: new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      category: post.category ? post.category.name : (post.tags || 'Uncategorized'),
      slug: post.slug,
    }));

    // If no posts in database, fall back to static data
    if (popularPosts.length === 0) {
      // ... existing static posts array ...
    }

    return NextResponse.json(popularPosts);
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return NextResponse.json({ error: "Failed to fetch popular posts" }, { status: 500 });
  }
}

