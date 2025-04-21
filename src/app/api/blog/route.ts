import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

// GET /api/blog - Get all blog posts
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true // Include the category information
      }
    })

    // Transform the blogs to include category as a field
    const transformedBlogs = blogs.map(blog => ({
      ...blog,
      category: blog.categoryId // Set category field to the categoryId (which is the slug)
    }))

    return NextResponse.json(transformedBlogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        content: data.content,
        slug: data.slug,
        author: data.author,
        excerpt: data.excerpt || null,
        tags: data.tags || null,
        published: data.published || false,
        categoryId: data.category || null // Use category field as categoryId (which is the slug)
      },
      include: {
        category: true // Include the category information
      }
    })

    // Add category field for consistency with the frontend
    const blogWithCategory = {
      ...blog,
      category: blog.categoryId // Set category field to the categoryId (which is the slug)
    }

    return NextResponse.json(blogWithCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}