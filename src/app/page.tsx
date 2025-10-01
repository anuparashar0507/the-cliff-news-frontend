import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect to English version by default
  redirect('/en');
}