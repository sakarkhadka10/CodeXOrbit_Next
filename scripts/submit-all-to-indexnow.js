const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();
const fetch = require("node-fetch");
require("dotenv").config({ path: ".env.local" });

// Import the notifyIndexNow function from our utility library
// We need to use a different approach in Node.js scripts
const path = require("path");
const fs = require("fs");

// Function to notify search engines about URL changes
async function notifyIndexNow(urls) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.INDEXNOW_API_KEY;

    if (!apiKey) {
      console.error("IndexNow API key not found in environment variables");
      return false;
    }

    // Get the site URL from environment variables
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://codexorbit.com";

    // IndexNow API endpoints
    const INDEXNOW_ENDPOINTS = [
      "https://www.bing.com/indexnow",
      "https://api.indexnow.org/indexnow",
      "https://www.yandex.com/indexnow",
    ];

    // Ensure URLs are absolute
    const absoluteUrls = urls.map((url) =>
      url.startsWith("http")
        ? url
        : `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}`
    );

    // Prepare the request body
    const body = {
      host: new URL(siteUrl).hostname,
      key: apiKey,
      keyLocation: `${siteUrl}/${apiKey}.txt`,
      urlList: absoluteUrls,
    };

    console.log(`Notifying IndexNow with ${absoluteUrls.length} URLs`);

    // Send requests to all IndexNow endpoints
    const results = await Promise.all(
      INDEXNOW_ENDPOINTS.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          const responseText = await response.text();

          return {
            endpoint,
            success: response.ok,
            status: response.status,
            response: responseText,
          };
        } catch (error) {
          console.error(`Error notifying ${endpoint}:`, error);
          return {
            endpoint,
            success: false,
            error: error.message,
          };
        }
      })
    );

    // Log the results
    const successCount = results.filter((result) => result.success).length;
    console.log(
      `Successfully notified ${successCount}/${INDEXNOW_ENDPOINTS.length} search engines`
    );

    // Return true if at least one notification was successful
    return results.some((result) => result.success);
  } catch (error) {
    console.error("Error in notifyIndexNow:", error);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log("Gathering URLs to submit to IndexNow...");

    // Get all blog posts
    const posts = await prisma.blog.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
      },
    });

    console.log(`Found ${posts.length} published blog posts`);

    // Get all categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
      },
    });

    console.log(`Found ${categories.length} categories`);

    // Prepare URLs
    const postUrls = posts.map((post) => `/blog/${post.slug}`);
    const categoryUrls = categories.map(
      (category) => `/category/${category.slug}`
    );

    // Add static pages
    const staticUrls = ["/", "/blog", "/about", "/contact"];

    // Combine all URLs
    const allUrls = [...staticUrls, ...postUrls, ...categoryUrls];

    console.log(`Submitting ${allUrls.length} URLs to IndexNow...`);

    // Submit URLs in batches of 10,000 (IndexNow limit)
    const batchSize = 10000;
    for (let i = 0; i < allUrls.length; i += batchSize) {
      const batch = allUrls.slice(i, i + batchSize);
      console.log(
        `Submitting batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(
          allUrls.length / batchSize
        )} (${batch.length} URLs)...`
      );

      const success = await notifyIndexNow(batch);

      if (success) {
        console.log(
          `Successfully submitted batch ${
            Math.floor(i / batchSize) + 1
          } to IndexNow`
        );
      } else {
        console.error(
          `Failed to submit batch ${Math.floor(i / batchSize) + 1} to IndexNow`
        );
      }
    }

    console.log("Finished submitting URLs to IndexNow");
  } catch (error) {
    console.error("Error submitting URLs to IndexNow:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the main function
main();
