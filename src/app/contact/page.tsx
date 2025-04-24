import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FaTwitter, FaGithub, FaDiscord, FaLinkedin } from 'react-icons/fa';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactFAQ from '@/components/contact/ContactFAQ';
import { FAQSchema, ContactPageSchema } from '@/components/seo/SchemaOrg';

export const metadata: Metadata = {
  title: 'Contact Us | CodeXOrbit',
  description: 'Get in touch with the CodeXOrbit team. We\'d love to hear from you about collaborations, questions, or feedback.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  // FAQ data for structured data
  const faqData = [
    {
      question: 'How quickly will I receive a response to my inquiry?',
      answer: 'We aim to respond to all inquiries within 24-48 hours during business days. For urgent matters, please indicate this in your message subject.',
    },
    {
      question: 'Do you offer consulting services for web development projects?',
      answer: 'Yes, we provide consulting services for web development projects of all sizes. Whether you need advice on technology stack, architecture, or best practices, we\'re here to help.',
    },
    {
      question: 'Can I request a tutorial on a specific programming topic?',
      answer: 'Absolutely! We welcome topic suggestions for our tutorials. Please provide details about the specific programming concept or technology you\'d like us to cover.',
    },
    {
      question: 'Do you accept guest posts or contributions?',
      answer: 'Yes, we accept high-quality guest posts from experienced developers. Please contact us with your proposed topic and a brief outline for consideration.',
    },
    {
      question: 'How can I report a technical issue with the website?',
      answer: 'If you encounter any technical issues with our website, please let us know by submitting a detailed description of the problem, including the device and browser you\'re using.',
    },
  ];

  return (
    <>
      <FAQSchema questions={faqData} />
      <ContactPageSchema />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mt-14">
        {/* Hero Section with Background */}
        <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 py-20 mb-16">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjUiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xIDAgMS4yLS45IDIuMS0yLjEgMi4xLTEuMiAwLTIuMS0uOS0yLjEtMi4xIDAtMS4yLjktMi4xIDIuMS0yLjF6bS0xMiAwYzEuMiAwIDIuMS45IDIuMSAyLjEgMCAxLjItLjkgMi4xLTIuMSAyLjEtMS4yIDAtMi4xLS45LTIuMS0yLjEgMC0xLjIuOS0yLjEgMi4xLTIuMXptMTIgMTJjMS4yIDAgMi4xLjkgMi4xIDIuMSAwIDEuMi0uOSAyLjEtMi4xIDIuMS0xLjIgMC0yLjEtLjktMi4xLTIuMSAwLTEuMi45LTIuMSAyLjEtMi4xem0tMTIgMGMxLjIgMCAyLjEuOSAyLjEgMi4xIDAgMS4yLS45IDIuMS0yLjEgMi4xLTEuMiAwLTIuMS0uOS0yLjEtMi4xIDAtMS4yLjktMi4xIDIuMS0yLjF6bTEyIDEyYzEuMiAwIDIuMS45IDIuMSAyLjEgMCAxLjItLjkgMi4xLTIuMSAyLjEtMS4yIDAtMi4xLS45LTIuMS0yLjEgMC0xLjIuOS0yLjEgMi4xLTIuMXptLTEyIDBjMS4yIDAgMi4xLjkgMi4xIDIuMSAwIDEuMi0uOSAyLjEtMi4xIDIuMS0xLjIgMC0yLjEtLjktMi4xLTIuMSAwLTEuMi45LTIuMSAyLjEtMi4xeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-sm">
                Get in <span className="text-gray-900">Touch</span>
              </h1>
              <span className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-light">
                Have questions or want to collaborate? We&apos;d love to hear from you!
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Section */}
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Contact Form */}
              <div className="p-8 md:p-10 lg:p-12 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                  <span className="inline-block border-b-4 border-amber-500 pb-1">Send Us a Message</span>
                </h2>
                <ContactForm />
              </div>

              {/* Contact Info with Gradient Background */}
              <section className="p-8 md:p-10 lg:p-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <ContactInfo />
              </section>
            </div>
          </div>

          {/* Connect Section */}
          <section className="max-w-6xl mx-auto mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-10 lg:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                  <span className="inline-block border-b-4 border-amber-500 pb-1">Connect With Us</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  CodeXOrbit is an online platform dedicated to sharing knowledge about programming, web development, and technology. We&apos;re always looking to connect with our readers and the developer community.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                      Join the Conversation
                    </h3>
                    <p className="text-gray-600">
                      Follow us on social media to stay updated with our latest articles, tutorials, and discussions.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Get Support
                    </h3>
                    <p className="text-gray-600">
                      Need help with a tutorial or have questions about our content? Use the contact form or reach out via email.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href="https://twitter.com/codexorbit" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full bg-[#1DA1F2] text-white hover:bg-opacity-90 transition-all">
                    <FaTwitter />
                  </a>
                  <a href="https://github.com/codexorbit" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full bg-[#333] text-white hover:bg-opacity-90 transition-all">
                    <FaGithub />
                  </a>
                  <a href="https://discord.gg/codexorbit" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full bg-[#5865F2] text-white hover:bg-opacity-90 transition-all">
                    <FaDiscord />
                  </a>
                  <a href="https://www.linkedin.com/company/codexorbit" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full bg-[#0077B5] text-white hover:bg-opacity-90 transition-all">
                    <FaLinkedin />
                  </a>
                </div>
              </div>

              <div className="p-8 md:p-10 lg:p-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center">
                <div className="max-w-md">
                  <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
                  <p className="mb-6 ">
                    Get the latest articles, tutorials, and updates delivered straight to your inbox. We send out a newsletter once a month.
                  </p>
                  <form className="space-y-4">
                    <div>
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Subscribe
                    </button>
                    <p className="text-sm text-white/80">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-6xl mx-auto mt-16 bg-white rounded-xl shadow-lg overflow-hidden p-8 md:p-10 lg:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                <span className="inline-block border-b-4 border-amber-500 pb-1">Frequently Asked Questions</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about our services, response times, and collaboration opportunities.
              </p>
            </div>
            <ContactFAQ />
          </section>

          {/* CTA Section */}
          <section className="max-w-6xl mx-auto mt-16 mb-8 relative">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-10 md:p-12 lg:p-16 rounded-xl shadow-lg overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDE4YzEuMiAwIDIuMS45IDIuMSAyLjEgMCAxLjItLjkgMi4xLTIuMSAyLjEtMS4yIDAtMi4xLS45LTIuMS0yLjEgMC0xLjIuOS0yLjEgMi4xLTIuMXptLTEyIDBjMS4yIDAgMi4xLjkgMi4xIDIuMSAwIDEuMi0uOSAyLjEtMi4xIDIuMS0xLjIgMC0yLjEtLjktMi4xLTIuMSAwLTEuMi45LTIuMSAyLjEtMi4xem0xMiAxMmMxLjIgMCAyLjEuOSAyLjEgMi4xIDAgMS4yLS45IDIuMS0yLjEgMi4xLTEuMiAwLTIuMS0uOS0yLjEtMi4xIDAtMS4yLjktMi4xIDIuMS0yLjF6bS0xMiAwYzEuMiAwIDIuMS45IDIuMSAyLjEgMCAxLjItLjkgMi4xLTIuMSAyLjEtMS4yIDAtMi4xLS45LTIuMS0yLjEgMC0xLjIuOS0yLjEgMi4xLTIuMXptMTIgMTJjMS4yIDAgMi4xLjkgMi4xIDIuMSAwIDEuMi0uOSAyLjEtMi4xIDIuMS0xLjIgMC0yLjEtLjktMi4xLTIuMSAwLTEuMi45LTIuMSAyLjEtMi4xem0tMTIgMGMxLjIgMCAyLjEuOSAyLjEgMi4xIDAgMS4yLS45IDIuMS0yLjEgMi4xLTEuMiAwLTIuMS0uOS0yLjEtMi4xIDAtMS4yLjktMi4xIDIuMS0yLjF6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>

              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 !text-gray-300">
                  Ready to Start Your <span className="text-amber-400">Coding Journey</span>?
                </h2>
                <p className="mb-10 text-lg md:text-xl max-w-3xl mx-auto !text-gray-300 font-light">
                  Explore our tutorials, projects, and resources to elevate your development skills to cosmic heights.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    href="/blog"
                    className="px-8 py-4 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-center"
                  >
                    Explore Blog
                  </Link>
                  <Link
                    href="/about"
                    className="px-8 py-4 border-2 border-amber-400 text-amber-400 rounded-lg font-medium hover:bg-amber-400/10 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-center"
                  >
                    About Us
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}