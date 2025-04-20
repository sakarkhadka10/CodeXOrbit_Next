const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Updating blog category references...');
    
    // Get all blogs with categories
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
    
    console.log(`Found ${blogsWithCategories.length} blogs with category references`);
    
    // Get all categories
    const categories = await prisma.category.findMany();
    console.log(`Found ${categories.length} categories`);
    
    // Create a map of category slugs
    const categoryMap = {};
    for (const category of categories) {
      categoryMap[category.slug] = category.slug;
    }
    
    // Update each blog to use the category slug
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const blog of blogsWithCategories) {
      try {
        // Check if the categoryId is already a valid slug
        if (categoryMap[blog.categoryId]) {
          console.log(`Blog ${blog.id} already has a valid category slug: ${blog.categoryId}`);
          continue;
        }
        
        // If not, we need to set it to null as we can't map the old IDs
        await prisma.blog.update({
          where: { id: blog.id },
          data: { categoryId: null }
        });
        
        console.log(`Updated blog ${blog.id} (${blog.title}) - removed invalid category reference`);
        updatedCount++;
      } catch (error) {
        console.error(`Error updating blog ${blog.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\nUpdate complete: ${updatedCount} blogs updated, ${errorCount} errors`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
