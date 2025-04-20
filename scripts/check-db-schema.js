const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check Category table structure
    console.log('Checking Category table structure...');
    const categoryColumns = await prisma.$queryRaw`SHOW COLUMNS FROM Category`;
    console.log('Category columns:', categoryColumns);
    
    // Check Blog table structure
    console.log('\nChecking Blog table structure...');
    const blogColumns = await prisma.$queryRaw`SHOW COLUMNS FROM Blog`;
    console.log('Blog columns:', blogColumns);
    
    // Check if there are any categories
    console.log('\nChecking existing categories...');
    const categories = await prisma.category.findMany();
    console.log('Categories:', categories);
    
    // Check if there are any blogs with categories
    console.log('\nChecking blogs with categories...');
    const blogsWithCategories = await prisma.blog.findMany({
      where: {
        categoryId: {
          not: null
        }
      },
      select: {
        id: true,
        title: true,
        categoryId: true
      }
    });
    console.log('Blogs with categories:', blogsWithCategories);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
