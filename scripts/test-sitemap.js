// Test script to generate sitemaps
const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

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
    
    const baseUrl = 'https://codexorbit.com';
    
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
      
      console.log(`Added post to sitemap: ${post.title}`);
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
    
    return xml;
  } catch (error) {
    console.error('Error generating posts sitemap:', error);
  }
}

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
    
    const baseUrl = 'https://codexorbit.com';
    
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
      
      console.log(`Added category to sitemap: ${category.name}`);
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
    
    return xml;
  } catch (error) {
    console.error('Error generating categories sitemap:', error);
  }
}

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
    const tags = new Set();
    
    // Add some hardcoded tags for testing
    const hardcodedTags = ['javascript', 'react', 'nextjs', 'typescript', 'tailwindcss'];
    hardcodedTags.forEach(tag => tags.add(tag));
    
    // Process tags from posts
    posts.forEach(post => {
      if (post.tags) {
        console.log(`Processing tags for post: ${post.id}, Tags type: ${typeof post.tags}`);
        
        try {
          if (typeof post.tags === 'string') {
            // If tags is a string, split by comma
            const postTags = post.tags.split(',').map(tag => tag.trim());
            postTags.forEach(tag => {
              if (tag && tag.trim() !== '') {
                tags.add(tag.trim());
              }
            });
          }
        } catch (tagError) {
          console.error(`Error processing tags for post ${post.id}:`, tagError);
        }
      }
    });
    
    console.log(`Found ${tags.size} unique tags for sitemap`);
    
    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    const baseUrl = 'https://codexorbit.com';
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
    
    return xml;
  } catch (error) {
    console.error('Error generating tags sitemap:', error);
  }
}

async function generateSitemapIndex() {
  try {
    console.log('Generating sitemap index...');
    
    const baseUrl = 'https://codexorbit.com';
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
    
    return xml;
  } catch (error) {
    console.error('Error generating sitemap index:', error);
  }
}

async function generatePagesSitemap() {
  try {
    console.log('Generating pages sitemap...');
    
    const baseUrl = 'https://codexorbit.com';
    const currentDate = new Date().toISOString();
    
    // Define static pages
    const staticPages = [
      {
        url: `${baseUrl}`,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.7,
      },
    ];
    
    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Add each page to the sitemap
    for (const page of staticPages) {
      xml += `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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
    
    fs.writeFileSync(path.join(outputDir, 'sitemap-pages.xml'), xml);
    console.log('Successfully generated pages sitemap XML');
    
    return xml;
  } catch (error) {
    console.error('Error generating pages sitemap:', error);
  }
}

async function main() {
  try {
    await generatePostsSitemap();
    await generateCategoriesSitemap();
    await generateTagsSitemap();
    await generatePagesSitemap();
    await generateSitemapIndex();
    
    console.log('All sitemaps generated successfully!');
  } catch (error) {
    console.error('Error generating sitemaps:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
