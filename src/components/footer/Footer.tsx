import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaLinkedin,
  FaSquareYoutube,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa6";
import { siteConfig } from "@/lib/siteConfig";

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
  bgColor: string;
}

interface FooterLinkProps {
  href: string;
  text: string;
  small?: boolean;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src={siteConfig.logoPath}
                alt={`${siteConfig.name} Logo`}
                width={180}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-600 mb-4">
              {siteConfig.description}
            </p>
            <div className="flex space-x-3">
              <SocialIcon
                href={siteConfig.social.youtube}
                icon={<FaSquareYoutube />}
                bgColor="bg-red-600"
              />
              <SocialIcon
                href={siteConfig.social.instagram}
                icon={<FaInstagram />}
                bgColor="bg-pink-600"
              />
              <SocialIcon
                href={siteConfig.social.twitter}
                icon={<FaTwitter />}
                bgColor="bg-blue-500"
              />
              <SocialIcon
                href={siteConfig.social.linkedin}
                icon={<FaLinkedin />}
                bgColor="bg-blue-700"
              />
            </div>
          </div>
          {/* Quick Links */}{" "}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Links
            </h3>{" "}
            <ul className="space-y-2 !list-none">
              <FooterLink href="/tutorials" text="Tutorials" />{" "}
              <FooterLink href="/projects" text="Projects" />
              <FooterLink href="/blog" text="Blog" />{" "}
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/contact" text="Contact" />{" "}
            </ul>
          </div>
          {/* Categories */}{" "}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>{" "}
            <ul className="space-y-2 !list-none">
              <FooterLink href="/category/frontend" text="Frontend" />{" "}
              <FooterLink href="/category/backend" text="Backend" />
              <FooterLink href="/category/javascript" text="JavaScript" />{" "}
              <FooterLink href="/category/react" text="React" />
              <FooterLink href="/category/nextjs" text="Next.js" />{" "}
            </ul>
          </div>
          {/* Newsletter */}{" "}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Newsletter</h3>{" "}
            <p className="text-gray-600 mb-4">
              Subscribe to get the latest updates and news.{" "}
            </p>
            <form className="space-y-3">
              {" "}
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500"
                required
              />{" "}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
              >
                {" "}
                Subscribe
              </button>{" "}
            </form>
          </div>{" "}
        </div>
        {/* Divider */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          {" "}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              {" "}
              © {currentYear} {siteConfig.name}. All rights reserved.
            </p>{" "}
            <div className="flex space-x-6 !list-none">
              <FooterLink href="/privacy" text="Privacy Policy" small />{" "}
              <FooterLink href="/terms" text="Terms of Service" small />
              <FooterLink href="/sitemap" text="Sitemap" small />{" "}
            </div>
          </div>{" "}
        </div>
      </div>{" "}
    </footer>
  );
};
// Helper Components
const SocialIcon = ({ href, icon, bgColor }: SocialIconProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`${bgColor} text-white p-2 rounded-full hover:opacity-90 transition-opacity`}
  >
    {" "}
    {icon}
  </a>
);
const FooterLink = ({ href, text, small = false }: FooterLinkProps) => (
  <li>
    {" "}
    <Link
      href={href}
      className={`text-gray-600 hover:text-amber-500 transition-colors ${
        small ? "text-sm" : ""
      }`}
    >
      {" "}
      {text}
    </Link>{" "}
  </li>
);

export default Footer;
