const fs = require('fs');
const path = require('path');

// Define paths
const sourceDir = path.join(__dirname, '../.next/static/sitemaps');
const targetDir = path.join(__dirname, '../public');

// Create the target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Function to copy a file
function copyFile(source, target) {
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, target);
      console.log(`Copied ${source} to ${target}`);
    } else {
      console.log(`Source file ${source} does not exist`);
    }
  } catch (error) {
    console.error(`Error copying ${source} to ${target}:`, error);
  }
}

// Copy the sitemap.xml file if it exists (fallback)
copyFile(
  path.join(sourceDir, 'sitemap.xml'),
  path.join(targetDir, 'sitemap.xml')
);

// Create placeholder files for our custom sitemaps
// These will be served dynamically by our API routes
const placeholderContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- This file is a placeholder. The actual sitemap is generated dynamically. -->
</urlset>`;

const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- This file is a placeholder. The actual sitemap index is generated dynamically. -->
</sitemapindex>`;

// Write placeholder files
function writePlaceholder(filename, content) {
  try {
    fs.writeFileSync(path.join(targetDir, filename), content);
    console.log(`Created placeholder ${filename}`);
  } catch (error) {
    console.error(`Error creating placeholder ${filename}:`, error);
  }
}

// Create placeholder files for our custom sitemaps
writePlaceholder('sitemap-index.xml', sitemapIndexContent);
writePlaceholder('sitemap-posts.xml', placeholderContent);
writePlaceholder('sitemap-categories.xml', placeholderContent);
writePlaceholder('sitemap-pages.xml', placeholderContent);
writePlaceholder('sitemap-tags.xml', placeholderContent);

console.log('Sitemap files processing completed');
