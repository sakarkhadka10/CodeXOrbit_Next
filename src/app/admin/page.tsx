'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaEye, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { FaList } from 'react-icons/fa6'
import { useAuth } from '@/contexts/AuthContext'

// Define Blog type
interface Blog {
  id: number;
  title: string;
  slug: string;
  author: string;
  published: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter()
  const { user, loading: authLoading, logout } = useAuth()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [blogsLoading, setBlogsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    // Check if user is authenticated before fetching blogs
    if (user) {
      fetchBlogs()
    } else if (!authLoading) {
      // If not authenticated and not loading, redirect to login
      console.log('Admin page: User not authenticated, redirecting to login')
      router.push('/login')
    }
  }, [user, authLoading, router])

  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true)
      const response = await fetch('/api/blog', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        }
      })
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setBlogsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error deleting blog post:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const filteredBlogs: Blog[] = activeTab === 'all'
    ? blogs
    : activeTab === 'published'
      ? blogs.filter((blog: Blog) => blog.published)
      : blogs.filter((blog: Blog) => !blog.published)

  // If auth context is still loading, show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated after loading is complete, redirect to login
  if (!user) {
    // We'll handle this in the useEffect, just show a loading state
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // If user is not an admin, show unauthorized message
  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 mt-15">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <FaUser className="mr-2" />
              <span>Logged in as: {user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="ml-4 text-red-600 hover:text-red-800 flex items-center"
              >
                <FaSignOutAlt className="mr-1" />
                Logout
              </button>
            </div>
          </div>
          <div className='flex gap-5'>
            <Link href="/admin/categories"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <FaList/> Manage Category
            </Link>
            <Link
              href="/admin/create"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus /> New Post
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['all', 'published', 'drafts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {blogsLoading ? (
            <div className="p-10 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading blog posts...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-600">No blog posts found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                        <div className="text-sm text-gray-500">{blog.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          blog.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/blog/${blog.slug}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            target="_blank"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            href={`/admin/edit/${blog.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
