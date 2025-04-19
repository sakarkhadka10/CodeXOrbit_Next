'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaSave, FaCode } from 'react-icons/fa'
import Script from 'next/script'

export default function CreateBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [categories, setCategories] = useState([]) // Add categories state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    author: '',
    shortDescription: '', // Changed from excerpt
    category: '', // Added category
    tags: '',
    coverImage: '', // Added coverImage
    published: false,
  })
  const [editorLoaded, setEditorLoaded] = useState(false)

  // Add this useEffect to fetch categories
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

  // Initialize Summernote with optimizations when scripts are loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && editorLoaded && editorRef.current) {
      // @ts-ignore - jQuery and Summernote are loaded via script tags
      if (window.jQuery && window.jQuery.summernote) {
        // @ts-ignore
        const $ = window.jQuery
        
        // Add custom button for code blocks
        $.summernote.options.buttons.codeBlock = function(context) {
          return $.summernote.ui.button({
            contents: '<i class="fa fa-code"></i>',
            tooltip: 'Insert Code Block',
            click: function() {
              // Create a single code block with placeholder text
              const codeBlock = '<pre><code>// Your code here</code></pre>';
              
              // Insert the code block
              context.invoke('editor.pasteHTML', codeBlock);
              
              // Position cursor inside the code block
              const range = document.createRange();
              const selection = window.getSelection();
              const preElements = context.layoutInfo.editable.find('pre code');
              
              if (preElements.length) {
                // Get the last code element
                const lastElement = preElements[preElements.length - 1];
                
                // Select all placeholder text so user can immediately type over it
                range.selectNodeContents(lastElement);
                selection?.removeAllRanges();
                selection?.addRange(range);
                
                // Focus the editor
                context.invoke('editor.focus');
              }
            }
          }).render();
        }

        // Add this function to handle Enter key in code blocks
        function setupCodeBlockEnterHandling($editor) {
          $editor.parent().on('keydown', function(e) {
            // Find if cursor is inside a code block
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;
            
            const range = selection.getRangeAt(0);
            let node = range.startContainer;
            
            // If it's a text node, get its parent
            if (node.nodeType === 3) {
              node = node.parentNode;
            }
            
            // Check if we're inside a code block
            let insideCodeBlock = false;
            let preElement = null;
            
            while (node && !insideCodeBlock) {
              if (node.nodeName === 'CODE' && node.parentNode?.nodeName === 'PRE') {
                insideCodeBlock = true;
                preElement = node.parentNode;
                break;
              }
              node = node.parentNode;
            }
            
            // Handle Enter key inside code blocks
            if (insideCodeBlock && e.keyCode === 13) {
              e.preventDefault();
              
              // Create a paragraph element for normal text
              const p = document.createElement('p');
              p.innerHTML = '<br>';
              
              // Insert it after the code block
              if (preElement && preElement.parentNode) {
                preElement.parentNode.insertBefore(p, preElement.nextSibling);
                
                // Move cursor to the new paragraph
                const newRange = document.createRange();
                newRange.setStart(p, 0);
                newRange.collapse(true);
                
                selection.removeAllRanges();
                selection.addRange(newRange);
                
                // Focus on the editor
                $editor.focus();
              }
              
              return false;
            }
          });
        }

        // Initialize editor with optimizations
        const $editor = $(editorRef.current)
        $editor.summernote({
          height: 500,
          focus: true,
          fontNames: [
            'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 
            'Helvetica', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 
            'Roboto', 'Merriweather', 'Fira Code', 'JetBrains Mono'
          ],
          fontNamesIgnoreCheck: ['Roboto', 'Merriweather', 'Fira Code', 'JetBrains Mono'],
          toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear', 'fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['custom', ['codeBlock']],
            ['view', ['fullscreen', 'codeview', 'help']],
          ],
          callbacks: {
            onChange: function(contents: string) {
              setFormData(prev => ({ ...prev, content: contents }))
            },
            onInit: function() {
              // Add custom styles for the editor
              $('head').append(`
                <style>
                  .note-editor {
                    border-radius: 0.375rem;
                    border-color: rgb(209, 213, 219) !important;
                  }
                  .note-editor.note-frame .note-editing-area .note-editable {
                    font-family: 'Roboto', sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #374151;
                  }
                  .note-editor pre {
                    background-color: #1e1e1e;
                    color: #e9e9e9;
                    border-radius: 0.375rem;
                    padding: 1rem;
                    font-family: 'Fira Code', 'JetBrains Mono', monospace;
                  }
                  .note-editor pre code {
                    font-family: 'Fira Code', 'JetBrains Mono', monospace;
                    font-size: 14px;
                    line-height: 1.5;
                    white-space: pre;
                    display: block;
                  }
                </style>
              `);
              
              // Setup code block enter handling
              setupCodeBlockEnterHandling($editor);
            }
          },
          codemirror: { // CodeMirror options for code view
            theme: 'monokai',
            lineNumbers: true,
            lineWrapping: true,
            tabSize: 2
          }
        })
        
        // Set initial content if any
        if (formData.content) {
          $editor.summernote('code', formData.content)
        }
        
        // Cleanup function
        return () => {
          $editor.summernote('destroy')
        }
      }
    }
  }, [editorLoaded, editorRef])

  // Add custom fonts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap',
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap'
      ]
      
      fontLinks.forEach(href => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        document.head.appendChild(link)
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Log the data being sent
      const postData = {
        title: formData.title,
        content: formData.content,
        slug: formData.slug,
        author: formData.author,
        excerpt: formData.shortDescription, // Map shortDescription to excerpt in API
        tags: formData.tags,
        // Only include categoryId if it's not empty
        ...(formData.category ? { categoryId: formData.category } : {})
      };
      console.log('Sending post data:', postData);
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`Server responded with ${response.status}: ${JSON.stringify(errorData)}`);
      }
      
      const result = await response.json();
      console.log('Post created successfully:', result);
      router.push('/admin');
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('Failed to create post. See console for details.');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
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
    <>
      {/* Load required scripts */}
      <Script 
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.js"
        strategy="afterInteractive"
        onLoad={() => setEditorLoaded(true)}
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"
        strategy="afterInteractive"
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/htmlmixed/htmlmixed.min.js"
        strategy="afterInteractive"
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/xml/xml.min.js"
        strategy="afterInteractive"
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js"
        strategy="afterInteractive"
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/css/css.min.js"
        strategy="afterInteractive"
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css"
        strategy="afterInteractive"
      />
      
      {/* Load required CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      <link 
        href="https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.css" 
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css"
        rel="stylesheet"
      />
      
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center">
            <Link 
              href="/admin" 
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Blog Post</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={() => !formData.slug && generateSlug()}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Generate from title
                    </button>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description <span className="text-xs text-gray-500">(max 100 characters)</span>
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  maxLength={100}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.shortDescription.length}/100 characters
                </p>
              </div>
              
              {/* Optimized Summernote Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <div ref={editorRef} className="summernote"></div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FaCode className="mr-2" />
                  <span>Use the code block button in the toolbar to add syntax-highlighted code snippets</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.coverImage && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={formData.coverImage} 
                      alt="Cover preview" 
                      className="h-32 object-cover rounded-md border border-gray-200"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        const target = e.currentTarget;
                        target.src = "/img/placeholder.png";
                        target.classList.add("border-red-500");
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-xs text-gray-500">
                    Can't find your category?
                  </span>
                  <div className="flex space-x-3">
                    <button 
                      type="button"
                      onClick={() => setShowCategoryModal(true)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Add New
                    </button>
                    <Link 
                      href="/admin/categories"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Manage Categories
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                  Publish immediately
                </label>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : (
                    <>
                      <FaSave className="mr-2" />
                      Create Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

























