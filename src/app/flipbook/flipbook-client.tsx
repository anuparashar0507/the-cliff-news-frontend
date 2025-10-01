'use client';

import { useRouter } from 'next/navigation';
import SimplePDFViewer from '@/components/SimplePDFViewer';

interface FlipBookClientProps {
  pdfFile: string;
  language: string;
}

const FlipBookClient = ({ pdfFile, language }: FlipBookClientProps) => {
  const router = useRouter();

  const title = language === 'hindi' ? 'द क्लिफ न्यूज़ - हिंदी संस्करण' : 'The Cliff News - English Edition';
  const pdfUrl = `/sample-pdfs/${pdfFile}`;

  return (
    <SimplePDFViewer
      pdfUrl={pdfUrl}
      title={title}
      onClose={() => router.push('/')}
    />
  );
};

export default FlipBookClient;