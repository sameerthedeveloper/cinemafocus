import { notFound } from 'next/navigation';
import Section from '@/components/Section';
import JsonLd from '@/components/JsonLd';
import { getAeoGeoResolved } from '@/lib/aeoGeo';
import { buildMetadata } from '@/lib/metadata';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';

export async function generateMetadata() {
  const { faqs } = await getAeoGeoResolved();
  return buildMetadata({
    title: 'Frequently Asked Questions | Cinema Focus Chennai',
    description:
      'Answers to common questions about Cinema Focus: our Chennai hi-fi and home cinema showroom, brands, demonstrations, installation and enquiries.',
    path: '/faq',
    noindex: faqs.length === 0,
  });
}

export default async function FaqPage() {
  const { faqs } = await getAeoGeoResolved();
  if (faqs.length === 0) notFound();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }])} />
      <JsonLd data={faqSchema(faqs)} />
      <Section className="py-20 pt-32 min-h-screen">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-12 text-center">Frequently Asked Questions</h1>
        <div className="max-w-3xl mx-auto space-y-10">
          {faqs.map((f, i) => (
            <div key={i} className="space-y-3">
              <h2 className="text-xl md:text-2xl font-medium">{f.question}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">{f.answer}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
