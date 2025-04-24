'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: string;
}

export default function ContactFAQ() {
  const faqs: FAQItem[] = [
    {
      question: 'How quickly will I receive a response to my inquiry?',
      answer: 'We aim to respond to all inquiries within 24-48 hours. For urgent matters, please indicate this in your message subject.',
    },
    {
      question: 'How can I suggest a topic for a future article?',
      answer: 'We welcome topic suggestions! Use our contact form and select "Content Suggestion" as the subject. Please provide details about the specific programming concept or technology you&apos;d like us to cover.',
    },
    {
      question: 'Do you accept guest posts or contributions?',
      answer: 'Yes, we accept high-quality guest posts from experienced developers. Please contact us with your proposed topic and a brief outline for consideration. We look for original, well-researched content that provides value to our readers.',
    },
    {
      question: 'How can I report a technical issue with the website?',
      answer: 'If you encounter any technical issues with our website, please let us know by submitting a detailed description of the problem, including the device and browser you&apos;re using. Screenshots are also helpful.',
    },
    {
      question: 'Can I use code examples from your tutorials in my projects?',
      answer: 'Yes, all code examples in our tutorials are available for use in both personal and commercial projects. We use the MIT license for our code snippets. However, we appreciate attribution when possible.',
    },
    {
      question: 'How can I stay updated with new content?',
      answer: 'You can subscribe to our newsletter, follow us on social media, or enable browser notifications to stay updated with our latest articles and tutorials. We typically publish new content 2-3 times per week.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open the first FAQ

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`border rounded-xl overflow-hidden transition-all duration-300 ${
            openIndex === index
              ? 'border-amber-300 shadow-md'
              : 'border-gray-200 hover:border-amber-200'
          }`}
        >
          <button
            className={`w-full flex justify-between items-center p-5 text-left transition-colors ${
              openIndex === index
                ? 'bg-amber-50'
                : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => toggleFAQ(index)}
            aria-expanded={openIndex === index}
          >
            <span className={`font-medium ${openIndex === index ? 'text-amber-700' : 'text-gray-900'}`}>
              {faq.question}
            </span>
            <span className={`ml-2 flex-shrink-0 transition-transform duration-300 ${
              openIndex === index ? 'text-amber-500 rotate-180' : 'text-gray-400'
            }`}>
              <FaChevronDown />
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="p-5 bg-amber-50 border-t border-amber-100">
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
