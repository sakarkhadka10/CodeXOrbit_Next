import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaArrowRight } from "react-icons/fa";

interface BlogPostCardProps {
  title: string;
  description: string;
  author: string;
  date: string;
  coverImage: string;
  slug: string;
  category: string;
}

const BlogPostCard = ({
  title,
  description,
  author,
  date,
  coverImage,
  slug,
  category,
}: BlogPostCardProps) => {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
      <article className="border border-[#e3e3ff] overflow-hidden rounded-xl">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image container */}
          <Link href={`/${slug}`} className="block w-full md:w-2/5 overflow-hidden">
            <div className="aspect-[16/9] w-full h-56 md:h-full relative">
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="absolute left-4 top-4 px-3 py-1.5 text-sm bg-amber-500 text-white font-medium text-center rounded-full shadow-md">
                {category}
              </span>
            </div>
          </Link>
          
          {/* Content container */}
          <div className="md:w-3/5 p-5 md:p-6 flex flex-col">
            <Link href={`/${slug}`} className="group/title">
              <h1 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 group-hover/title:text-amber-600 transition-colors line-clamp-2">
                {title}
              </h1>
            </Link>
            
            <p className="text-base text-gray-600 mb-4 line-clamp-3">{description}</p>
            
            <div className="mt-auto">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center mr-4">
                  <FaUser className="mr-1.5 text-amber-500" />
                  <span>{author}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1.5 text-amber-500" />
                  <span>{date}</span>
                </div>
              </div>
              
              <Link href={`/${slug}`} className="inline-flex items-center gap-1 px-4 py-2 bg-white border-2 border-amber-500 text-amber-600 rounded-lg text-sm font-medium group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                Read More
                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostCard;
