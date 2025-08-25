import { pages, getStructuredData } from "./seo";
import LandingPageClient from "./LandingPageClient";

export const metadata = {
  title: pages.home.title,
  description: pages.home.description,
  keywords: pages.home.keywords,
  openGraph: {
    title: pages.home.title,
    description: pages.home.description,
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "MotiveMentor - Daily Motivation & Goal Tracking Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pages.home.title,
    description: pages.home.description,
    images: ["/og-home.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getStructuredData('home')),
        }}
      />
      <LandingPageClient />
    </>
  );
}
