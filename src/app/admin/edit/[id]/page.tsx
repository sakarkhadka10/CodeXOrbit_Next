'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import ImagePreview from '@/components/ImagePreview'

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

  // Add custom styles for code blocks in the admin editor
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Basic code block styling */
      .note-editable pre {
        background-color: #1e1e1e;
        color: #e6e6e6;
        border-radius: 6px;
        padding: 40px 12px 12px 12px; /* Extra padding on top for the header */
        margin: 15px 0;
        position: relative;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.5;
        overflow-x: auto;
      }

      /* Code content */
      .note-editable pre code {
        display: block;
        color: #e6e6e6;
      }

      /* Header bar with Mac-style UI */
      .note-editable pre:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 28px;
        background-color: #2a2a2a;
        border-bottom: 1px solid #444;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }

      /* Red circle */
      .note-editable pre:after {
        content: '';
        position: absolute;
        top: 9px;
        left: 10px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #ff5f56;
        box-shadow: 22px 0 0 #ffbd2e, 44px 0 0 #27c93f; /* Yellow and green circles */
        z-index: 1;
      }

      /* Language indicator */
      .note-editable pre code:before {
        content: 'CODE';
        position: absolute;
        top: 0;
        right: 0;
        padding: 6px 12px;
        font-size: 10px;
        color: #999;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        text-transform: uppercase;
        z-index: 2;
      }

      /* Exit button for code blocks */
      .code-exit-button {
        position: absolute;
        top: 4px;
        right: 60px;
        background-color: #444;
        color: #fff;
        border: none;
        border-radius: 3px;
        padding: 2px 8px;
        font-size: 10px;
        cursor: pointer;
        z-index: 3;
        transition: background-color 0.2s;
      }

      .code-exit-button:hover {
        background-color: #666;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Initialize Summernote editor
  useEffect(() => {
    if (typeof window !== 'undefined' && editorLoaded && editorRef.current && !loading) {
      const $ = window.jQuery

      if ($ && $.summernote) {
        // Function to add exit buttons to all code blocks
        const addExitButtonsToCodeBlocks = () => {
          $('.note-editable pre').each(function(this: HTMLElement) {
            // Check if this pre element already has an exit button
            if ($(this).find('.code-exit-button').length === 0) {
              // Create the exit button
              const exitButton = document.createElement('button');
              exitButton.className = 'code-exit-button';
              exitButton.textContent = 'Exit';
              exitButton.setAttribute('type', 'button');

              // Add the exit button to the pre element
              $(this).append(exitButton);
            }
          });
        };

        // Function to handle exit button click
        const handleExitButtonClick = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          const target = e.target as HTMLElement;
          const preElement = $(target).closest('pre')[0];

          if (preElement) {
            // Create a new paragraph after the pre element
            const newParagraph = document.createElement('p');
            newParagraph.innerHTML = '<br>';

            // Insert the new paragraph after the pre element
            if (preElement.parentNode) {
              preElement.parentNode.insertBefore(newParagraph, preElement.nextSibling);
            }

            // Move cursor to the new paragraph
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(newParagraph, 0);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        };

        // Add a global event listener for exit button clicks
        $(document).on('click', '.code-exit-button', handleExitButtonClick);

        // Create a MutationObserver to watch for new code blocks
        const observer = new MutationObserver(() => {
          // Simply call addExitButtonsToCodeBlocks whenever the DOM changes
          addExitButtonsToCodeBlocks();
        });

        // Initial call to add exit buttons to any existing code blocks
        addExitButtonsToCodeBlocks();

        // Initialize the observer immediately
        const editable = $('.note-editable')[0];
        if (editable) {
          observer.observe(editable, {
            childList: true,
            subtree: true
          });
        }
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
                // Check if cursor is at the end of the code block
                const selection = window.getSelection();
                const range = selection?.getRangeAt(0);
                const preElement = $(e.target).closest('pre')[0];
                const codeElement = $(preElement).find('code')[0];

                // Get text content and cursor position
                const codeText = codeElement.textContent || '';
                const cursorPosition = range?.startOffset || 0;

                // If cursor is at the end of the code block or the code block is empty
                if (cursorPosition >= codeText.length || codeText.trim() === '') {
                  e.preventDefault();

                  // Insert a new paragraph after the pre element
                  const newParagraph = document.createElement('p');
                  newParagraph.innerHTML = '<br>';

                  // Insert the new paragraph after the pre element
                  if (preElement.parentNode) {
                    preElement.parentNode.insertBefore(newParagraph, preElement.nextSibling);
                  }

                  // Move cursor to the new paragraph
                  const newRange = document.createRange();
                  newRange.setStart(newParagraph, 0);
                  newRange.collapse(true);

                  selection?.removeAllRanges();
                  selection?.addRange(newRange);

                  return false;
                }

                // If not at the end, allow normal Enter behavior to add a new line in the code block
              }
            },
            onInit: function() {
              // Set initial content
              $(editorRef.current).summernote('code', formData.content);

              // Initialize exit buttons for any existing code blocks
              addExitButtonsToCodeBlocks();

              // Re-initialize the observer now that the editor is fully loaded
              const editable = $('.note-editable')[0];
              if (editable && observer) {
                observer.observe(editable, {
                  childList: true,
                  subtree: true
                });
              }
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
                  // Create a code block with visual styling in the editor
                  const codeBlock = `<pre><code>// Your code here</code></pre>`;
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

    // Store references for cleanup
    const currentEditorRef = editorRef.current;

    return () => {
      if (typeof window !== 'undefined' && window.jQuery) {
        try {
          // Find and disconnect any mutation observers
          // This is a workaround since we can't directly access the observer variable
          const noteEditable = document.querySelector('.note-editable');
          if (noteEditable) {
            // We can't directly access MutationObservers, so we'll just remove
            // the elements they're observing which effectively stops them
          }

          // Remove the global event listeners
          window.jQuery(document).off('keydown', '.note-editable pre');
          window.jQuery(document).off('click', '.code-exit-button');

          // Use the stored reference
          if (currentEditorRef) {
            window.jQuery(currentEditorRef).summernote('destroy');
          }
        } catch (e) {
          console.error('Error destroying Summernote:', e);
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
              <div ref={editorRef} className="border border-gray-300 rounded"></div>
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


