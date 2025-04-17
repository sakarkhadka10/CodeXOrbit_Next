import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get("q")?.toLowerCase() || "";
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    // Fetch posts from database
    const dbPosts = await prisma.blog.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: searchTerm } },
              { excerpt: { contains: searchTerm } },
              { author: { contains: searchTerm } },
              { tags: { contains: searchTerm } }
            ]
          },
          category ? { tags: { contains: category } } : {}
        ],
        published: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Transform database posts to match expected format
    const transformedPosts = dbPosts.map(post => ({
      id: post.id.toString(),
      title: post.title,
      shortDescription: post.excerpt || '',
      author: post.author,
      date: post.createdAt.toISOString(),
      coverImage: "/img/frontendbg.png", // Default image
      slug: post.slug,
      category: post.tags || 'Uncategorized',
      content: post.content
    }));

    // Count total posts for pagination
    const totalCount = await prisma.blog.count({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: searchTerm } },
              { excerpt: { contains: searchTerm } },
              { author: { contains: searchTerm } },
              { tags: { contains: searchTerm } }
            ]
          },
          category ? { tags: { contains: category } } : {}
        ],
        published: true
      }
    });

    // Get categories from database
    const allPosts = await prisma.blog.findMany({
      where: { published: true },
      select: { tags: true }
    });
    
    const categoryMap: Record<string, number> = {};
    allPosts.forEach(post => {
      if (post.tags) {
        const category = post.tags;
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      }
    });

    const categories = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      posts: transformedPosts,
      categories,
      totalCount,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error processing posts:", error);
    return NextResponse.json(
      { error: "Failed to process posts" },
      { status: 500 }
    );
  }
} 
