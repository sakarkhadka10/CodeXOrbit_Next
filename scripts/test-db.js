// Test script to check if there are blog posts in the database
const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking for blog posts in the database...');
    
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
    
    console.log(`Found ${posts.length} published blog posts:`);
    console.log(JSON.stringify(posts, null, 2));
    
    // Get all categories
    const categories = await prisma.category.findMany();
    console.log(`Found ${categories.length} categories:`);
    console.log(JSON.stringify(categories, null, 2));
    
    // Check if posts.json exists
    const fs = require('fs');
    const path = require('path');
    const dataDirectory = path.join(process.cwd(), 'data');
    const postsFile = path.join(dataDirectory, 'posts.json');
    
    if (fs.existsSync(postsFile)) {
      const fileContents = fs.readFileSync(postsFile, 'utf8');
      const filePosts = JSON.parse(fileContents);
      console.log(`Found ${filePosts.length} posts in posts.json file`);
    } else {
      console.log('posts.json file does not exist');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
