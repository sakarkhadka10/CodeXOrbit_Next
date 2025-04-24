import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Function to generate posts sitemap
async function generatePostsSitemap() {
  try {
    console.log('Generating posts sitemap...');
    
    // Get all blog posts
    const posts = await prisma.blog.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    console.log(`Found ${posts.length} published blog posts for sitemap`);
    
    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
    
    // Add each post to the sitemap
    for (const post of posts) {
      const lastmod = (post.updatedAt || post.createdAt).toISOString();
      xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
    
    // Close the XML
    xml += `
</urlset>`;
    
    // Write to file
    const outputDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(outputDir, 'sitemap-posts.xml'), xml);
    console.log('Successfully generated posts sitemap XML');
    
    return true;
  } catch (error) {
    console.error('Error generating posts sitemap:', error);
    return false;
  }
}

// Function to generate categories sitemap
async function generateCategoriesSitemap() {
  try {
    console.log('Generating categories sitemap...');
    
    // Get all categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        name: true,
        updatedAt: true,
        createdAt: true,
      },
    });
    
    console.log(`Found ${categories.length} categories for sitemap`);
    
    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
    
    // Add each category to the sitemap
    for (const category of categories) {
      const lastmod = (category.updatedAt || category.createdAt || new Date()).toISOString();
      xml += `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
    
    // Close the XML
    xml += `
</urlset>`;
    
    // Write to file
    const outputDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(outputDir, 'sitemap-categories.xml'), xml);
    console.log('Successfully generated categories sitemap XML');
    
    return true;
  } catch (error) {
    console.error('Error generating categories sitemap:', error);
    return false;
  }
}

// Function to generate tags sitemap
async function generateTagsSitemap() {
  try {
    console.log('Generating tags sitemap...');
    
    // Get all posts with tags
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
    
    // Extract tags from posts
    const tags = new Set<string>();
    
    // Process tags from posts
    posts.forEach(post => {
      if (post.tags && typeof post.tags === 'string') {
        const postTags = post.tags.split(',').map(tag => tag.trim());
        postTags.forEach(tag => {
          if (tag && tag.trim() !== '') {
            tags.add(tag.trim());
          }
        });
      }
    });
    
    console.log(`Found ${tags.size} unique tags for sitemap`);
    
    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
    const currentDate = new Date().toISOString();
    
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
    
    // Write to file
    const outputDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(outputDir, 'sitemap-tags.xml'), xml);
    console.log('Successfully generated tags sitemap XML');
    
    return true;
  } catch (error) {
    console.error('Error generating tags sitemap:', error);
    return false;
  }
}

// Function to generate sitemap index
async function generateSitemapIndex() {
  try {
    console.log('Generating sitemap index...');
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
    const date = new Date().toISOString();
    
    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-posts.xml</loc>
    <lastmod>${date}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${date}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${date}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-tags.xml</loc>
    <lastmod>${date}</lastmod>
  </sitemap>
</sitemapindex>`;
    
    // Write to file
    const outputDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(outputDir, 'sitemap-index.xml'), xml);
    console.log('Successfully generated sitemap index XML');
    
    return true;
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check for API key or other authentication if needed
    const apiKey = req.headers.get('x-api-key');
    const secretKey = process.env.SITEMAP_API_KEY || 'your-secret-key';
    
    if (apiKey !== secretKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Generate all sitemaps
    const postsResult = await generatePostsSitemap();
    const categoriesResult = await generateCategoriesSitemap();
    const tagsResult = await generateTagsSitemap();
    const indexResult = await generateSitemapIndex();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Sitemaps regenerated successfully',
      results: {
        posts: postsResult,
        categories: categoriesResult,
        tags: tagsResult,
        index: indexResult,
      },
    });
  } catch (error) {
    console.error('Error regenerating sitemaps:', error);
    
    // Return error response
    return NextResponse.json(
      { success: false, message: 'Error regenerating sitemaps' },
      { status: 500 }
    );
  }
}

// Also support POST requests for webhook integration
export async function POST(req: NextRequest) {
  return GET(req);
}
