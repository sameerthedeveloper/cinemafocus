import { getPressReleases } from '@/lib/cms';
import PressClient from './PressClient';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Press Room | Cinema Focus',
  description: 'Latest news, product launches, and press releases from Cinema Focus, your source for premium hi-fi and home cinema industry updates.',
  path: '/press',
});

export default async function PressPage() {
  const releases = await getPressReleases();
  return <PressClient initialReleases={releases} />;
}
