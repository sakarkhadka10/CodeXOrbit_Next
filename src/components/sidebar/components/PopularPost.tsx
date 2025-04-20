"use client";
import React, { useState, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  shortDescription: string;
  author: string;
  date: string;
  coverImage: string;
  slug: string;
  category: string;
}

const PopularPost = memo(() => {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await fetch("/api/popular-posts", {
          next: { revalidate: 3600 },
        });
        const data = await response.json();
        setPopularPosts(data.slice(0, 4)); // Limit to 4 posts upfront
      } catch (error) {
        console.error("Error fetching popular posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white px-5 py-6 rounded-xl shadow-sm animate-pulse">
        <div className="h-7 bg-gray-200 rounded mb-5 w-2/3"></div>
        <div className="space-y-5">
          <div className="h-40 bg-gray-200 rounded-xl"></div>
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-20 h-16 bg-gray-200 rounded-md"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (!popularPosts.length) return null;

  return (
    <div className="bg-white px-2 sm:px-4 md:px-5 py-4 sm:py-6 rounded-xl shadow-sm">
      <header className="mb-3 sm:mb-5">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">
          Popular Articles
        </h1>
      </header>
      <main className="space-y-3 sm:space-y-5">
        {/* Featured Post */}
        {popularPosts[0] && (
          <Link href={`/blog/${popularPosts[0].slug}`} className="block">
            <div
              className="relative h-40 rounded-xl overflow-hidden bg-gray-900 shadow-md hover:shadow-lg transition-shadow bg-cover bg-center"
              style={{ backgroundImage: `url(${popularPosts[0].coverImage})` }}
            >
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-full">
                {popularPosts[0].category}
              </span>
            </div>
          </Link>
        )}

        {/* Other Posts */}
        {popularPosts.slice(1).map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="block">
            <div className="flex gap-4 group">
              <div className="w-20 h-16 rounded-md overflow-hidden relative flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="80px" // Optimize for small thumbnail
                  className="object-cover"
                  priority={false} // Load lazily unless critical
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{post.date}</p>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
});

// Add display name for better debugging
PopularPost.displayName = "PopularPost";

export default PopularPost;
