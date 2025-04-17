"use client"; // Required for client-side features like useState/useEffect
import React, { memo, useState, useEffect } from "react";
import Link from "next/link";
import { FaRocket, FaCode, FaBook, FaGraduationCap } from "react-icons/fa";

interface TutorialIframeProps {
  youtubeId: string;
  title: string;
}

interface TutorialCardProps {
  title: string;
  description: string;
  category: string;
  level: string;
  youtubeId: string;
  slug: string;
}

// Lazy-loaded iframe component for YouTube embeds
const TutorialIframe = memo(({ youtubeId, title }: TutorialIframeProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once loaded
        }
      },
      { rootMargin: "100px" } // Load slightly before it enters viewport
    );

    const iframe = document.getElementById(`iframe-${youtubeId}`);
    if (iframe) observer.observe(iframe);

    return () => observer.disconnect();
  }, [youtubeId]);

  return (
    <div className="relative h-56 w-full overflow-hidden">
      {isVisible ? (
        <iframe
          id={`iframe-${youtubeId}`}
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <div
          id={`iframe-${youtubeId}`}
          className="w-full h-full bg-gray-200 animate-pulse"
        />
      )}
    </div>
  );
});
TutorialIframe.displayName = "TutorialIframe";

const TutorialCard = memo(
  ({ title, description, category, level, youtubeId }: TutorialCardProps) => {
    return (
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-200">
        <TutorialIframe youtubeId={youtubeId} title={title} />
        <div className="p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="inline-block px-2 py-1 text-xs bg-amber-500 text-white font-medium rounded-full shadow-md">
              {category}
            </span>
            <span className="flex items-center text-sm text-gray-500">
              <FaGraduationCap className="mr-1 text-amber-500" />
              {level}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
          <div className="flex justify-between items-center">
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border-2 border-amber-500 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-500 hover:text-white transition-all duration-300"
            >
              Start Learning
              <FaRocket className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    );
  }
);
TutorialCard.displayName = "TutorialCard";

const Page = memo(() => {
  const featuredTutorials = [
    {
      title: "Building a Next.js Blog",
      description: "Create a blog with Next.js and Tailwind CSS.",
      category: "Next.js",
      level: "Intermediate",
      youtubeId: "zcYM_Gqoph4",
      slug: "building-nextjs-blog",
    },
    {
      title: "Mastering Tailwind CSS",
      description: "Build beautiful interfaces with Tailwind CSS.",
      category: "CSS",
      level: "Beginner",
      youtubeId: "dutyOc_cAEU",
      slug: "mastering-tailwind",
    },
    {
      title: "React Hooks Deep Dive",
      description: "Master React Hooks for modern apps.",
      category: "React",
      level: "Advanced",
      youtubeId: "TNhaISOUy6Q",
      slug: "react-hooks-deep-dive-1",
    },
    {
      title: "React Hooks Deep Dive",
      description: "Master React Hooks for modern apps.",
      category: "React",
      level: "Advanced",
      youtubeId: "Q50jSglX0hA",
      slug: "react-hooks-deep-dive-2",
    },
    {
      title: "React Hooks Deep Dive",
      description: "Master React Hooks for modern apps.",
      category: "React",
      level: "Advanced",
      youtubeId: "dZyQNy3-HjU",
      slug: "react-hooks-deep-dive-3",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4 sm:px-6 lg:px-20 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] opacity-20 bg-cover bg-center" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
            <span className="flex items-center gap-2">
              <FaRocket className="animate-pulse" /> Learn & Grow
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Explore Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Tutorials
            </span>
          </h1>
          <p className="text-lg max-w-2xl mb-8">
            Step-by-step guides to master web development, from beginner to
            advanced.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#latest-tutorials"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 group"
            >
              <FaBook className="group-hover:rotate-12 transition-transform" />
              Latest Posts
            </Link>
            <Link
              href="#categories"
              className="px-6 py-3 border-2 border-amber-500 text-amber-400 rounded-lg font-medium hover:bg-amber-500/10 transition-colors flex items-center gap-2 group"
            >
              <FaCode className="group-hover:translate-x-1 transition-transform" />
              Browse Categories
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Tutorials */}
        <section id="latest-tutorials" className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.youtubeId} {...tutorial} />
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-8 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] opacity-20 bg-cover bg-center" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500 rounded-full blur-3xl opacity-20" />

          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-4">Stay Updated</h1>
            <p className="mb-6 max-w-2xl">
              Subscribe for new tutorials, tips, and resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-amber-500 w-full sm:w-auto sm:flex-1"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});
Page.displayName = "TutorialsPage";

export default Page;
