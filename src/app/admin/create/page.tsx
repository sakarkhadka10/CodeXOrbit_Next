'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

export default function CreateBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    author: '',
    excerpt: '',
    tags: '',
    published: false,
  })

  // Common HTML tags for suggestions
  const commonTags = [
    { tag: 'h2', description: 'Heading 2' },
    { tag: 'h5', description: 'Heading 5' },
    { tag: 'p', description: 'Paragraph' },
    { tag: 'a', description: 'Link' },
    { tag: 'img', description: 'Image' },
    { tag: 'ul', description: 'Unordered List' },
    { tag: 'ol', description: 'Ordered List' },
    { tag: 'li', description: 'List Item' },
    { tag: 'blockquote', description: 'Blockquote' },
    { tag: 'pre', description: 'Preformatted Text' },
    { tag: 'code', description: 'Code' },
    { tag: 'strong', description: 'Bold Text' },
    { tag: 'em', description: 'Italic Text' },
  ]

  // Add these new states and refs
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{tag: string, description: string}>>([])
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 })
  const [currentWord, setCurrentWord] = useState('')
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Handle auto-closing tags
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const { selectionStart, selectionEnd, value } = textarea
    
    // Auto-close tags when typing '<'
    if (e.key === '<') {
      // We'll handle this in the keyup event
      return
    }
    
    // Insert closing tag when typing '>'
    if (e.key === '>') {
      const textBeforeCursor = value.substring(0, selectionStart)
      const lastOpeningTag = textBeforeCursor.lastIndexOf('<')
      
      if (lastOpeningTag !== -1) {
        const tagContent = textBeforeCursor.substring(lastOpeningTag + 1)
        
        // Don't auto-close if it's a closing tag, self-closing tag, or comment
        if (tagContent.startsWith('/') || tagContent.endsWith('/') || tagContent.startsWith('!--')) {
          return
        }
        
        // Extract tag name
        const tagName = tagContent.split(' ')[0]
        
        // Skip auto-closing for void elements
        const voidElements = ['img', 'input', 'br', 'hr', 'meta', 'link']
        if (voidElements.includes(tagName)) {
          return
        }
        
        // Insert closing tag
        const newPosition = selectionStart + 1
        const newValue = 
          value.substring(0, selectionStart + 1) + 
          `</${tagName}>` + 
          value.substring(selectionEnd)
        
        setFormData(prev => ({ ...prev, content: newValue }))
        
        // Set cursor position after the next tick
        setTimeout(() => {
          textarea.selectionStart = newPosition
          textarea.selectionEnd = newPosition
          textarea.focus()
        }, 0)
      }
    }
    
    // Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const newValue = 
        value.substring(0, selectionStart) + 
        '  ' + 
        value.substring(selectionEnd)
      
      setFormData(prev => ({ ...prev, content: newValue }))
      
      // Set cursor position
      setTimeout(() => {
        textarea.selectionStart = selectionStart + 2
        textarea.selectionEnd = selectionStart + 2
      }, 0)
    }
  }

  // Insert tag from suggestion
  const insertTag = (tag: string) => {
    if (!editorRef.current) return
    
    const textarea = editorRef.current
    const { selectionStart, selectionEnd, value } = textarea
    const selectedText = value.substring(selectionStart, selectionEnd)
    
    // Void elements don't need closing tags
    const voidElements = ['img', 'input', 'br', 'hr', 'meta', 'link']
    const isVoidElement = voidElements.includes(tag)
    
    let insertedContent
    if (isVoidElement) {
      insertedContent = `<${tag} />`
    } else if (selectedText) {
      insertedContent = `<${tag}>${selectedText}</${tag}>`
    } else {
      insertedContent = `<${tag}></${tag}>`
    }
    
    const newValue = 
      value.substring(0, selectionStart) + 
      insertedContent + 
      value.substring(selectionEnd)
    
    setFormData(prev => ({ ...prev, content: newValue }))
    
    // Set cursor position
    const newPosition = isVoidElement 
      ? selectionStart + tag.length + 3
      : selectedText 
        ? selectionStart + tag.length + 2 + selectedText.length
        : selectionStart + tag.length + 2
    
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = newPosition
      textarea.selectionEnd = newPosition
    }, 0)
  }

  // Insert code block template
  const insertCodeBlock = () => {
    if (!editorRef.current) return
    
    const textarea = editorRef.current
    const { selectionStart, selectionEnd, value } = textarea
    const selectedText = value.substring(selectionStart, selectionEnd)
    
    const codeTemplate = selectedText 
      ? `<pre><code>${selectedText}</code></pre>`
      : `<pre><code>// Your code here\n</code></pre>`
    
    const newValue = 
      value.substring(0, selectionStart) + 
      codeTemplate + 
      value.substring(selectionEnd)
    
    setFormData(prev => ({ ...prev, content: newValue }))
    
    // Set cursor position inside the code block
    const newPosition = selectedText
      ? selectionStart + 11 + selectedText.length
      : selectionStart + 11 + 16
    
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = newPosition
      textarea.selectionEnd = newPosition
    }, 0)
  }

  // Add this function to handle showing suggestions
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const { value, selectionStart } = textarea
    
    // Find the current word being typed
    const textBeforeCursor = value.substring(0, selectionStart)
    const match = textBeforeCursor.match(/<([a-zA-Z]*)$/)
    
    if (match) {
      const word = match[1].toLowerCase()
      setCurrentWord(word)
      
      // Filter suggestions based on current input
      const filtered = commonTags.filter(item => 
        item.tag.toLowerCase().startsWith(word)
      )
      
      if (filtered.length > 0) {
        setSuggestions(filtered)
        setShowSuggestions(true)
        
        // Calculate position for suggestions popup
        const textareaRect = textarea.getBoundingClientRect()
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)
        const lines = textBeforeCursor.split('\n')
        const currentLineIndex = lines.length - 1
        
        // Approximate cursor position
        const top = textareaRect.top + (currentLineIndex * lineHeight) - textarea.scrollTop
        const left = textareaRect.left + (match.index * 8) // Approximate character width
        
        setCursorPosition({ top, left })
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  // Add this function to handle suggestion selection
  const selectSuggestion = (tag: string) => {
    if (!editorRef.current) return
    
    const textarea = editorRef.current
    const { value, selectionStart } = textarea
    const textBeforeCursor = value.substring(0, selectionStart)
    const match = textBeforeCursor.match(/<([a-zA-Z]*)$/)
    
    if (match) {
      const startPos = selectionStart - match[1].length
      const newValue = 
        value.substring(0, startPos) + 
        tag + 
        value.substring(selectionStart)
    
      setFormData(prev => ({ ...prev, content: newValue }))
    
      // Set cursor position after the tag
      setTimeout(() => {
        textarea.focus()
        const newPosition = startPos + tag.length
        textarea.selectionStart = newPosition
        textarea.selectionEnd = newPosition
      }, 0)
    }
    
    setShowSuggestions(false)
  }

  // Add this effect to handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin')
      }
    } catch (error) {
      console.error('Error creating blog post:', error)
    } finally {
      setLoading(false)
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
              <p className="mt-1 text-sm text-gray-500">
                A short summary of your blog post (optional)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <div className="mb-2 flex flex-wrap gap-2">
                {commonTags.map(({ tag, description }) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertTag(tag)}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                    title={description}
                  >
                    {tag}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={insertCodeBlock}
                  className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded-md text-amber-700"
                  title="Insert code block"
                >
                  code block
                </button>
              </div>
              <textarea
                ref={editorRef}
                name="content"
                value={formData.content}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
                rows={20}
                required
                placeholder="<h1>Your Title</h1>
<p>Your content here...</p>

<pre><code>// Your code block
function example() {
  return 'Hello World';
}</code></pre>"
              />
              <p className="mt-1 text-sm text-gray-500">
                Click tag buttons to insert, or type HTML directly. Tags auto-close when you type "&gt;".
              </p>
            </div>
            
            {showSuggestions && (
              <div 
                ref={suggestionsRef}
                className="absolute z-10 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto"
                style={{ 
                  top: `${cursorPosition.top + 20}px`, 
                  left: `${cursorPosition.left}px` 
                }}
              >
                <ul className="py-1">
                  {suggestions.map(({ tag, description }) => (
                    <li 
                      key={tag}
                      onClick={() => selectSuggestion(tag)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    >
                      <span className="font-mono text-blue-600">{tag}</span>
                      <span className="ml-2 text-gray-600 text-sm">{description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. nextjs, react, tutorial"
              />
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
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Publish immediately
              </label>
            </div>
            
            <div className="flex justify-end gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}




