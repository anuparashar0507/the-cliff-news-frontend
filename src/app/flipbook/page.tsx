import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import FlipBookClient from './flipbook-client';

interface PageProps {
  searchParams: { pdf?: string; lang?: string };
}

export const metadata: Metadata = {
  title: 'E-Paper Viewer | The Cliff News',
  description: 'Read The Cliff News digital edition in flipbook format. Available in English and Hindi.',
};

export default function FlipBookPage({ searchParams }: PageProps) {
  const pdfFile = searchParams.pdf || 'CondoLiving.pdf';
  const language = searchParams.lang || 'english';

  return <FlipBookClient pdfFile={pdfFile} language={language} />;
}