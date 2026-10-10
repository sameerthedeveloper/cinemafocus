import CountdownPage from '@/components/CountdownPage';

export const metadata = { title: 'Coming soon', robots: { index: false, follow: true } };

export default function SoonPage() {
  return <CountdownPage slug="soon" />;
}
