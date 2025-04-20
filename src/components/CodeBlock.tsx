'use client'

import { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

interface CodeBlockProps {
  content: string;
}

// Helper function to detect language from code
function detectLanguage(code: string): string {
  // Check for language attribute in parent element
  const languageMatch = code.match(/class="language-(\w+)"/) || code.match(/data-language="(\w+)"/);
  if (languageMatch && languageMatch[1]) {
    return languageMatch[1];
  }

  // Simple language detection based on common patterns
  if (code.includes('def ') || code.includes('print(')) {
    return 'python';
  }
  if (code.includes('interface') || code.includes(':') || code.includes('<T>')) {
    return 'typescript';
  }
  if (code.includes('class') && code.includes('public')) {
    return 'java';
  }
  if (code.includes('#include')) {
    return 'cpp';
  }
  if (code.includes('import React') || code.includes('export default') || code.includes('const') || code.includes('let')) {
    return 'javascript';
  }
  return 'javascript'; // default to javascript
}

export default function CodeBlock({ content }: CodeBlockProps) {
  const [renderedHtml, setRenderedHtml] = useState<string>('');

  useEffect(() => {
    // Process code blocks
    const codeMap = new Map<string, string>();

    // This regex finds all <pre><code> blocks
    const processedHtml = content.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_match, codeContent) => {
      const language = detectLanguage(codeContent);

      // Format the code to preserve indentation
      const formattedCode = codeContent
        .trim()
        .split('\n')
        .map((line: string) => line.trimEnd())
        .join('\n');

      const highlightedCode = Prism.highlight(
        formattedCode,
        Prism.languages[language] || Prism.languages.javascript,
        language
      );

      // Generate a unique ID for this code block
      const blockId = `code-block-${Math.random().toString(36).substring(2, 11)}`;

      // Store the original formatted code
      codeMap.set(blockId, formattedCode);

      // Add terminal-like header with dots and language indicator
      // macOS style for all pages, but without Exit button for non-admin pages
      const terminalHeader = `
        <div class="flex justify-between items-center bg-[#1e1e1e] px-4 py-2 rounded-t-lg border-b border-gray-700">
          <div class="flex gap-2 items-center">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-400 font-mono uppercase">${language}</span>
            <button
              class="copy-button flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
              data-code-id="${blockId}"
            >
              <span class="copy-icon"><svg class="w-3.5 h-3.5" viewBox="0 0 384 512"><path fill="currentColor" d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg></span>
              <span class="copy-text">Copy</span>
            </button>
          </div>
        </div>
      `;

      return `
        <div class="code-block-container" id="${blockId}">
          ${terminalHeader}
          <pre class="shadow-lg">
            <code class="language-${language}">${highlightedCode}</code>
          </pre>
        </div>
      `;
    });

    setRenderedHtml(processedHtml);

    // Add click handlers for copy buttons with improved functionality
    setTimeout(() => {
      const copyButtons = document.querySelectorAll('.copy-button');
      copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
          const codeId = button.getAttribute('data-code-id');
          if (!codeId) return;

          const codeContent = codeMap.get(codeId);
          if (!codeContent) return;

          try {
            // Create a temporary textarea element to copy from
            // This is more reliable than navigator.clipboard in some browsers
            const textarea = document.createElement('textarea');
            textarea.value = codeContent;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            // Using execCommand despite deprecation as it has better browser support
            document.execCommand('copy');
            document.body.removeChild(textarea);

            // Also try the modern clipboard API as a fallback
            try {
              await navigator.clipboard.writeText(codeContent);
            } catch {
              // Silent fallback - execCommand already did the job
            }

            // Update button appearance
            const copyIcon = button.querySelector('.copy-icon');
            const copyText = button.querySelector('.copy-text');
            if (copyIcon && copyText) {
              const originalIcon = copyIcon.innerHTML;
              const originalText = copyText.textContent;

              // Change to checkmark
              copyIcon.innerHTML = '<svg class="w-3.5 h-3.5" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>';
              copyText.textContent = 'Copied!';
              button.classList.add('text-green-400');

              // Revert after 2 seconds
              setTimeout(() => {
                copyIcon.innerHTML = originalIcon;
                copyText.textContent = originalText;
                button.classList.remove('text-green-400');
              }, 2000);
            }
          } catch (err) {
            console.error('Failed to copy code:', err);
            alert('Failed to copy code. Please try again.');
          }
        });
      });
    }, 100); // Increased timeout to ensure DOM is fully loaded

  }, [content]);

  return (
    <div
      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:text-amber-700 prose-img:rounded-xl"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
