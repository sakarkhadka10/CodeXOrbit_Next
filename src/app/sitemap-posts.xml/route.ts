import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Function to get all blog posts from database
async function getAllPostsFromDB() {
  try {
    console.log('Fetching blog posts from database for sitemap...');
    const posts = await prisma.blog.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Found ${posts.length} published blog posts for sitemap`);
    return posts;
  } catch (error) {
    console.error('Error fetching posts from database for sitemap:', error);
    console.error(error);
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

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
  console.log(`Generating posts sitemap with base URL: ${baseUrl}`);

  try {
    // Try to get posts from database first
    console.log('Attempting to fetch posts from database...');
    let posts = await getAllPostsFromDB();

    // If no posts from database, try to get from file
    if (posts.length === 0) {
      console.log('No posts found in database, trying to fetch from file...');
      posts = await getAllPostsFromFile();
    }

    console.log(`Total posts found for sitemap: ${posts.length}`);

    // Start building the XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add each post to the sitemap
    for (const post of posts) {
      try {
        // Ensure we have valid dates
        const updatedAt = post.updatedAt instanceof Date ? post.updatedAt : new Date(post.updatedAt || Date.now());
        const createdAt = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt || Date.now());
        const lastmod = (updatedAt || createdAt).toISOString();

        xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

        console.log(`Added post to sitemap: ${post.title || post.slug}`);
      } catch (postError) {
        console.error(`Error processing post ${post.id || post.slug}:`, postError);
        // Continue with the next post
      }
    }

    // Close the XML
    xml += `
</urlset>`;

    console.log('Successfully generated posts sitemap XML');

    // Return the XML with the correct content type
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        // Disable caching completely to ensure always fresh content
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error generating posts sitemap:', error);

    // Return an empty sitemap in case of error
    return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Error occurred while generating sitemap -->
</urlset>`, {
      headers: {
        'Content-Type': 'application/xml',
        // No caching for error responses
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      status: 500,
    });
  }
}
