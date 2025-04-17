"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaSearch } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  coverImage: string;
  slug: string;
  category: string;
}

interface Category {
  name: string;
  count: number;
}

export default function BlogPosts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([{ name: "All", count: 0 }]);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [totalPosts, setTotalPosts] = useState(0);

  // Get query params
  const searchTerm = searchParams.get("q") || "";
  const activeCategory = searchParams.get("category") || "All";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const postsPerPage = 6;

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Use the query parameters in the API call for server-side filtering
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.set("q", searchTerm);
      if (activeCategory !== "All") queryParams.set("category", activeCategory);
      queryParams.set("page", currentPage.toString());
      queryParams.set("limit", postsPerPage.toString());
      
      const response = await fetch(`/api/posts?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure posts is an array
      if (Array.isArray(data.posts)) {
        setPosts(data.posts);
        setTotalPosts(data.totalCount || 0);
      } else {
        console.error("Posts data is not in the expected format:", data);
        setPosts([]);
        setTotalPosts(0);
      }
      
      // Set categories from the API response
      if (Array.isArray(data.categories)) {
        setCategories([
          { name: "All", count: data.totalCount || 0 },
          ...data.categories
        ]);
      } else {
        setCategories([{ name: "All", count: 0 }]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setTotalPosts(0);
      setCategories([{ name: "All", count: 0 }]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeCategory, currentPage, postsPerPage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.delete("page"); // Reset to page 1
    router.push(`/blog?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/blog?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (searchInput.trim()) {
      params.set("q", searchInput.trim());
    } else {
      params.delete("q");
    }
    
    params.delete("page"); // Reset to page 1
    router.push(`/blog?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchInput("");
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="md:w-1/4 lg:w-1/5">
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Search</h3>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full py-2.5 px-4 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500"
              >
                <FaSearch />
              </button>
            </div>
            {searchTerm && (
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Results for: <span className="font-medium text-amber-600">{searchTerm}</span>
                </span>
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="text-xs text-amber-600 hover:text-amber-700"
                >
                  Clear
                </button>
              </div>
            )}
          </form>

          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                  category.name === activeCategory
                    ? "bg-amber-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{category.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  category.name === activeCategory
                    ? "bg-white text-amber-600"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:w-3/4 lg:w-4/5">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              No posts found
            </h1>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            {/* Regular Posts */}
            <section>
              <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="w-10 h-1 bg-amber-500 mr-3"></span>
                {searchTerm ? "Search Results" : activeCategory === "All" ? "All Articles" : activeCategory}
                <span className="ml-3 text-sm font-normal text-gray-500">({totalPosts} posts)</span>
              </h1>
              <div className="grid grid-cols-1 gap-8">
                {posts.map((post) => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    className="group"
                  >
                    <div className="flex flex-col md:flex-row group bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                      <div className="relative h-64 md:w-2/5 overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 40vw"
                         className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <span className="inline-block px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full mb-4">
                          {post.category}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-5 line-clamp-3 text-base">
                          {post.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <span className="flex items-center mr-4">
                            <FaUser className="mr-1.5 text-amber-500" />
                            {post.author}
                          </span>
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1.5 text-amber-500" />
                            {post.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Pagination */}
            {totalPosts > postsPerPage && (
              <div className="flex justify-center mt-12">
                <nav
                  className="inline-flex rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.ceil(totalPosts / postsPerPage) }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 cursor-pointer py-2 text-sm font-medium border ${
                          currentPage === page
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(totalPosts / postsPerPage)}
                    className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

