import CountdownPage from '@/components/CountdownPage';

export default function LaunchPage({ params }) {
  return <CountdownPage slug={params.slug} />;
}
