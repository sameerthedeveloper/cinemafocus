import JsonLd from '@/components/JsonLd';
import { webPageSchema } from '@/lib/schema';
import { getFooter } from '@/lib/cms';
import ContactClient from './ContactClient';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Contact & Visit Our Showroom | Cinema Focus Chennai',
  description: 'Ready to elevate your home audio experience? Visit the Cinema Focus showroom in Mylapore, Chennai, or send us a message for expert consultation.',
  path: '/contact',
});

export default async function ContactPage() {
  const info = await getFooter();
  return (
    <>
      <JsonLd data={webPageSchema({ path: '/contact', name: metadata.title.absolute, description: metadata.description, type: 'ContactPage' })} />
      <ContactClient initialInfo={info} />
    </>
  );
}
