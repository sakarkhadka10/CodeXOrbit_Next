import React from "react";
import Image from "next/image";
import Link from "next/link";
import SideBar from "@/components/sidebar/SideBar";
import { siteConfig } from "@/lib/siteConfig";
import {
  FaRocket,
  FaLaptopCode,
  FaTools,
  FaLightbulb,
  FaInstagram,
} from "react-icons/fa";

interface OrbitFeatureProps{
    title: string;
    description: string;
    icon: React.ReactNode;
}

export default function AboutPage() {
  return (
    <div className="min-h-screen mx-2 sm:mx-8 md:mx-12 lg:mx-16 bg-[#f8fafc] mt-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 place-items-start gap-4 pb-16 px-1 sm:px-4 md:px-6 lg:px-20">
        <section className="col-span-1 lg:col-span-9 w-full">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            {/* Hero Section */}
            <div className="mb-12 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                About <span className="text-amber-500">{siteConfig.name}</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Your stellar hub for web projects, coding adventures, and all
                things development
              </p>
            </div>

            {/* Welcome Section */}
            <div className="mb-12">
              <div className="relative h-64 md:h-80 w-full mb-8 rounded-xl overflow-hidden">
                <Image
                  src="https://i.pinimg.com/originals/90/70/32/9070324cdfc07c68d60eed0c39e77573.gif"
                  alt="Welcome to CodeX Orbit"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Greetings, Cosmic Coders!
              </h1>
              <p className="text-gray-700 mb-4">
                Welcome to {siteConfig.name}! I'm {siteConfig.developerName},
                the mastermind behind this stellar hub for web projects, coding
                adventures, and all things development. Powered by AlienX
                Studio, this is your launchpad for crafting out-of-this-world
                websites and mastering the digital universe.
              </p>
            </div>

            {/* Who Am I Section */}
            <div className="mb-12 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="hidden lg:block w-32 h-32 relative rounded-full overflow-hidden border-4 border-amber-500">
                  <Image
                    src="https://i.pinimg.com/originals/90/70/32/9070324cdfc07c68d60eed0c39e77573.gif"
                    alt="Founder"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Who Am I?
                  </h1>
                  <p className="text-gray-700">
                    I'm {siteConfig.developerName}, the orbit's chief navigator
                    and a passionate web developer with years of experience in
                    coding, designing, and dreaming up digital solutions. My
                    mission? To beam up knowledge, simplify the complex, and
                    help you—whether you're a rookie stargazer or a seasoned
                    dev—thrive in the wild expanse of web development.
                  </p>
                </div>
              </div>
            </div>

            {/* What's in Orbit Section */}
            <div className="mb-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                What's in Orbit Here?
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OrbitFeature
                  title="Galactic Tutorials"
                  description="Step-by-step guides on everything from HTML basics to JavaScript wizardry and beyond."
                  icon={<FaRocket className="text-amber-500 text-2xl" />}
                />
                <OrbitFeature
                  title="Design Signals"
                  description="Pro tips to create sleek, user-friendly websites that shine across the galaxy."
                  icon={<FaLaptopCode className="text-amber-500 text-2xl" />}
                />
                <OrbitFeature
                  title="Tech Arsenal"
                  description="Handpicked tools, libraries, and resources to supercharge your coding journey."
                  icon={<FaTools className="text-amber-500 text-2xl" />}
                />
                <OrbitFeature
                  title="Cosmic Insights"
                  description="Fresh takes on trends, tricks, and best practices in the ever-evolving dev universe."
                  icon={<FaLightbulb className="text-amber-500 text-2xl" />}
                />
              </div>
            </div>

            {/* Social Media Section */}
            <div className="mb-12 bg-gradient-to-r from-purple-100 to-amber-50 p-6 rounded-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Catch Me on Instagram
                  </h1>
                  <p className="text-gray-700">
                    Orbiting social media too! Follow me @CodeXOrbit for
                    bite-sized tips, project peeks, and daily doses of dev
                    inspiration straight from the cosmos.
                  </p>
                </div>
                <Link
                  href="https://instagram.com/CodeXOrbit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <FaInstagram className="text-xl" />
                  <span>@CodeXOrbit</span>
                </Link>
              </div>
            </div>

            {/* Let's Link Up Section */}
            <div className="mb-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Let's Link Up!
              </h1>
              <p className="text-gray-700 mb-4">
                Whether you're just stepping into the coding void or fine-tuning
                your interstellar skills,
                {siteConfig.name} is your co-pilot. Got questions, ideas, or
                just want to chat code? Reach out—I'm all about connecting with
                fellow explorers in this digital frontier.
              </p>
              <p className="text-gray-700 mb-6">
                Thanks for landing at {siteConfig.name}. Let's code something
                extraordinary together!
              </p>
              <div className="italic text-gray-700">
                <p>Cheers from the cosmos,</p>
                <p className="font-medium">{siteConfig.developerName}</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl">
              <h1 className="text-2xl font-bold mb-4">
                Ready to Launch Your Coding Journey?
              </h1>
              <p className="mb-6">
                Explore our tutorials, projects, and resources to elevate your
                development skills to cosmic heights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tutorials"
                  className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors text-center"
                >
                  Explore Tutorials
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 border-2 border-amber-500 text-amber-500 rounded-lg font-medium hover:bg-amber-900/10 transition-colors text-center"
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <section className="col-span-1 lg:col-span-3 w-full">
          <SideBar />
        </section>
      </div>
    </div>
  );
}

// Helper Components
const OrbitFeature = ({ title, description, icon }: OrbitFeatureProps) => (
  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex gap-4">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);
