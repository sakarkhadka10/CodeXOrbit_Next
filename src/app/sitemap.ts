import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

// Interface for blog posts
interface BlogPost {
  id: string | number;
  slug: string;
  title: string;
  createdAt: Date;
  updatedAt?: Date;
  published: boolean;
}

// Interface for categories
interface Category {
  id?: string | number;
  slug: string;
  name: string;
  updatedAt?: Date;
}

// Function to get all blog posts from database
async function getAllPostsFromDB(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blog.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts from database for sitemap:', error);
    return [];
  }
}

// Function to get all categories from database
async function getAllCategoriesFromDB(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        updatedAt: true,
      },
    });

    return categories;
  } catch (error) {
    console.error('Error fetching categories from database for sitemap:', error);
    return [];
  }
}

// Fallback function to get all blog posts from JSON file
async function getAllPostsFromFile() {
  try {
    const dataDirectory = path.join(process.cwd(), 'data');
    const postsFile = path.join(dataDirectory, 'posts.json');

    if (fs.existsSync(postsFile)) {
      const fileContents = fs.readFileSync(postsFile, 'utf8');
      const posts = JSON.parse(fileContents);
      return posts;
    }

    return [];
  } catch (error) {
    console.error('Error fetching posts from file for sitemap:', error);
    return [];
  }
}

// Fallback function to get all categories from JSON file
async function getAllCategoriesFromFile() {
  try {
    const dataDirectory = path.join(process.cwd(), 'data');
    const categoriesFile = path.join(dataDirectory, 'categories.json');

    if (fs.existsSync(categoriesFile)) {
      const fileContents = fs.readFileSync(categoriesFile, 'utf8');
      const categories = JSON.parse(fileContents);
      return categories;
    }

    return [];
  } catch (error) {
    console.error('Error fetching categories from file for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';

  // Static routes
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ] as MetadataRoute.Sitemap;

  try {
    // Try to get posts from database first
    let posts = await getAllPostsFromDB();

    // If no posts from database, try to get from file
    if (posts.length === 0) {
      posts = await getAllPostsFromFile();
    }

    // Add blog posts to sitemap
    const postRoutes = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly',
      priority: 0.9,
    })) as MetadataRoute.Sitemap;

    // Try to get categories from database first
    let categories = await getAllCategoriesFromDB();

    // If no categories from database, try to get from file
    if (categories.length === 0) {
      categories = await getAllCategoriesFromFile();
    }

    // Add categories to sitemap
    const categoryRoutes = categories.map((category: any) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })) as MetadataRoute.Sitemap;

    // Add tag pages if they exist
    const tagRoutes = [] as MetadataRoute.Sitemap;

    // Try to get tags from posts
    const tags = new Set<string>();
    posts.forEach((post: any) => {
      if (post.tags) {
        const postTags = typeof post.tags === 'string'
          ? post.tags.split(',').map((tag: string) => tag.trim())
          : post.tags;

        postTags.forEach((tag: string) => {
          if (tag) tags.add(tag);
        });
      }
    });

    // Add tag routes
    tags.forEach(tag => {
      tagRoutes.push({
        url: `${baseUrl}/tag/${encodeURIComponent(tag.toLowerCase())}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });

    return [...routes, ...postRoutes, ...categoryRoutes, ...tagRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static routes if there's an error
    return routes;
  }
}
