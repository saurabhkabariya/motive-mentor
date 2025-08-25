import { pages, getStructuredData } from '../seo';
import GoalsClient from './GoalsClient';

export const metadata = {
  title: pages.goals.title,
  description: pages.goals.description,
  keywords: pages.goals.keywords,
  openGraph: {
    title: pages.goals.title,
    description: pages.goals.description,
    type: 'website',
    images: [
      {
        url: '/og-goal-tracker.jpg',
        width: 1200,
        height: 630,
        alt: 'Goal Tracker & Habit Builder - MotiveMentor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pages.goals.title,
    description: pages.goals.description,
    images: ['/og-goal-tracker.jpg'],
  },
  alternates: {
    canonical: '/goals',
  },
};

export default function GoalsPage() {
  const structuredData = getStructuredData('goals');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <GoalsClient />
    </>
  );
}
