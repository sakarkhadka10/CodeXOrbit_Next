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
          // Remove tooltip to avoid the error
          click: function () {
            // Insert pre and code tags for a code block with an edit button
            context.invoke('editor.pasteHTML', '<pre><button type="button" class="code-edit-btn">Exit</button><code>// Your code here</code></pre>');
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
        // Disable tooltips completely to avoid errors
        tooltip: false,
        // Set container to body to avoid positioning issues
        container: document.body,
        // Disable adding classes to pasted content
        styleTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre'],
        // Configure callbacks
        styleWithSpan: false,
        disableDragAndDrop: false,
        popover: {
          image: [
            ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
            ['float', ['floatLeft', 'floatRight', 'floatNone']],
            ['remove', ['removeMedia']]
          ]
        },
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
            // Clean any class attributes from the content
            const cleanContent = contents.replace(/ class="[^"]*"/g, '');

            // Only update if content actually changed to avoid loops
            if (cleanContent !== contents) {
              // Use setTimeout to avoid recursive onChange calls
              setTimeout(() => {
                $(editorRef.current).summernote('code', cleanContent);
              }, 0);

              // Pass the cleaned content to the parent component
              onChange(cleanContent);
            } else {
              onChange(contents);
            }
          },

          onPaste: function(e: any) {
            // Get plain text from clipboard
            const bufferText = ((e.originalEvent as ClipboardEvent).clipboardData || (window as any).clipboardData).getData('Text');

            // Clean the text and insert it as plain text
            const cleanText = bufferText.replace(/<[^>]*>/g, '');

            // Let Summernote handle the paste but clean it afterward
            setTimeout(() => {
              const content = $(editorRef.current).summernote('code');
              const cleanContent = content.replace(/ class="[^"]*"/g, '');
              $(editorRef.current).summernote('code', cleanContent);
            }, 0);
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

            // Clean up any existing classes in the editor content
            const content = $(editorRef.current).summernote('code');
            const cleanContent = content.replace(/ class="[^"]*"/g, '');
            $(editorRef.current).summernote('code', cleanContent);

            // Add edit buttons to existing code blocks
            $('.note-editable pre').each(function() {
              // Only add button if it doesn't already have one
              if ($(this).find('.code-edit-btn').length === 0) {
                $(this).prepend('<button type="button" class="code-edit-btn">Exit</button>');
              }
            });

            // Set up a mutation observer to add edit buttons to new code blocks
            const editableElement = $('.note-editable')[0];
            if (editableElement) {
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any of the added nodes are pre elements or contain pre elements
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1) { // Element node
                        // Check if the node is a pre element
                        if (node.nodeName === 'PRE') {
                          if ($(node).find('.code-edit-btn').length === 0) {
                            $(node).prepend('<button type="button" class="code-edit-btn">Exit</button>');
                          }
                        }
                        // Check if the node contains pre elements
                        const preElements = $(node).find('pre');
                        if (preElements.length > 0) {
                          preElements.each(function() {
                            if ($(this).find('.code-edit-btn').length === 0) {
                              $(this).prepend('<button type="button" class="code-edit-btn">Exit</button>');
                            }
                          });
                        }
                      }
                    });
                  }
                });
              });

              // Start observing the editable area for changes
              observer.observe(editableElement, {
                childList: true,
                subtree: true
              });
            }

            // Add click handler for edit buttons on code blocks
            $('.note-editable').off('click', '.code-edit-btn').on('click', '.code-edit-btn', function(e) {
              e.preventDefault();
              e.stopPropagation();

              try {
                // Find the parent pre element
                const preElement = $(this).closest('pre')[0];

                if (preElement && preElement.parentNode) {
                  // Create a new paragraph with a non-breaking space to ensure it's selectable
                  const newParagraph = $('<p><br></p>')[0];

                  // Insert the new paragraph after the pre element
                  preElement.parentNode.insertBefore(newParagraph, preElement.nextSibling);

                  // Focus the editor
                  $(editorRef.current).summernote('focus');

                  // Use Summernote's built-in methods to set the cursor position
                  const editor = $(editorRef.current).summernote('editor');

                  // Create a range at the beginning of the new paragraph
                  const range = document.createRange();
                  range.setStart(newParagraph, 0);
                  range.collapse(true);

                  // Set the selection to this range
                  const selection = window.getSelection();
                  if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                  }

                  // Force Summernote to update its internal state
                  $(editorRef.current).summernote('editor.saveRange');

                  // Trigger a change event to ensure Summernote updates
                  const content = $(editorRef.current).summernote('code');
                  onChange(content);

                  // Scroll to the new position
                  newParagraph.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              } catch (error) {
                console.error('Error in exit button click handler:', error);

                // Fallback method if the above fails
                try {
                  // Insert a paragraph at the current selection
                  $(editorRef.current).summernote('insertParagraph');
                } catch (fallbackError) {
                  console.error('Fallback method also failed:', fallbackError);
                }
              }
            });
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
    <div className="summernote-editor-container" onClick={(e) => e.stopPropagation()}>
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

        /* Style for code block edit button */
        .code-edit-btn {
          position: absolute;
          top: 5px;
          right: 10px;
          background-color: #27c93f;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 12px;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          opacity: 1;
          transition: all 0.2s;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          text-shadow: 0 1px 1px rgba(0,0,0,0.2);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .code-edit-btn:hover {
          background-color: #2edc47;
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        }

        .code-edit-btn:active {
          transform: translateY(0);
          background-color: #25b53a;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        /* Make sure the button is always visible */
        .note-editable pre:hover .code-edit-btn {
          opacity: 1;
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
