import { inter, robotoMono } from "./fonts";
import "./globals.css";
import Navigation from "@/components/navigation";
import NavigationLoadingBar from "@/components/NavigationLoadingBar";
import PagePreloader from "@/components/PagePreloader";
import { ThemeProvider } from "./themecontext";
import ThemeWrapper from "@/components/ThemeWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Footer from "@/components/footer";
import { QuoteProvider } from "./quotecontext";
import { UserProvider } from "./usercontext";
import { OnboardingProvider } from "./onboardingContext";
import { AchievementProvider } from "./achievementContext";
import OnboardingTour from "@/components/OnboardingTour";
import PSAManager from "@/components/PSAManager";
import AuthModalContainer from "@/components/AuthModalContainer";
import FirebaseConnectionStatus from "@/components/FirebaseConnectionStatus";
import AchievementNotification from "@/components/AchievementNotification";
import AchievementsOverlay from "@/components/AchievementsOverlay";
import { Suspense } from "react";
import "@/app/utils/localStorage-patch";
import { siteConfig, getStructuredData } from "./seo";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: siteConfig.formatDetection,
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Daily Motivation & Personal Development Platform`,
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@motivementor",
    site: "@motivementor",
  },
  
  // Additional meta tags
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
  
  // Verification tags
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  
  // Category for better classification
  category: "lifestyle",
  
  // Language alternatives
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'en-US': siteConfig.url,
      'x-default': siteConfig.url,
    },
  },
};

export default function RootLayout({ children }) {
  const structuredData = getStructuredData('home');
  
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <head>
        <meta name="monetag" content="d6ef03b8c2b683319fba93a516a09715" />
        <meta name="google-site-verification" content="HKgvrxQDwRgmswOq7p_GoG2yId-fcWZkSjyAEGC_ASw" />
        
        {/* Structured Data */}
        {structuredData.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema),
            }}
          />
        ))}
        
        {/* Additional SEO meta tags */}
        <meta name="theme-color" content="#FF6F61" />
        <meta name="color-scheme" content="light dark" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MotiveMentor" />
        <meta name="application-name" content="MotiveMentor" />
        <meta name="msapplication-TileColor" content="#FF6F61" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={siteConfig.url} />
        
        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.name} - Daily Motivation Feed`}
          href={`${siteConfig.url}/feed.xml`}
        />
      </head>
      <body className="antialiased min-h-[100vh] font-sans">
        <UserProvider>
          <QuoteProvider>
            <ThemeProvider>
              <OnboardingProvider>
                <AchievementProvider>
                  <ThemeWrapper>
                    <NavigationLoadingBar />
                    <Navigation />
                    <PagePreloader />
                    <GoogleAnalytics />
                    <AuthModalContainer />
                    <FirebaseConnectionStatus />
                    <OnboardingTour />
                    <PSAManager />
                    <AchievementNotification />
                    <AchievementsOverlay />
                    {children}
                    <Footer />
                  </ThemeWrapper>
                </AchievementProvider>
              </OnboardingProvider>
            </ThemeProvider>
          </QuoteProvider>
        </UserProvider>
      </body>
    </html>
  );
}
