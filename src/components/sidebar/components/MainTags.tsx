import React from "react";

const MainTags = () => {
  const pupularTags = [
    "frontend",
    "backend",
    "fullstack",
    "web development",
    "web design",
    "react",
    "javascript",
    "css",
    "html",
    "node.js",
    "next.js",
  ];

  return (
    <div className="bg-white px-3 py-4 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
        Popular Tags
      </h1>

      <div className="flex flex-wrap gap-2">
        {pupularTags.map((tag, index) => (
          <button
            key={index}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-amber-100 hover:text-amber-700 rounded-full transition-all duration-200 border border-gray-200"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainTags;
