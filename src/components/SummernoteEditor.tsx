'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// Import styles
import 'summernote/dist/summernote-lite.css'

// TypeScript declarations for jQuery and Summernote
declare global {
  interface Window {
    jQuery: any;
    $: any;
  }
}

interface SummernoteEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const SummernoteEditorComponent = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  height = 300
}: SummernoteEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [jQueryLoaded, setJQueryLoaded] = useState(false);
  const [summernoteLoaded, setSummernoteLoaded] = useState(false);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State to show fallback textarea after timeout
  const [showFallback, setShowFallback] = useState(false);

  // Load jQuery and Summernote from npm packages
  useEffect(() => {
    // Set a timeout to show fallback textarea if loading takes too long
    const fallbackTimeout = setTimeout(() => {
      if (!editorInitialized) {
        console.log('Loading timeout reached, showing fallback textarea');
        setShowFallback(true);
      }
    }, 10000); // 10 seconds

    const loadPackages = async () => {
      try {
        // Import jQuery from npm
        console.log('Loading jQuery from npm package...');
        const jQuery = await import('jquery');
        const $ = jQuery.default;

        // Make jQuery available globally
        window.jQuery = $;
        window.$ = $;

        console.log('jQuery loaded successfully');
        setJQueryLoaded(true);

        // Import Summernote
        console.log('Loading Summernote from npm package...');
        await import('summernote/dist/summernote-lite.js');

        console.log('Summernote loaded successfully');
        setSummernoteLoaded(true);
      } catch (error) {
        console.error('Error loading packages:', error);
        setIsError(true);
        setErrorMessage('Failed to load editor packages. Please try refreshing the page.');
      }
    };

    loadPackages();

    // Cleanup function
    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, []);

  // Initialize Summernote when both jQuery and Summernote are loaded
  useEffect(() => {
    if (!jQueryLoaded || !summernoteLoaded || !editorRef.current) return;

    try {
      console.log('Both jQuery and Summernote loaded, initializing editor...');
      const $ = (window as any).jQuery;

      // Define custom button for code blocks
      $.summernote.options.buttons.codeblock = function (context) {
        return $.summernote.ui.button({
          contents: '<i class="note-icon-code"></i> Code Block',
          tooltip: 'Insert Code Block',
          click: function () {
            // Insert pre and code tags for a code block
            context.invoke('editor.pasteHTML', '<pre><code>// Your code here</code></pre>');
          }
        }).render();
      };

      // Initialize Summernote
      $(editorRef.current).summernote({
        placeholder,
        tabsize: 2,
        height,
        focus: true,
        lineHeight: ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '3.0'],
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph', 'height']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video', 'codeblock']],
          ['view', ['fullscreen', 'codeview', 'help']]
        ],
        callbacks: {
          onChange: function(contents: string) {
            onChange(contents);
          },
          onInit: function() {
            console.log('Summernote initialized successfully');
            setEditorInitialized(true);

            // Set initial content
            if (value) {
              $(editorRef.current).summernote('code', value);
            }

            // Apply custom styling
            $('.note-toolbar').addClass('bg-gray-50 border-b border-gray-200');
            $('.note-btn').addClass('hover:bg-gray-100');
            $('.note-editable').addClass('text-gray-800');

            // Set default line height
            $('.note-editable').css('line-height', '1.5');

            // Force toolbar visibility
            $('.note-toolbar').css('display', 'block');
            $('.note-toolbar').css('opacity', '1');
            $('.note-toolbar').css('visibility', 'visible');
          }
        }
      });
    } catch (error) {
      console.error('Error initializing Summernote:', error);
      setIsError(true);
      setErrorMessage('Failed to initialize editor. Please try refreshing the page.');
    }
  }, [jQueryLoaded, summernoteLoaded, height, placeholder, value, onChange]);

  // Update content when value prop changes
  useEffect(() => {
    if (!editorInitialized || !editorRef.current || value === undefined) return;

    try {
      const $ = (window as any).jQuery;
      const currentContent = $(editorRef.current).summernote('code');

      // Only update if the content is different to avoid cursor jumping
      if (currentContent !== value) {
        $(editorRef.current).summernote('code', value);
      }
    } catch (error) {
      // Ignore errors - the editor might not be ready yet
    }
  }, [value, editorInitialized]);

  // Handle jQuery load error
  const handleJQueryError = () => {
    console.error('Failed to load jQuery');
    setIsError(true);
    setErrorMessage('Failed to load jQuery. Please check your internet connection and try again.');
  };

  // Handle Summernote load error
  const handleSummernoteError = () => {
    console.error('Failed to load Summernote');
    setIsError(true);
    setErrorMessage('Failed to load Summernote. Please check your internet connection and try again.');
  };

  // Function to retry loading scripts
  const retryLoading = () => {
    // Reset all states
    setIsError(false);
    setJQueryLoaded(false);
    setSummernoteLoaded(false);
    setEditorInitialized(false);

    // Retry loading from npm packages
    const retryLoadPackages = async () => {
      try {
        // Import jQuery from npm
        console.log('Retrying to load jQuery from npm package...');
        const jQuery = await import('jquery');
        const $ = jQuery.default;

        // Make jQuery available globally
        window.jQuery = $;
        window.$ = $;

        console.log('jQuery loaded successfully on retry');
        setJQueryLoaded(true);

        // Import Summernote
        console.log('Retrying to load Summernote from npm package...');
        await import('summernote/dist/summernote-lite.js');

        console.log('Summernote loaded successfully on retry');
        setSummernoteLoaded(true);
      } catch (error) {
        console.error('Error retrying to load packages:', error);
        setIsError(true);
        setErrorMessage('Failed to load editor packages. Please try refreshing the page.');
      }
    };

    retryLoadPackages();
  };

  return (
    <div className="summernote-editor-container">
      {/* We'll load scripts manually in useEffect instead of using Script components */}

      {/* Summernote Editor Container */}
      <div ref={editorRef} className="border border-gray-300 rounded min-h-[300px] relative">
        {/* Loading Indicator */}
        {!editorInitialized && !isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-gray-600">Loading editor...</p>
              <p className="text-xs text-gray-500 mt-2">
                jQuery: {jQueryLoaded ? 'Loaded ✓' : 'Loading...'}
                <br />
                Summernote: {summernoteLoaded ? 'Loaded ✓' : 'Loading...'}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                onClick={retryLoading}
              >
                Try Again
              </button>
              <button
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center p-4">
              <div className="text-red-500 text-xl mb-2">⚠️</div>
              <p className="text-red-600 font-medium">{errorMessage}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                onClick={retryLoading}
              >
                Try Again
              </button>
              <button
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fallback Textarea - shown if loading takes too long */}
      {(showFallback || (!editorInitialized && jQueryLoaded && summernoteLoaded && !isError)) && (
        <div className="mt-4">
          <p className="text-yellow-600 mb-2">
            <strong>Note:</strong> Rich text editor is taking longer than expected to load. You can use this basic editor instead:
          </p>
          <textarea
            className="w-full border border-gray-300 rounded p-2 min-h-[300px]"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          ></textarea>
        </div>
      )}

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

        /* Fix line height in the editor */
        .note-editable {
          line-height: 1.5 !important;
        }

        /* Style for code block button */
        .note-btn.btn-codeblock {
          background-color: #f8f9fa;
          border-color: #ddd;
        }

        .note-btn.btn-codeblock:hover {
          background-color: #e2e6ea;
        }
      `}</style>
    </div>
  );
};

// Use dynamic import with no SSR to avoid hydration issues
const SummernoteEditor = dynamic(() => Promise.resolve(SummernoteEditorComponent), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded min-h-[300px] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p className="text-gray-600">Loading editor...</p>
      </div>
    </div>
  ),
});

export default SummernoteEditor;
