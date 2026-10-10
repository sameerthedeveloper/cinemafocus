import { notFound, permanentRedirect } from 'next/navigation';
import { findPressRelease, seoTitle, seoDescription } from '@/lib/seo';
import { buildMetadata, pickTitle } from '@/lib/metadata';
import { breadcrumbSchema, newsArticleSchema } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';
import PressDetailClient from './PressDetailClient';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const release = await findPressRelease(id);

  if (!release) {
    return { title: 'Press Release Not Found', robots: { index: false, follow: false } };
  }

  const title =
    seoTitle(release) ||
    pickTitle(`${release.title} | Cinema Focus Press Room`, `${release.title} | Cinema Focus`, release.title);
  const description =
    seoDescription(release) || release.excerpt || `${release.title}. News from Cinema Focus, Chennai.`;

  return buildMetadata({
    title,
    description,
    path: `/press/${release.slug || id}`,
    image: release.imageUrl || release.coverImages?.[0],
    imageAlt: release.title,
    type: 'article',
    publishedTime: release.date || release.created_at,
    modifiedTime: release.updated_at,
  });
}

export default async function PressReleaseDetailPage({ params }) {
  const { id } = await params;
  const release = await findPressRelease(id);

  if (!release) notFound();

  // Legacy UUID URL -> slug URL (308)
  if (release.slug && release.slug !== id) {
    permanentRedirect(`/press/${release.slug}`);
  }

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Press Room', path: '/press' },
          { name: release.title, path: `/press/${release.slug}` },
        ])}
      />
      <JsonLd data={newsArticleSchema(release)} />
      <PressDetailClient release={release} />
    </>
  );
}
