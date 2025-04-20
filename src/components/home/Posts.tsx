"use client";
import React, { useState, useEffect, memo } from "react";
import BlogPostCard from "../ui/BlogPostCard";
import { FaArrowDown } from "react-icons/fa6";

interface Post {
  id: number;
  title: string;
  shortDescription: string;
  author: string;
  date: string;
  coverImage: string;
  slug: string;
  category: string;
  tags?: string;
}

const Posts = memo(() => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 6;

  const fetchPosts = async (page: number) => {
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=${postsPerPage}`);
      const data = await response.json();

      if (data && Array.isArray(data.posts)) {
        if (page === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prevPosts => [...prevPosts, ...data.posts]);
        }
        setHasMore(data.hasMore);
        setTotalPosts(data.totalCount);
      } else {
        console.error("Invalid posts data format:", data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchPosts(nextPage);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white rounded-2xl animate-pulse p-4">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/3">
                    <div className="aspect-[16/8] w-80 h-60 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="md:w-2/3 space-y-4 w-full">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-1 sm:px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <BlogPostCard key={post.id} {...post} />
        ))}
      </div>

      {hasMore && (
        <div className="flex flex-col items-center mt-8 space-y-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={`flex items-center gap-2 text-white px-6 py-2 bg-[#fe9a1e] rounded-lg font-medium text-lg transition-all duration-300 ${
              loadingMore
                ? 'opacity-75 cursor-not-allowed'
                : 'hover:bg-amber-500 hover:scale-105'
            }`}
          >
            {loadingMore ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                Load More

                <FaArrowDown className="ml-2" />
              </>
            )}
          </button>
          <p className="text-sm text-gray-500">
            Showing {posts.length} of {totalPosts} posts
          </p>
        </div>
      )}
    </div>
  );
});

Posts.displayName = "Posts";

export default Posts;
