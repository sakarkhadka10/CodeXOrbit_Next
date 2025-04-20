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
          category && category !== 'All' ?
            { category: { name: category } } :
            {}
        ],
        published: true
      },
      include: {
        category: true // Include the related category
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Transform database posts to match expected format
    const transformedPosts = dbPosts.map(post => ({
      id: post.id.toString(),
      title: post.title,
      shortDescription: (post.excerpt || '').length > 100 ? (post.excerpt || '').substring(0, 100) + '...' : (post.excerpt || ''),
      author: post.author,
      date: post.createdAt.toISOString(),
      coverImage: post.coverImage || "/img/frontendbg.png", // Use post image or default
      slug: post.slug,
      category: post.category ? post.category.name : (post.tags || 'Uncategorized'),
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
          category && category !== 'All' ?
            { category: { name: category } } :
            {}
        ],
        published: true
      }
    });

    // Get categories from database
    const dbCategories = await prisma.category.findMany();

    // Count posts per category
    const categoryCounts = await Promise.all(
      dbCategories.map(async (category) => {
        const count = await prisma.blog.count({
          where: {
            categoryId: category.slug,
            published: true
          }
        });
        return {
          name: category.name,
          count
        };
      })
    );

    // Sort categories by name
    const categories = categoryCounts.sort((a, b) => a.name.localeCompare(b.name));

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

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received post data:', data);

    // Ensure required fields are present
    if (!data.title || !data.content || !data.slug) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, or slug' },
        { status: 400 }
      );
    }

    // Prepare data object without categoryId first
    const createData = {
      title: data.title,
      content: data.content,
      slug: data.slug,
      author: data.author || 'Anonymous',
      excerpt: data.shortDescription || data.excerpt || '',
      tags: data.tags || '',
      coverImage: data.coverImage || null,
      published: Boolean(data.published)
    };

    console.log('Processing data with:', {
      shortDescription: data.shortDescription,
      excerpt: data.excerpt,
      categoryId: data.categoryId
    });

    // Only add categoryId if it exists and is not empty
    if (data.categoryId && data.categoryId.trim() !== '') {
      // Check if the category exists
      const category = await prisma.category.findUnique({
        where: { slug: data.categoryId }
      });

      if (category) {
        createData.categoryId = data.categoryId;
      } else {
        console.log(`Category with ID ${data.categoryId} not found, creating post without category`);
      }
    }

    // Create the blog post
    const blog = await prisma.blog.create({
      data: createData
    });

    console.log('Created blog post:', blog);
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);

    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blog post', details: error.message },
      { status: 500 }
    );
  }
}
