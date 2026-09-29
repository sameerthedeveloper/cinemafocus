import { getPressReleases } from '@/lib/cms';
import PressClient from './PressClient';

export const metadata = {
  title: "Press Room",
  description: "Latest news, product launches, and press releases from Cinema Focus — your source for premium audio industry updates.",
  keywords: "Cinema Focus news, audio press releases, home cinema announcements, product launches",
};

export default async function PressPage() {
  const releases = await getPressReleases();
  return <PressClient initialReleases={releases} />;
}
