import { NextResponse } from "next/server";
import { posts } from "../route";
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Try to fetch from database first
    const dbPost = await prisma.blog.findUnique({
      where: { slug: params.slug },
      include: { category: true } // Include the related category
    });

    if (dbPost) {
      // Transform to match expected format
      const post = {
        id: dbPost.id.toString(),
        title: dbPost.title,
        shortDescription: (dbPost.excerpt || '').length > 100 ? (dbPost.excerpt || '').substring(0, 100) + '...' : (dbPost.excerpt || ''),
        author: dbPost.author,
        date: dbPost.createdAt.toISOString(),
        coverImage: dbPost.coverImage || "/img/frontendbg.png", // Use post image or default
        slug: dbPost.slug,
        category: dbPost.category ? dbPost.category.name : (dbPost.tags || 'Uncategorized'),
        content: dbPost.content
      };

      return NextResponse.json(post);
    }

    // Fallback to static posts if not found in database
    const post = posts.find((post) => post.slug === params.slug);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
