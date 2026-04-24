import { getPressReleases } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import PressClient from './PressClient';

export const metadata = {
  title: "Press Room",
  description: "Latest news, product launches, and press releases from Cinema Focus — your source for premium audio industry updates.",
  keywords: "Cinema Focus news, audio press releases, home cinema announcements, product launches",
};

export default async function PressPage() {
  const supabase = await createClient();
  const releases = await getPressReleases(supabase);
  return <PressClient initialReleases={releases} />;
}
