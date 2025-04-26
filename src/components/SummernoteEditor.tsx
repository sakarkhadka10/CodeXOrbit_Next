'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// Import jQuery and Summernote directly
import 'summernote/dist/summernote-lite.min.css'

interface SummernoteEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const SummernoteEditor = dynamic(() => Promise.resolve(({
  value,
  onChange,
  placeholder = 'Write your content here...',
  height = 300
}: SummernoteEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      try {
        // Dynamically import jQuery and Summernote
        const jQuery = await import('jquery');
        const $ = jQuery.default;

        // Make jQuery available globally
        (window as any).jQuery = $;
        (window as any).$ = $;

        // Import Summernote
        await import('summernote/dist/summernote-lite.min.js');

        // Check if component is still mounted
        if (!isMounted) return;

        // Check if the editor reference exists
        if (!editorRef.current) {
          setIsError(true);
          setErrorMessage('Editor reference not found');
          setIsLoading(false);
          return;
        }

        // Initialize Summernote
        $(editorRef.current).summernote({
          placeholder,
          tabsize: 2,
          height,
          toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
          ],
          callbacks: {
            onChange: function(contents: string) {
              onChange(contents);
            },
            onInit: function() {
              console.log('Summernote initialized successfully');

              // Set initial content
              if (value) {
                $(editorRef.current).summernote('code', value);
              }

              // Apply custom styling
              $('.note-toolbar').addClass('bg-gray-50 border-b border-gray-200');
              $('.note-btn').addClass('hover:bg-gray-100');
              $('.note-editable').addClass('text-gray-800');

              // Force toolbar visibility
              $('.note-toolbar').css('display', 'block');
              $('.note-toolbar').css('opacity', '1');
              $('.note-toolbar').css('visibility', 'visible');

              // Set loading state to false
              if (isMounted) {
                setIsLoading(false);
              }
            }
          }
        });
      } catch (error) {
        console.error('Error initializing Summernote:', error);
        if (isMounted) {
          setIsError(true);
          setErrorMessage('Failed to initialize editor. Please try refreshing the page.');
          setIsLoading(false);
        }
      }
    };

    // Initialize the editor
    initEditor();

    // Cleanup function
    return () => {
      isMounted = false;
      try {
        if (editorRef.current && (window as any).jQuery) {
          const $ = (window as any).jQuery;
          if ($.summernote) {
            $(editorRef.current).summernote('destroy');
          }
        }
      } catch (error) {
        console.error('Error destroying Summernote:', error);
      }
    };
  }, [height, placeholder, value, onChange]);

  // Update content when value prop changes
  useEffect(() => {
    if (isLoading || isError || !editorRef.current || value === undefined) return;

    try {
      const $ = (window as any).jQuery;
      if ($ && $.summernote) {
        const currentContent = $(editorRef.current).summernote('code');

        // Only update if the content is different to avoid cursor jumping
        if (currentContent !== value) {
          $(editorRef.current).summernote('code', value);
        }
      }
    } catch (error) {
      // Ignore errors - the editor might not be ready yet
    }
  }, [value, isLoading, isError]);

  return (
    <div className="summernote-editor-container">
      <div ref={editorRef} className="border border-gray-300 rounded min-h-[300px] relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-gray-600">Loading editor...</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center p-4">
              <div className="text-red-500 text-xl mb-2">⚠️</div>
              <p className="text-red-600 font-medium">{errorMessage}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom styles for code blocks */}
      <style jsx global>{`
        /* Basic code block styling */
        .note-editable pre {
          background-color: #1e1e1e;
          color: #e6e6e6;
          border-radius: 6px;
          padding: 40px 12px 12px 12px;
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
          box-shadow: 22px 0 0 #ffbd2e, 44px 0 0 #27c93f;
          z-index: 1;
        }

        /* Fix for toolbar visibility */
        .note-toolbar {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          position: sticky !important;
          top: 0 !important;
          z-index: 10 !important;
          background-color: #f9fafb !important;
        }

        /* Ensure editor is properly displayed */
        .note-editor {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
      `}</style>
    </div>
  );
}), { ssr: false });

export default SummernoteEditor;
