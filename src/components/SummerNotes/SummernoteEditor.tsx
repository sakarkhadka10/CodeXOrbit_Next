'use client'

import { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'summernote/dist/summernote-bs4.css';
import 'summernote/dist/summernote-bs4.min.js';
import $ from 'jquery';

const SummernoteEditor = ({ onChange }: { onChange?: (content: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && editorRef.current) {
      // Initialize Summernote
      $(editorRef.current).summernote({
        height: 300,
        callbacks: {
          onChange: function(contents: string) {
            onChange?.(contents);
          }
        }
      });
    }

    return () => {
      if (editorRef.current) {
        try {
          $(editorRef.current).summernote('destroy');
        } catch (err) {
          console.error("Failed to destroy Summernote:", err);
        }
      }
    };
  }, []);

  return <div ref={editorRef} />;
};

export default SummernoteEditor;
