import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  return [];
}

export default function Page() {
  // Redirect to English version by default
  redirect('/en');
}