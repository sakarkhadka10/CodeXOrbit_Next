import { getServerSideSitemap } from 'next-sitemap';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Define types for sitemap entries
type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

export async function GET(req: NextRequest) {
  // Get the base URL from environment or use a default
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';

  try {
    // Fetch all blog posts from the database
    const posts = await prisma.blog.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
        createdAt: true,
        title: true,
        tags: true,
        category: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch all categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
        name: true,
        createdAt: true,
      },
    });

    // Create sitemap entries for blog posts
    const postEntries: SitemapEntry[] = posts.map((post) => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: (post.updatedAt || post.createdAt).toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    }));

    // Create sitemap entries for categories
    const categoryEntries: SitemapEntry[] = categories.map((category) => ({
      loc: `${baseUrl}/category/${category.slug}`,
      lastmod: (category.updatedAt || category.createdAt || new Date()).toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }));

    // Extract and create entries for tags
    const tags = new Set<string>();

    // Collect tags from posts
    posts.forEach(post => {
      if (post.tags) {
        const postTags = typeof post.tags === 'string'
          ? post.tags.split(',').map(tag => tag.trim())
          : post.tags;

        if (Array.isArray(postTags)) {
          postTags.forEach(tag => {
            if (tag) tags.add(tag);
          });
        }
      }
    });

    // Create sitemap entries for tags
    const tagEntries: SitemapEntry[] = Array.from(tags).map(tag => ({
      loc: `${baseUrl}/tag/${encodeURIComponent(tag.toLowerCase())}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.6,
    }));

    // Add author pages if they exist
    const authors = new Set<string>();

    // Collect authors from posts
    posts.forEach(post => {
      if (post.author) {
        authors.add(post.author);
      }
    });

    // Create sitemap entries for authors
    const authorEntries: SitemapEntry[] = Array.from(authors).map(author => ({
      loc: `${baseUrl}/author/${encodeURIComponent(author.toLowerCase().replace(/\s+/g, '-'))}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.6,
    }));

    // Add static pages
    const staticEntries: SitemapEntry[] = [
      {
        loc: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        loc: `${baseUrl}/blog`,
        lastmod: posts.length > 0
          ? (posts[0].updatedAt || posts[0].createdAt).toISOString()
          : new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        loc: `${baseUrl}/about`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8,
      },
      {
        loc: `${baseUrl}/contact`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
      },
    ];

    // Combine all entries
    const allEntries = [
      ...staticEntries,
      ...postEntries,
      ...categoryEntries,
      ...tagEntries,
      ...authorEntries,
    ];

    // Set cache headers
    const response = getServerSideSitemap(allEntries);

    // Add cache control headers
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');

    // Return the sitemap
    return response;
  } catch (error) {
    console.error('Error generating server-side sitemap:', error);

    // Return an empty sitemap in case of error with error status
    const response = NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    );

    return response;
  }
}
