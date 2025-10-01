import { Metadata } from 'next';
import VideosClient from './videos-client';

export const metadata: Metadata = {
  title: 'Video Bytes | The Cliff News',
  description: 'Watch the latest news videos, breaking stories, and exclusive content from The Cliff News video team.',
  openGraph: {
    title: 'Video Bytes - Latest News Videos | The Cliff News',
    description: 'Watch the latest news videos, breaking stories, and exclusive content from The Cliff News video team.',
    type: 'website',
  },
};

export default function VideosPage() {
  return <VideosClient />;
}