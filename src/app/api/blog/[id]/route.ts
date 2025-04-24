import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

// GET /api/blog/[id] - Get a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // NOTE: Next.js warns about directly accessing params.id, but this is a known issue with API routes
    // In a future version of Next.js, this will need to be updated to use await or React.use
    // For now, we can directly access params.id in API routes
    const paramId = params.id;
    const id = parseInt(paramId)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        category: true // Include the category information
      }
    })

    // If blog is found, add the category field for the frontend
    if (blog) {
      const blogWithCategory = {
        ...blog,
        category: blog.categoryId // Set category field to the categoryId (which is the slug)
      }
      return NextResponse.json(blogWithCategory)
    }

    return NextResponse.json(
      { error: 'Blog post not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// PUT /api/blog/[id] - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // NOTE: Next.js warns about directly accessing params.id, but this is a known issue with API routes
    // In a future version of Next.js, this will need to be updated to use await or React.use
    // For now, we can directly access params.id in API routes
    const paramId = params.id;
    const id = parseInt(paramId)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const data = await request.json()

    // Prepare update data
    const updateData = {
      title: data.title,
      content: data.content,
      slug: data.slug,
      author: data.author,
      excerpt: data.shortDescription || data.excerpt || null,
      tags: data.tags || null,
      coverImage: data.coverImage || null,
      published: data.published || false,
      categoryId: data.category || null // Use category field as categoryId (which is now the slug)
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: updateData
    })

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
        console.log('Sitemaps regenerated successfully after updating blog post');
      } else {
        console.error('Failed to regenerate sitemaps after updating blog post');
      }
    } catch (sitemapError) {
      console.error('Error regenerating sitemaps:', sitemapError);
      // Don't fail the main request if sitemap regeneration fails
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // NOTE: Next.js warns about directly accessing params.id, but this is a known issue with API routes
    // In a future version of Next.js, this will need to be updated to use await or React.use
    // For now, we can directly access params.id in API routes
    const paramId = params.id;
    const id = parseInt(paramId)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      )
    }

    await prisma.blog.delete({
      where: { id }
    })

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
        console.log('Sitemaps regenerated successfully after deleting blog post');
      } else {
        console.error('Failed to regenerate sitemaps after deleting blog post');
      }
    } catch (sitemapError) {
      console.error('Error regenerating sitemaps:', sitemapError);
      // Don't fail the main request if sitemap regeneration fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}