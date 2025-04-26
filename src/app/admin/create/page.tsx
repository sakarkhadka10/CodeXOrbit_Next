'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import ImagePreview from '@/components/ImagePreview'
import dynamic from 'next/dynamic'

// Import SummernoteEditor with dynamic import to avoid SSR issues
const SummernoteEditor = dynamic(() => import('@/components/SummernoteEditor'), {
  ssr: false,
  loading: () => <div className="border border-gray-300 rounded p-4 min-h-[300px]">Loading editor...</div>
})

// Define proper types for your form data
interface FormData {
  title: string;
  slug: string;
  author: string;
  shortDescription: string;
  content: string;
  tags: string;
  coverImage: string;
  category: string;
  published: boolean;
}

// Define Category type
interface Category {
  slug: string;
  name: string;
}

export default function CreateBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    slug: '',
    author: '',
    shortDescription: '',
    category: '',
    tags: '',
    coverImage: '',
    published: false,
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  // No special initialization needed - using SummernoteEditor component

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create a modified version of formData with categoryId instead of category
      const postData = {
        ...formData,
        categoryId: formData.category, // Map category to categoryId for the API
        shortDescription: formData.shortDescription // Map shortDescription to excerpt
      };

      console.log('Sending post data:', postData);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        router.push('/admin')
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')

      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }, [formData.title])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6 mt-22">
        <Link href="/admin" className="text-blue-500 hover:text-blue-700 flex items-center">
          <FaArrowLeft className="mr-2" />
          Back to Posts
        </Link>
        <h1 className="text-2xl font-bold ml-auto">Create New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 border border-gray-200 rounded">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block mb-1 font-medium">
              Slug (auto-generated from title)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="author" className="block mb-1 font-medium">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="category" className="block mb-1 font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="shortDescription" className="block mb-1 font-medium">
              Short Description <span className="text-xs text-gray-500">(Max 100 characters)</span>
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => {
                // Limit to 100 characters
                if (e.target.value.length <= 100) {
                  handleChange(e);
                }
              }}
              maxLength={100}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${formData.shortDescription.length >= 90 ? 'text-amber-600' : 'text-gray-500'}`}>
                {formData.shortDescription.length}/100
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">
              Content
            </label>
            <div>
              <SummernoteEditor
                value={formData.content}
                onChange={(content: string) => setFormData(prev => ({ ...prev, content }))}
                height={500}
                placeholder="Write your content here..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="coverImage" className="block mb-1 font-medium">
              Cover Image URL
            </label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formData.coverImage && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <ImagePreview
                  src={formData.coverImage}
                  alt="Cover preview"
                  onImageError={(defaultImage) => {
                    setFormData(prev => ({
                      ...prev,
                      coverImage: defaultImage
                    }));
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="tags" className="block mb-1 font-medium">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="published">
              Publish immediately
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
          >
            {loading ? 'Saving...' : (
              <>
                <FaSave className="mr-2" />
                Save Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
