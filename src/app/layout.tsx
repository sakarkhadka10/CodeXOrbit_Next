import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/header/NavBar";
import Footer from "@/components/footer/Footer";
import FastLoadingBar from "@/components/ui/FastLoadingBar";
import { WebsiteSchema } from "@/components/seo/SchemaOrg";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CodeXOrbit - Programming Blog and Tutorials",
    template: "%s | CodeXOrbit"
  },
  description: "Explore programming tutorials, coding tips, and tech insights on CodeXOrbit. Learn web development, mobile app development, and more.",
  keywords: ["programming", "coding", "web development", "tutorials", "tech blog", "software development", "JavaScript", "React", "Next.js"],
  authors: [{ name: "CodeXOrbit Team" }],
  creator: "CodeXOrbit",
  publisher: "CodeXOrbit",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "CodeXOrbit - Programming Blog and Tutorials",
    description: "Explore programming tutorials, coding tips, and tech insights on CodeXOrbit. Learn web development, mobile app development, and more.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com',
    siteName: "CodeXOrbit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CodeXOrbit - Programming Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeXOrbit - Programming Blog and Tutorials",
    description: "Explore programming tutorials, coding tips, and tech insights on CodeXOrbit.",
    creator: "@codexorbit",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification tokens here
    google: process.env.GOOGLE_SITE_VERIFICATION || 'default_verification_token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap"
          as="style"
        />
        {/* Preload critical CSS */}
        <link rel="preload" href="/styles/critical.css" as="style" />
        <link rel="stylesheet" href="/styles/critical.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8fafc] `}
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        <WebsiteSchema />
        <FastLoadingBar />
        <AuthProvider>
          <NavBar/>
          {children}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
