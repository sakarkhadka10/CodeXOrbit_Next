'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import Script from 'next/script'

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
  id: string;
  name: string;
}

// Define Summernote context interface
interface SummernoteContext {
  invoke: (command: string, html: string) => void;
}

// Add global type declarations for jQuery and Summernote
declare global {
  interface Window {
    jQuery: any;
    $: any;
  }
}

export default function CreateBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editorLoaded, setEditorLoaded] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
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

  // Load Summernote CSS with default styling
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

  // Add custom styles for code blocks in the admin create page
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .admin-code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #1e1e1e;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid #333;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
      }

      .admin-code-dots {
        display: flex;
        gap: 0.5rem;
      }

      .admin-code-dot {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 9999px;
      }

      .admin-code-dot-red { background-color: #ff5f56; }
      .admin-code-dot-yellow { background-color: #ffbd2e; }
      .admin-code-dot-green { background-color: #27c93f; }

      .admin-code-language {
        font-size: 0.75rem;
        color: #9ca3af;
        font-family: monospace;
        text-transform: uppercase;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Initialize Summernote editor with improved configuration
  useEffect(() => {
    if (typeof window !== 'undefined' && editorLoaded && editorRef.current) {
      const $ = window.jQuery

      if ($ && $.summernote) {
        // Add a global event listener for Escape key in code blocks
        $(document).on('keydown', '.note-editable pre', function(this: HTMLElement, e: KeyboardEvent) {
          if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();

            const codeBlockContainer = $(this).closest('.code-block-container')[0];
            if (codeBlockContainer) {
              // If there's no next sibling, create a paragraph
              if (!codeBlockContainer.nextSibling) {
                const p = document.createElement('p');
                p.innerHTML = '<br>';
                codeBlockContainer.parentNode?.insertBefore(p, codeBlockContainer.nextSibling);
              }

              // Set cursor after the code block
              const range = document.createRange();
              const sel = window.getSelection();
              range.setStartAfter(codeBlockContainer);
              range.collapse(true);
              sel?.removeAllRanges();
              sel?.addRange(range);
            }
            return false;
          }
        });

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
            onKeydown: function(e: KeyboardEvent) {
              const isCodeBlock = $(e.target).closest('pre').length > 0;

              if (isCodeBlock && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();

                // Move cursor outside the code block
                const range = document.createRange();
                const sel = window.getSelection();
                const preElement = $(e.target).closest('pre')[0];
                const codeBlockContainer = $(preElement).closest('.code-block-container')[0];

                if (codeBlockContainer) {
                  // If there's no next sibling, create a paragraph
                  if (!codeBlockContainer.nextSibling) {
                    const p = document.createElement('p');
                    p.innerHTML = '<br>';
                    codeBlockContainer.parentNode?.insertBefore(p, codeBlockContainer.nextSibling);
                  }

                  // Set cursor after the code block
                  range.setStartAfter(codeBlockContainer);
                  range.collapse(true);
                  sel?.removeAllRanges();
                  sel?.addRange(range);
                }
                return false;
              }
            }
          },
          // Enhanced code block button
          buttons: {
            codeblock: function(context: SummernoteContext) {
              const ui = $.summernote.ui;
              const button = ui.button({
                contents: '<i class="fa fa-code" style="font-size: 1.2em;"></i>',
                tooltip: 'Insert Code Block',
                className: 'note-btn-codeblock',
                click: function() {
                  // Create a code block with macOS-style header
                  const codeBlock = `
                    <div class="code-block-container">
                      <div class="admin-code-header">
                        <div class="admin-code-dots">
                          <div class="admin-code-dot admin-code-dot-red"></div>
                          <div class="admin-code-dot admin-code-dot-yellow"></div>
                          <div class="admin-code-dot admin-code-dot-green"></div>
                        </div>
                        <div class="flex items-center">
                          <div class="admin-code-language">javascript</div>
                        </div>
                      </div>
                      <pre><code>// Your code here</code></pre>
                    </div>
                  `;
                  context.invoke('editor.pasteHTML', codeBlock);

                  // Focus inside the code block
                  setTimeout(() => {
                    const codeElements = document.querySelectorAll('.note-editable pre code');
                    if (codeElements.length > 0) {
                      const lastCodeElement = codeElements[codeElements.length - 1];
                      const range = document.createRange();
                      const sel = window.getSelection();
                      range.setStart(lastCodeElement, 0);
                      range.collapse(true);
                      sel?.removeAllRanges();
                      sel?.addRange(range);
                    }
                  }, 0);
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

    // Store a reference to the current editor element for cleanup
    const currentEditorRef = editorRef.current;

    return () => {
      if (typeof window !== 'undefined' && window.jQuery) {
        try {
          // Remove the global event listeners
          window.jQuery(document).off('keydown', '.note-editable pre');

          // Use the stored reference
          if (currentEditorRef) {
            window.jQuery(currentEditorRef).summernote('destroy');
          }
        } catch (e) {
          console.error('Error destroying Summernote:', e);
        }
      }
    }
  }, [editorLoaded])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')

      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }, [formData.title, formData.slug])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/admin/posts" className="text-blue-500 hover:text-blue-700 flex items-center">
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















