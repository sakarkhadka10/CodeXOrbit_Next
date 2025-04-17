import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export interface Post {
  id: string;
  title: string;
  shortDescription: string;
  author: string;
  date: string;
  coverImage: string;
  slug: string;
  category: string;
  content: string;
}

// This would typically come from your database
export const posts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    shortDescription: "Learn how to build modern web applications with Next.js",
    author: "John Doe",
    date: "2024-03-15",
    coverImage: "/img/frontendbg.png",
    slug: "getting-started-with-nextjs",
    category: "Web Development",
    content: `
      <h2>Introduction to Next.js</h2>
      <p>Next.js is a React framework that enables server-side rendering and static site generation for React-based web applications. It's designed to make building full-stack web applications simple and efficient.</p>
      
      <h5>Key Features</h5>
      <ul>
        <li>Server-side rendering</li>
        <li>Static site generation</li>
        <li>API routes</li>
        <li>File-based routing</li>
        <li>Built-in CSS and Sass support</li>
        <li>Fast refresh</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>To create a new Next.js project, you can use the following command:</p>
      <pre><code>// JavaScript Example
const a = 5;
const b = 5;
let sum = a + b;
console.log(sum);

// Function example
function calculateSum(x, y) {
  return x + y;
}</code></pre>

      <p>Here's a TypeScript example:</p>
      <pre><code>interface Calculator {
  add(x: number, y: number): number;
}

class SimpleCalculator implements Calculator {
  add(x: number, y: number): number {
    return x + y;
  }
}</code></pre>
      
      <p>And here's a Python example:</p>
      <pre><code>def calculate_sum(a: int, b: int) -> int:
    return a + b

# Example usage
result = calculate_sum(5, 5)
print(f"The sum is: {result}")</code></pre>
      
      <p>This will set up a new Next.js project with all the necessary dependencies and configuration.</p>
      
      <h2>Project Structure</h2>
      <p>A typical Next.js project has the following structure:</p>
      <ul>
        <li><code>pages/</code> - Contains all the pages of your application</li>
        <li><code>public/</code> - Contains static assets like images</li>
        <li><code>styles/</code> - Contains CSS files</li>
        <li><code>components/</code> - Contains React components</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Next.js is a powerful framework for building modern web applications. It provides a great developer experience and excellent performance out of the box.</p>
    `
  },
  {
    id: "2",
    title: "Mastering TypeScript",
    shortDescription: "Deep dive into TypeScript features and best practices",
    author: "Jane Smith",
    date: "2024-03-14",
    coverImage: "/img/frontendbg.png",
    slug: "mastering-typescript",
    category: "Programming",
    content: `
      <h2>What is TypeScript?</h2>
      <p>TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.</p>
      
      <h3>Benefits of TypeScript</h3>
      <ul>
        <li>Static typing</li>
        <li>Better IDE support</li>
        <li>Early error detection</li>
        <li>Enhanced code documentation</li>
        <li>Improved refactoring</li>
      </ul>
      
      <h2>Getting Started with TypeScript</h2>
      <p>To install TypeScript, you can use npm:</p>
      <pre><code>npm install -g typescript</code></pre>
      
      <p>Then, you can create a TypeScript configuration file:</p>
      <pre><code>tsc --init</code></pre>
      
      <h2>TypeScript Features</h2>
      <p>TypeScript adds several features to JavaScript:</p>
      <ul>
        <li>Interfaces</li>
        <li>Generics</li>
        <li>Enums</li>
        <li>Type assertions</li>
        <li>Union and intersection types</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>TypeScript is a powerful language that can help you write more maintainable and scalable JavaScript applications.</p>
    `
  },
  {
    id: "3",
    title: "CSS Grid and Flexbox Mastery",
    coverImage: "/img/frontendbg.png",
    shortDescription: "Master modern CSS layouts.",
    author: "CodeX Orbit",
    date: "Jan 10, 2025",
    category: "css",
    slug: "css-layout-mastery",
    content: `
      <h2>CSS Grid and Flexbox</h2>
      <p>Learn how to create modern, responsive layouts using CSS Grid and Flexbox.</p>
      
      <h3>Key Concepts</h3>
      <ul>
        <li>Grid container and items</li>
        <li>Flex container and items</li>
        <li>Alignment and spacing</li>
        <li>Responsive design</li>
      </ul>
    `
  },
  {
    id: "4",
    title: "Web Performance Optimization",
    coverImage: "/img/frontendbg.png",
    shortDescription: "Optimize your web apps for speed.",
    author: "CodeX Orbit",
    date: "Jan 25, 2025",
    category: "performance",
    slug: "web-performance",
    content: `
      <h2>Web Performance</h2>
      <p>Learn how to optimize your web applications for better performance.</p>
      
      <h3>Optimization Techniques</h3>
      <ul>
        <li>Code splitting</li>
        <li>Lazy loading</li>
        <li>Image optimization</li>
        <li>Caching strategies</li>
      </ul>
    `
  },
  {
    id: "5",
    title: "Modern JavaScript Best Practices",
    coverImage: "/img/frontendbg.png",
    shortDescription: "Write clean and efficient JavaScript code.",
    author: "CodeX Orbit",
    date: "Feb 05, 2025",
    category: "javascript",
    slug: "js-best-practices",
    content: `
      <h2>JavaScript Best Practices</h2>
      <p>Learn modern JavaScript best practices for writing clean and maintainable code.</p>
      
      <h3>Topics Covered</h3>
      <ul>
        <li>ES6+ features</li>
        <li>Code organization</li>
        <li>Error handling</li>
        <li>Testing strategies</li>
      </ul>
    `
  },
  {
    id: "6",
    title: "Frontend Testing Strategies",
    coverImage: "/img/frontendbg.png",
    shortDescription: "Comprehensive guide to testing frontend applications.",
    author: "CodeX Orbit",
    date: "Feb 20, 2025",
    category: "testing",
    slug: "frontend-testing",
    content: `
      <h2>Frontend Testing</h2>
      <p>Learn how to effectively test your frontend applications.</p>
      
      <h3>Testing Approaches</h3>
      <ul>
        <li>Unit testing</li>
        <li>Component testing</li>
        <li>Integration testing</li>
        <li>E2E testing</li>
      </ul>
    `
  },
  {
    id: "7",
    title: "State Management with Redux Toolkit",
    coverImage: "/img/frontendbg.png",
    shortDescription: "Master modern state management in React.",
    author: "CodeX Orbit",
    date: "Mar 05, 2025",
    category: "react",
    slug: "redux-toolkit-guide",
    content: `
      <h2>Redux Toolkit</h2>
      <p>Learn how to manage state in React applications using Redux Toolkit.</p>
      
      <h3>Key Concepts</h3>
      <ul>
        <li>Store setup</li>
        <li>Actions and reducers</li>
        <li>Middleware</li>
        <li>Async operations</li>
      </ul>
    `
  },
  {
    id: "8",
    title: "Building Responsive Web Design",
    coverImage: "/img/frontendbg.png",
    shortDescription: "Create websites that work on any device.",
    author: "CodeX Orbit",
    date: "Mar 20, 2025",
    category: "css",
    slug: "responsive-web-design",
    content: `
      <h2>Responsive Web Design</h2>
      <p>Learn how to create responsive websites that work well on all devices.</p>
      
      <h3>Topics Covered</h3>
      <ul>
        <li>Media queries</li>
        <li>Flexible layouts</li>
        <li>Responsive images</li>
        <li>Mobile-first approach</li>
      </ul>
    `
  },
  {
    id: "9",
    title: "Complete Guide to React.js Development",
    coverImage: "/img/frontendbg.png",
    shortDescription: "Master modern React development with hooks and best practices.",
    author: "CodeX Orbit",
    date: "Nov 15, 2024",
    category: "react",
    slug: "complete-react-guide",
    content: `
      <h2>React.js Development</h2>
      <p>Master modern React development with hooks and best practices.</p>
      
      <h3>Topics Covered</h3>
      <ul>
        <li>React Hooks</li>
        <li>Component patterns</li>
        <li>State management</li>
        <li>Performance optimization</li>
      </ul>
    `
  },
  {
    id: "10",
    title: "Building Scalable APIs with Node.js",
    coverImage: "/img/frontendbg.png",
    shortDescription: "Learn to create robust backend services.",
    author: "CodeX Orbit",
    date: "Nov 25, 2024",
    category: "backend",
    slug: "scalable-nodejs-apis",
    content: `
      <h2>Node.js API Development</h2>
      <p>Learn how to build scalable and maintainable APIs with Node.js.</p>
      
      <h3>Key Concepts</h3>
      <ul>
        <li>RESTful API design</li>
        <li>Authentication & authorization</li>
        <li>Database integration</li>
        <li>API documentation</li>
      </ul>
    `
  },
  {
    id: "11",
    title: "TypeScript for JavaScript Developers",
    coverImage: "/img/frontendbg.png",
    shortDescription: "Enhance your JS projects with static typing.",
    author: "CodeX Orbit",
    date: "Dec 05, 2024",
    category: "typescript",
    slug: "typescript-essentials",
    content: `
      <h2>TypeScript Essentials</h2>
      <p>Learn how to enhance your JavaScript projects with TypeScript.</p>
      
      <h3>Topics Covered</h3>
      <ul>
        <li>Type system basics</li>
        <li>Interfaces and types</li>
        <li>Generics</li>
        <li>Advanced types</li>
      </ul>
    `
  },
  {
    id: "12",
    title: "Next.js 14 Full Stack Development",
    coverImage: "/img/frontendbg.png",
    shortDescription: "Build modern web applications with Next.js.",
    author: "CodeX Orbit",
    date: "Dec 20, 2024",
    category: "nextjs",
    slug: "nextjs-full-stack",
    content: `
      <h2>Next.js Full Stack Development</h2>
      <p>Learn how to build modern full-stack applications with Next.js 14.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>App Router</li>
        <li>Server Components</li>
        <li>API Routes</li>
        <li>Data fetching</li>
      </ul>
    `
  },
  {
    id: "13",
    title: "Building Responsive Web Design",
    coverImage: "/img/frontendbg.png",
    shortDescription: "Create websites that work on any device.",
    author: "CodeX Orbit",
    date: "Mar 20, 2025",
    category: "css",
    slug: "responsive-web-design",
    content: `
      <h2>Responsive Web Design</h2>
      <p>Learn how to create responsive websites that work well on all devices.</p>
      
      <h3>Topics Covered</h3>
      <ul>
        <li>Media queries</li>
        <li>Flexible layouts</li>
        <li>Responsive images</li>
        <li>Mobile-first approach</li>
      </ul>
    `
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get("q")?.toLowerCase() || "";
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    // Ensure posts is an array
    if (!Array.isArray(posts)) {
      throw new Error("Posts data is not in the expected format");
    }

    // Filter posts based on search term and category
    const filteredPosts = posts.filter((post) => {
      const matchesSearch =
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm) ||
        post.shortDescription.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm);

      const matchesCategory = !category || post.category === category;

      return matchesSearch && matchesCategory;
    });

    // Calculate pagination
    const totalCount = filteredPosts.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // Get unique categories with counts
    const categoryMap = posts.reduce((acc: Record<string, number>, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count,
    }));

    return NextResponse.json({
      posts: paginatedPosts,
      categories,
      totalCount,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error processing posts:", error);
    return NextResponse.json(
      { error: "Failed to process posts" },
      { status: 500 }
    );
  }
} 
