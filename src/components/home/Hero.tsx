import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { FaRocket, FaCode } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-2">
              <span className="flex items-center gap-2">
                <FaRocket className="animate-pulse" /> Launch Your Coding
                Journey
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Explore The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Coding Universe
              </span>{" "}
              With {siteConfig.name}
            </h1>
            <span className="text-base text-[1rem] font-normal text-white  mx-auto text-shadow-2xs">
              {siteConfig.description} Blast off into a world of tutorials,
              projects, and resources designed to elevate your development
              skills.
            </span>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="#projects"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group"
              >
                <FaCode className="group-hover:rotate-90 transition-transform" />
                <span>Explore Projects</span>
              </Link>
              <Link
                href="#tutorials"
                className="px-6 py-3 border-2 border-amber-500 text-amber-400 rounded-lg font-medium hover:bg-amber-500/10 transition-colors text-center flex items-center justify-center gap-2 group"
              >
                <FaRocket className="group-hover:translate-x-1 transition-transform" />
                <span>Browse Tutorials</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700 mt-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-amber-400">
                  50+
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
                  Tutorials
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-amber-400">
                  100+
                </div>
                <div className="text-xs sm:text-sm text-gray-300">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-amber-400">
                  10k+
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
                  Developers
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 mx-auto max-w-md lg:max-w-none">
              <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] opacity-20"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500 rounded-full filter blur-3xl opacity-20"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>

              <Image
                src="/img/hero-image.png"
                alt={`${siteConfig.name} Coding Illustration`}
                width={600}
                height={400}
                className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-lg relative z-10"
                priority
              />

              <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg border border-gray-700 z-20">
                <div className="text-xs text-gray-300">Powered by</div>
                <div className="text-xs sm:text-sm font-medium text-amber-400">
                  {siteConfig.author}
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-0 right-0 md:-top-2 md:-right-2 z-40 bg-amber-500 p-2 sm:p-3 rounded-full shadow-lg animate-bounce hidden md:block">
              <FaCode className="text-white text-lg sm:text-xl" />
            </div>
            <div className="absolute bottom-0 left-0 md:-bottom-4 md:-left-4 bg-purple-600 p-2 sm:p-3 rounded-full shadow-lg animate-pulse hidden md:block">
              <FaRocket className="text-white text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
