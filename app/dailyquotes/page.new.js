import { pages, getStructuredData } from '../seo';
import DailyQuotesClient from './DailyQuotesClient';

export const metadata = {
  title: pages.dailyQuotes.title,
  description: pages.dailyQuotes.description,
  keywords: pages.dailyQuotes.keywords,
  openGraph: {
    title: pages.dailyQuotes.title,
    description: pages.dailyQuotes.description,
    type: 'website',
    images: [
      {
        url: '/og-daily-quotes.jpg',
        width: 1200,
        height: 630,
        alt: 'Daily Motivational Quotes - MotiveMentor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pages.dailyQuotes.title,
    description: pages.dailyQuotes.description,
    images: ['/og-daily-quotes.jpg'],
  },
  alternates: {
    canonical: '/dailyquotes',
  },
};

export default function DailyQuotesPage() {
  const structuredData = getStructuredData('dailyQuotes');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <DailyQuotesClient />
    </>
  );
}
