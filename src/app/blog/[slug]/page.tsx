import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaTag, FaShare, FaHome, FaBookmark, FaHeart } from "react-icons/fa";
import { Metadata } from "next";
import SideBar from "@/components/sidebar/SideBar";
import CodeBlock from "@/components/CodeBlock";
import { posts } from "@/data/posts";
import { prisma } from "@/lib/prisma"; // Import the singleton prisma instance

// Define Post type for TypeScript
type Post = {
  id: string;
  title: string;
  shortDescription: string;
  author: string;
  date: string;
  coverImage: string;
  slug: string;
  category: string;
  content: string;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    // Fetch from database
    const post = await prisma.blog.findUnique({
      where: { slug: params.slug }
    });
    
    if (post) {
      return {
        title: `${post.title} | CodeX Orbit Blog`,
        description: post.excerpt || '',
        openGraph: {
          title: post.title,
          description: post.excerpt || '',
          type: "article",
          authors: [post.author],
          publishedTime: post.createdAt.toString(),
        },
      };
    }
    
    // Fallback to local data if needed
    const localPost = posts.find((post) => post.slug === params.slug);
    if (localPost) {
      return {
        title: `${localPost.title} | CodeX Orbit Blog`,
        description: localPost.shortDescription,
        openGraph: {
          title: localPost.title,
          description: localPost.shortDescription,
          type: "article",
          authors: [localPost.author],
          publishedTime: localPost.date,
        },
      };
    }
    
    return {
      title: "Post Not Found | CodeX Orbit Blog",
      description: "The requested blog post could not be found.",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | CodeX Orbit Blog",
      description: "An error occurred while loading this blog post.",
    };
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  try {
    // Try to fetch from database first
    const dbPost = await prisma.blog.findUnique({
      where: { slug: params.slug }
    });
    
    if (dbPost) {
      // Transform database post to match expected format
      const post = {
        id: dbPost.id.toString(),
        title: dbPost.title,
        shortDescription: dbPost.excerpt || '',
        author: dbPost.author,
        date: dbPost.createdAt.toISOString(),
        coverImage: "/img/frontendbg.png", // Default image
        slug: dbPost.slug,
        category: dbPost.tags || 'Uncategorized',
        content: dbPost.content
      };
      
      return renderPost(post);
    }
    
    // If not found in database, try to fetch from API or local data
    let post: Post | undefined;
    
    // Try to fetch from API first
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/api/posts/${params.slug}`);
        if (response.ok) {
          post = await response.json();
        }
      } catch (error) {
        console.error("Error fetching post from API:", error);
      }
    }
    
    // Fallback to local data if API fetch failed
    if (!post) {
      post = posts.find((p) => p.slug === params.slug);
    }
    
    if (!post) {
      notFound();
    }
    
    // Render the post
    return renderPost(post);
  } catch (error) {
    console.error("Error rendering blog post:", error);
    notFound();
  }
}

// Helper function to render post to avoid code duplication
function renderPost(post: Post) {
  return (
    <div className="min-h-screen bg-[#f8fafc] mt-20">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-amber-600 transition-colors flex items-center">
            <FaHome className="mr-1" />
            <span>Home</span>
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-amber-600 transition-colors">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-amber-600 font-medium truncate max-w-[200px]">{post.title}</span>
        </nav>
      </div>

      {/* Main Content Grid - Content + Sidebar */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Article Content - 9 columns on desktop */}
          <div className="lg:col-span-9">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-[40vh] sm:h-[50vh] w-full">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-cover"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJXIDTjwAAAABJRU5ErkJggg=="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              </div>
              
              {/* Title Card - Overlapping the image */}
              <div className="px-4 sm:px-8 -mt-24 relative z-10">
                <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
                  {/* Category Badge */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="inline-block px-4 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-full shadow-sm">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                  </h1>
                  
                  {/* Author and Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center mr-3 shadow-md">
                        <FaUser className="text-white" />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-900">{post.author}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-full bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 transition-all duration-300">
                        <FaBookmark />
                      </button>
                      <button className="p-2 rounded-full bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 transition-all duration-300">
                        <FaHeart />
                      </button>
                      <button className="p-2 rounded-full bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 transition-all duration-300">
                        <FaShare />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Article Content */}
              <div className="p-6 sm:p-8 md:p-10">
                <CodeBlock content={post.content} />
              </div>
              
              {/* Article Footer */}
              <div className="px-6 sm:px-8 pb-8">
                <div className="bg-gray-50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <FaTag className="text-amber-500 mr-2" />
                    <Link 
                      href={`/blog?category=${post.category}`}
                      className="text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      {post.category}
                    </Link>
                  </div>
                  <Link 
                    href="/blog" 
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md shadow-amber-500/20 flex items-center"
                  >
                    More Articles
                  </Link>
                </div>
              </div>
            </article>
            
            {/* Ad Space Below Article - Optimized for AdSense */}
            <div className="mt-6 w-full h-[250px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p>Advertisement Space</p>
                <p className="text-xs">AdSense Banner (728×90 or Responsive)</p>
              </div>
            </div>
          </div>
          
          {/* Sidebar - 3 columns on desktop */}
          <div className="lg:col-span-3 space-y-6">
            {/* Ad Space Top - Optimized for AdSense */}
            <div className="w-full h-[250px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p>Advertisement Space</p>
                <p className="text-xs">AdSense (300×250)</p>
              </div>
            </div>
            
            {/* Sidebar Components */}
            <SideBar />
            
            {/* Ad Space Bottom - Optimized for AdSense */}
            <div className="w-full h-[600px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p>Advertisement Space</p>
                <p className="text-xs">AdSense (300×600)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
