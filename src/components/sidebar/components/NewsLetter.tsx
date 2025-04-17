import React from "react";

const NewsLetter = () => {
  return (
    <div className="bg-white px-2 sm:px-4 py-3 sm:py-4 rounded-xl space-y-2">
      <h1>Stay Updated</h1>
      <p>
        Join the buzz—sign up for exclusive updates that’ll keep you ahead of
        the curve!
      </p>

      <input
        type="email"
        name="email"
        id="email"
        placeholder="Your Email"
        className="my-4 shadow-2xs shadow-black bg-[#f8f8f9] text-gray-900"
      />

      <button className="px-4 py-2 bg-[#fe9a1e] w-full text-black rounded-lg font-medium text-lg">
        Subscribe
      </button>
    </div>
  );
};

export default NewsLetter;
