import { Metadata } from 'next';
import NITClient from './nit-client';

export const metadata: Metadata = {
  title: 'News In Time (NIT) | The Cliff News',
  description: 'Stay updated with real-time news updates and breaking stories. Quick news bites delivered as they happen.',
  openGraph: {
    title: 'News In Time (NIT) - Real-time Updates | The Cliff News',
    description: 'Stay updated with real-time news updates and breaking stories. Quick news bites delivered as they happen.',
    type: 'website',
  },
};

export default function NITPage() {
  return <NITClient />;
}