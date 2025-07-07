import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerProvider } from "../components/providers/ServiceWorkerProvider";

export const metadata: Metadata = {
  title: {
    default: "Node.js Interview Prep | Senior Backend Engineering Guide",
    template: "%s | Node.js Interview Prep"
  },
  description: "Master Node.js, databases, system design, and DevOps with our comprehensive interview preparation platform. 300+ questions, real-world examples, interactive flashcards, and expert insights for senior backend engineers (5+ years experience).",
  keywords: [
    "Node.js interview preparation",
    "backend engineering interviews", 
    "senior developer interviews",
    "JavaScript interviews",
    "Express.js interview questions",
    "database interview questions",
    "system design interviews",
    "DevOps interviews",
    "microservices interviews",
    "SQL interview questions",
    "NoSQL interview questions",
    "Docker interviews",
    "Kubernetes interviews",
    "technical interview preparation",
    "software architecture interviews",
    "design patterns interviews",
    "performance optimization",
    "scalability interviews"
  ],
  authors: [{ name: "Node.js Interview Prep Team" }],
  creator: "Node.js Interview Prep Team",
  publisher: "Node.js Interview Prep",
  category: "Education",
  classification: "Technical Interview Preparation",
  
  // Open Graph metadata for social sharing
  openGraph: {
    title: "Node.js Interview Prep | Senior Backend Engineering Guide",
    description: "Comprehensive interview preparation platform for senior backend engineers. Master Node.js, databases, system design, DevOps with 300+ questions and real-world examples.",
    url: "https://nodejs-interview-prep.com",
    siteName: "Node.js Interview Prep",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Node.js Interview Preparation - Comprehensive Backend Engineering Guide",
        type: "image/png",
      }
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@nodejs_interview",
    creator: "@nodejs_interview",
    title: "Node.js Interview Prep | Senior Backend Engineering Guide",
    description: "Master backend engineering interviews with comprehensive study materials, 300+ questions, and real-world examples for senior developers.",
    images: ["/twitter-card.png"],
  },
  
  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification and analytics
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  
  // App-specific metadata
  applicationName: "Node.js Interview Prep",
  referrer: "origin-when-cross-origin",
  
  // Manifest and icons
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-touch-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#0f172a"
      }
    ]
  },
  
  // Additional structured data
  other: {
    "msapplication-TileColor": "#0f172a",
    "msapplication-config": "/browserconfig.xml",
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Additional meta tags for better SEO and functionality */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Node.js Interview Prep" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for potential external resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//unpkg.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/sw.js" as="script" />
        
        {/* Critical CSS for loading states */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .loading-skeleton { 
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }
            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            .fade-in {
              animation: fadeIn 0.3s ease-in-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `
        }} />
        
        {/* Canonical URL - will be set dynamically per page */}
        <link rel="canonical" href="https://nodejs-interview-prep.com" />
        
        {/* Additional structured data for rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Node.js Interview Prep",
              "description": "Comprehensive interview preparation platform for senior backend engineers",
              "url": "https://nodejs-interview-prep.com",
              "sameAs": [
                "https://github.com/nodejs-interview-prep",
                "https://twitter.com/nodejs_interview"
              ],
              "educationalCredentialAwarded": "Interview Preparation Certificate",
              "teaches": [
                "Node.js",
                "Backend Engineering",
                "System Design",
                "Database Design",
                "DevOps",
                "Microservices Architecture"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased font-sans bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        
        <ServiceWorkerProvider>
          <div id="root">
            {children}
          </div>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
