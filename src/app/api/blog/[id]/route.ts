import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

// GET /api/blog/[id] - Get a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is awaited
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
    // Ensure params is awaited
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
    // Ensure params is awaited
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}