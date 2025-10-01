import { Metadata } from 'next';
import InshortsClient from './inshorts-client';

export const metadata: Metadata = {
  title: 'Quick Reads | The Cliff News',
  description: 'Get the latest news in 60 words or less. Quick, digestible news stories for busy readers.',
  openGraph: {
    title: 'Quick Reads - Latest News in 60 Words | The Cliff News',
    description: 'Get the latest news in 60 words or less. Quick, digestible news stories for busy readers.',
    type: 'website',
  },
};

export default function InshortsPage() {
  return <InshortsClient />;
}