import JsonLd from '@/components/JsonLd';
import { webPageSchema } from '@/lib/schema';
import React from 'react';
import Button from '@/components/Button';
import { Check } from 'lucide-react';
import { CINEMA_FOCUS_GEO as geo } from '@/lib/geoContext';
import LazyImage from '@/components/LazyImage';
import { getPhilosophy } from '@/lib/cms';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'About Cinema Focus | Hi-Fi & Home Cinema, Chennai',
  description: 'We are more than just a retailer: a destination for those who seek to experience music and film exactly as the artist intended. Visit our showroom in Chennai, India.',
  path: '/about',
});

export default async function AboutPage() {
  const data = await getPhilosophy();

  // Fallbacks if data is missing or incomplete
  // The CMS title can equal the philosophy heading ("Our Philosophy"), which would repeat
  // as both h1 and h2; fall back to the page name in that case.
  const title = data?.title && data.title !== data?.philosophyTitle ? data.title : "About Cinema Focus";
  const intro = data?.intro || "We are more than just a retailer; we are a destination for those who seek to experience music and film exactly as the artist intended.";
  
  const philosophyTitle = data?.philosophyTitle || "Our Philosophy";
  const philosophyText1 = data?.philosophyText1 || "At Cinema Focus, we believe that high-fidelity sound is a gateway to emotion. Whether it's the subtle breath of a vocalist or the thunderous roar of a cinematic explosion, every detail matters. Our curated selection represents the pinnacle of audio engineering.";
  const philosophyText2 = data?.philosophyText2 || "Founded in 2010, we have spent over a decade perfecting the art of system matching—pairing speakers, amplifiers, and sources that synergize to create magic.";
  const philosophyImage = data?.philosophyImage || "/images/hero-light.webp";
  
  const experienceTitle = data?.experienceTitle || "The Experience";
  const experienceText = data?.experienceText || "Our showroom is designed as a sanctuary for the senses. We invite you to bring your favorite music and get lost in the sound. Our expert consultants are here not to sell, but to guide you on your journey to sonic nirvana.";
  const experienceImage = data?.experienceImage || "/images/speakers.webp";
  const experienceBullets = data?.experienceBullets || [
    "Private Listening Rooms",
    "Expert Calibration Services",
    "Home Installation & Support"
  ];

  const fmt = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''}\u00A0${h >= 12 ? 'pm' : 'am'}`;
  };
  const facts = [
    { value: geo.locality, label: `Our showroom in ${geo.city}` },
    { value: `${fmt(geo.hours.weekday.open)} to ${fmt(geo.hours.weekday.close)}`, label: 'Monday to Saturday' },
    { value: 'Pan-India', label: 'Shipping available' },
  ];
  const actionClass = 'h-12 rounded-full px-7 normal-case! tracking-tight!';

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
      <JsonLd data={webPageSchema({ path: '/about', name: metadata.title.absolute, description: metadata.description, type: 'AboutPage' })} />

      <header className="max-w-3xl">
        <h1 className="text-4xl font-medium tracking-tight text-balance md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">{intro}</p>
      </header>

      {/* Facts */}
      <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-card bg-border sm:grid-cols-3 md:mt-14">
        {facts.map((f) => (
          <div key={f.label} className="bg-background px-6 py-6 md:py-8">
            <dd className="text-2xl font-medium tracking-tight md:text-3xl">{f.value}</dd>
            <dt className="mt-1 text-sm text-muted-foreground">{f.label}</dt>
          </div>
        ))}
      </dl>

      {/* Philosophy */}
      <section className="mt-16 grid grid-cols-1 items-center gap-8 md:mt-24 md:grid-cols-2 md:gap-14">
        <LazyImage
          src={philosophyImage}
          alt={philosophyTitle}
          aspectRatio="aspect-[4/3]"
          containerClassName="rounded-panel bg-secondary/40"
          className="object-cover"
        />
        <div className="max-w-xl space-y-5">
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">{philosophyTitle}</h2>
          {philosophyText1 && <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{philosophyText1}</p>}
          {philosophyText2 && <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{philosophyText2}</p>}
        </div>
      </section>

      {/* Experience */}
      <section className="mt-16 grid grid-cols-1 items-center gap-8 rounded-panel bg-secondary/40 p-6 md:mt-24 md:grid-cols-2 md:gap-14 md:p-12">
        <div className="max-w-xl space-y-5 md:order-2">
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">{experienceTitle}</h2>
          {experienceText && <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{experienceText}</p>}
          {experienceBullets && experienceBullets.length > 0 && (
            <ul className="space-y-3 pt-2">
              {experienceBullets.map((bullet, index) => (
                <li key={index} className="flex items-center gap-3 text-base md:text-lg">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="md:order-1">
          <LazyImage
            src={experienceImage}
            alt={experienceTitle}
            aspectRatio="aspect-[4/3]"
            containerClassName="rounded-card"
            className="object-cover"
          />
        </div>
      </section>

      {/* Next step */}
      <section className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-10 md:mt-24 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-medium tracking-tight md:text-3xl">Hear it for yourself</h2>
          <p className="mt-2 max-w-md text-muted-foreground">Visit the showroom in {geo.locality}, or send us a message and we will get back to you.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/location" icon className={actionClass}>Visit showroom</Button>
          <Button href="/contact" variant="outline" className={actionClass}>Contact us</Button>
        </div>
      </section>
    </div>
  );
}
