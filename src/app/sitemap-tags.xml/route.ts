import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Function to get all blog posts from database to extract tags
async function getAllPostsFromDB() {
  try {
    console.log('Fetching posts from database for tags sitemap...');
    const posts = await prisma.blog.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        tags: true,
      },
    });

    console.log(`Found ${posts.length} posts for tags sitemap`);

    // Debug the tags structure
    posts.forEach(post => {
      console.log(`Post ID: ${post.id}, Title: ${post.title}, Tags: ${JSON.stringify(post.tags)}`);
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts from database for tags sitemap:', error);
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
    console.error('Error fetching posts from file for tags sitemap:', error);
    return [];
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
  const currentDate = new Date().toISOString();
  console.log(`Generating tags sitemap with base URL: ${baseUrl}`);

  try {
    // Try to get posts from database first
    console.log('Attempting to fetch posts from database for tags...');
    let posts = await getAllPostsFromDB();

    // If no posts from database, try to get from file
    if (posts.length === 0) {
      console.log('No posts found in database, trying to fetch from file...');
      posts = await getAllPostsFromFile();
    }

    console.log(`Processing ${posts.length} posts to extract tags`);

    // Extract tags from posts
    const tags = new Set<string>();

    // Add some hardcoded tags for testing if needed
    // This ensures we have at least some tags in the sitemap
    const hardcodedTags = ['javascript', 'react', 'nextjs', 'typescript', 'tailwindcss'];
    hardcodedTags.forEach(tag => tags.add(tag));

    // Process tags from posts
    posts.forEach(post => {
      if (post.tags) {
        console.log(`Processing tags for post: ${post.id || 'unknown'}, Tags type: ${typeof post.tags}`);

        try {
          let postTags: string[] = [];

          if (typeof post.tags === 'string') {
            // If tags is a string, split by comma
            postTags = post.tags.split(',').map(tag => tag.trim());
            console.log(`Split string tags into: ${postTags.join(', ')}`);
          } else if (Array.isArray(post.tags)) {
            // If tags is already an array
            postTags = post.tags;
            console.log(`Using array tags: ${postTags.join(', ')}`);
          } else if (post.tags && typeof post.tags === 'object') {
            // If tags is an object (like from a JSON structure)
            postTags = Object.values(post.tags).filter(tag => typeof tag === 'string');
            console.log(`Extracted object tags: ${postTags.join(', ')}`);
          }

          // Add valid tags to the set
          postTags.forEach(tag => {
            if (tag && typeof tag === 'string' && tag.trim() !== '') {
              tags.add(tag.trim());
              console.log(`Added tag: ${tag.trim()}`);
            }
          });
        } catch (tagError) {
          console.error(`Error processing tags for post ${post.id || 'unknown'}:`, tagError);
        }
      }
    });

    console.log(`Found ${tags.size} unique tags for sitemap`);

    // Start building the XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add each tag to the sitemap
    for (const tag of tags) {
      xml += `
  <url>
    <loc>${baseUrl}/tag/${encodeURIComponent(tag.toLowerCase())}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }

    // Close the XML
    xml += `
</urlset>`;

    console.log('Successfully generated tags sitemap XML');

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
    console.error('Error generating tags sitemap:', error);

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
