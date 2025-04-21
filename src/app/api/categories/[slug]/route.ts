import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

// GET /api/categories/:slug - Get a specific category
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Ensure params is awaited
    const slug = params.slug;

    const category = await prisma.category.findUnique({
      where: { slug }
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/:slug - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Ensure params is awaited
    const slug = params.slug;

    const data = await request.json();

    // If slug is being changed, check if the new slug already exists
    if (data.slug !== slug) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: data.slug }
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 400 }
        );
      }

      // Update all blog posts that reference this category
      await prisma.blog.updateMany({
        where: { categoryId: slug },
        data: { categoryId: data.slug }
      });
    }

    const category = await prisma.category.update({
      where: { slug },
      data: {
        name: data.name,
        slug: data.slug
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/:slug - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Ensure params is awaited
    const slug = params.slug;

    await prisma.category.delete({
      where: { slug }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
