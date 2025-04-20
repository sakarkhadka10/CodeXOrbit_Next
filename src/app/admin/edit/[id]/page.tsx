'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { FaArrowLeft, FaSave } from 'react-icons/fa'

// Define jQuery for TypeScript
declare global {
  interface Window {
    jQuery: any;
    $: any;
  }
}

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editorLoaded, setEditorLoaded] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    author: '',
    shortDescription: '',
    category: '',
    tags: '',
    published: false,
  })
  const [categories, setCategories] = useState<any[]>([])

  // Fetch blog post data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setFormData({
            title: data.title || '',
            content: data.content || '',
            slug: data.slug || '',
            author: data.author || '',
            shortDescription: data.shortDescription || '',
            category: data.category || '',
            tags: data.tags || '',
            published: data.published || false,
          })
        }
      } catch (error) {
        console.error('Error fetching blog:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [params.id])

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

  // Load Summernote CSS
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css'
    document.head.appendChild(link)

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  // Initialize Summernote editor
  useEffect(() => {
    if (typeof window !== 'undefined' && editorLoaded && editorRef.current && !loading) {
      const $ = window.jQuery
      
      if ($ && $.summernote) {
        $(editorRef.current).summernote({
          height: 500,
          placeholder: 'Write your content here...',
          styleTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],
          fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Geist', 'Geist Mono'],
          fontNamesIgnoreCheck: ['Geist', 'Geist Mono'],
          callbacks: {
            onChange: function(contents: string) {
              setFormData(prev => ({
                ...prev,
                content: contents
              }))
            },
            onInit: function() {
              // Set initial content
              $(editorRef.current).summernote('code', formData.content)
            }
          },
          // Enhanced code block button
          buttons: {
            codeblock: function(context: any) {
              const ui = $.summernote.ui;
              const button = ui.button({
                contents: '<i class="fa fa-code"></i>',
                tooltip: 'Insert Code Block',
                click: function() {
                  // Create a better styled code block with language selection
                  const codeBlock = `
                    <div class="code-block-container">
                      <div class="flex justify-between items-center bg-[#1e1e1e] px-4 py-2 rounded-t-lg border-b border-gray-700">
                        <div class="flex gap-2 items-center">
                          <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                          <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                          <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                        </div>
                        <div class="text-xs text-gray-400 font-mono uppercase">javascript</div>
                      </div>
                      <pre><code>// Your code here</code></pre>
                    </div>
                  `;
                  context.invoke('editor.pasteHTML', codeBlock);
                }
              });
              return button.render();
            }
          },
          // Enhanced toolbar with better organization
          toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear', 'strikethrough', 'superscript', 'subscript']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video', 'codeblock']],
            ['view', ['fullscreen', 'codeview', 'help']]
          ]
        });
        
        // Apply custom styling to match site theme
        $('.note-toolbar').addClass('bg-gray-50 border-b border-amber-200');
        $('.note-btn').addClass('hover:bg-amber-50 hover:text-amber-600');
        $('.note-editable').addClass('font-geist-sans text-gray-800');
      }
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.jQuery && editorRef.current) {
        try {
          window.jQuery(editorRef.current).summernote('destroy')
        } catch (e) {
          console.error('Error destroying Summernote:', e)
        }
      }
    }
  }, [editorLoaded, loading, formData.content])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
    } finally {
      setSaving(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
    
    setFormData(prev => ({
      ...prev,
      slug
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/admin" className="text-blue-500 hover:text-blue-700 flex items-center">
          <FaArrowLeft className="mr-2" />
          Back to Admin
        </Link>
        <h1 className="text-2xl font-bold ml-auto">Edit Blog Post</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
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
            
            <div className="flex gap-2">
              <div className="flex-grow">
                <label htmlFor="slug" className="block mb-1 font-medium">
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={generateSlug}
                  className="p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Generate Slug
                </button>
              </div>
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
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="shortDescription" className="block mb-1 font-medium">
                Short Description
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Content
              </label>
              <div ref={editorRef} className="border border-gray-300 rounded"></div>
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
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
      
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
        onLoad={() => console.log('jQuery loaded')}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"
        strategy="afterInteractive"
        onLoad={() => setEditorLoaded(true)}
      />
    </div>
  )
}


