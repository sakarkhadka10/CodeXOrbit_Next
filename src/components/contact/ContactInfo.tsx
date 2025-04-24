import React from 'react';
import { FaEnvelope, FaTwitter, FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa';
import { siteConfig } from '@/lib/siteConfig';

interface ContactInfoItemProps {
  icon: React.ReactNode;
  title: string;
  details: string | React.ReactNode;
}

export default function ContactInfo() {
  return (
    <div className="space-y-6 ">
      <h2 className="text-2xl font-bold !text-white">Get in Touch</h2>
      <p className="!text-gray-300">
        Have questions, feedback, or want to collaborate? Reach out to us using any of the methods below.
        We'd love to hear from you!
      </p>

      <div className="space-y-6 mt-8">
        <ContactInfoItem
          icon={<FaEnvelope />}
          title="Email"
          details={<a href={`mailto:contact@${siteConfig.url.replace('https://', '')}`} className="text-amber-400 hover:text-amber-300 transition-colors">contact@{siteConfig.url.replace('https://', '')}</a>}
        />

        <ContactInfoItem
          icon={<FaTwitter />}
          title="Twitter"
          details={<a href="https://twitter.com/codexorbit" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors">@codexorbit</a>}
        />

        <ContactInfoItem
          icon={<FaGithub />}
          title="GitHub"
          details={<a href="https://github.com/codexorbit" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors">github.com/codexorbit</a>}
        />

        <ContactInfoItem
          icon={<FaDiscord />}
          title="Discord Community"
          details={<a href="https://discord.gg/codexorbit" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors">Join our Discord</a>}
        />
      </div>

      <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <h3 className="font-medium text-amber-400">Quick Response</h3>
        <p className="!text-gray-300 text-sm mt-1">
          We aim to respond to all inquiries within 24-48 hours.
        </p>
      </div>
    </div>
  );
}

const ContactInfoItem = ({ icon, title, details }: ContactInfoItemProps) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center text-gray-900">
      {icon}
    </div>
    <div className="ml-4">
      <h3 className="text-lg font-medium text-amber-400">{title}</h3>
      <div className="mt-1 text-gray-300">{details}</div>
    </div>
  </div>
);
