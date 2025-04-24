import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Function to get all categories from database
async function getAllCategoriesFromDB() {
  try {
    console.log('Fetching categories from database for sitemap...');
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        name: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    console.log(`Found ${categories.length} categories for sitemap`);
    return categories;
  } catch (error) {
    console.error('Error fetching categories from database for sitemap:', error);
    console.error(error);
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

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com';
  console.log(`Generating categories sitemap with base URL: ${baseUrl}`);

  try {
    // Try to get categories from database first
    console.log('Attempting to fetch categories from database...');
    let categories = await getAllCategoriesFromDB();

    // If no categories from database, try to get from file
    if (categories.length === 0) {
      console.log('No categories found in database, trying to fetch from file...');
      categories = await getAllCategoriesFromFile();
    }

    console.log(`Total categories found for sitemap: ${categories.length}`);

    // Start building the XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add each category to the sitemap
    for (const category of categories) {
      try {
        // Ensure we have valid dates
        const updatedAt = category.updatedAt instanceof Date ? category.updatedAt : new Date(category.updatedAt || Date.now());
        const createdAt = category.createdAt instanceof Date ? category.createdAt : new Date(category.createdAt || Date.now());
        const lastmod = (updatedAt || createdAt).toISOString();

        xml += `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;

        console.log(`Added category to sitemap: ${category.name || category.slug}`);
      } catch (categoryError) {
        console.error(`Error processing category ${category.slug}:`, categoryError);
        // Continue with the next category
      }
    }

    // Close the XML
    xml += `
</urlset>`;

    console.log('Successfully generated categories sitemap XML');

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
    console.error('Error generating categories sitemap:', error);

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
