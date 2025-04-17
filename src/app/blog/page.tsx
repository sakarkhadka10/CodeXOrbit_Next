import { Suspense } from "react";
import Image from "next/image";
import BlogPosts from "@/components/blog/BlogPosts";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: `Blog | ${siteConfig.name}`,
  description:
    "Explore our latest insights, tutorials, and coding adventures in web development",
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description:
      "Explore our latest insights, tutorials, and coding adventures in web development",
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#f8fafc] mt-14 pb-16">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 lg:h-96 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-amber-500 opacity-90"></div>
        <Image
          src="/img/hero-image.png"
          alt="Blog Hero"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            CodeX Orbit Blog
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Explore our latest insights, tutorials, and coding adventures
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          }
        >
          <BlogPosts />
        </Suspense>
      </div>
    </div>
  );
}
