import { notFound, permanentRedirect } from 'next/navigation';
import { findPressRelease } from '@/lib/seo';
import PressDetailClient from './PressDetailClient';

export default async function PressReleaseDetailPage({ params }) {
  const { id } = await params;
  const release = await findPressRelease(id);

  if (!release) notFound();

  // Legacy UUID URL -> slug URL (308)
  if (release.slug && release.slug !== id) {
    permanentRedirect(`/press/${release.slug}`);
  }

  return <PressDetailClient release={release} />;
}
