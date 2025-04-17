import React from "react";
import {
  FaLinkedin,
  FaSquareYoutube,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa6";

interface SingleSocialProps {
  icon: React.ReactNode;
  count: string;
  bg: string;
  text: string;
  name: string;
}

const Socials = () => {
  const socials = [
    {
      name: "Youtube",
      icon: <FaSquareYoutube className="text-xl" />,
      count: "56K",
      bg: "bg-red-600 hover:bg-red-700",
      text: "text-white",
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="text-xl" />,
      count: "56K",
      bg: "bg-pink-600 hover:bg-pink-700",
      text: "text-white",
    },
    {
      name: "Twitter",
      icon: <FaTwitter className="text-xl" />,
      count: "56K",
      bg: "bg-blue-500 hover:bg-blue-600",
      text: "text-white",
    },
    {
      name: "Linkedin",
      icon: <FaLinkedin className="text-xl" />,
      count: "56K",
      bg: "bg-blue-700 hover:bg-blue-800",
      text: "text-white",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h1 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
        Follow Us
      </h1>
      <div className="grid grid-cols-2 gap-3">
        {socials.map((social, index) => (
          <SingleSocial key={index} {...social} />
        ))}
      </div>
    </div>
  );
};

export default Socials;

const SingleSocial = ({ icon, count, bg, text, name }: SingleSocialProps) => {
  return (
    <button
      aria-label={`Follow on ${name}`}
      className={`${bg} ${text} cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow`}
    >
      {icon}
      <span className="font-medium">{count}</span>
    </button>
  );
};
