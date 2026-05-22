import React from 'react';
import Section from '@/components/Section';
import LazyImage from '@/components/LazyImage';
import { createClient } from '@/lib/supabase/server';
import { getPhilosophy } from '@/lib/db';

export const metadata = {
  title: "About",
  description: "We are more than just a retailer — we are a destination for those who seek to experience music and film exactly as the artist intended. Visit our showroom in Chennai, India.",
  keywords: "about Cinema Focus, premium audio showroom, hi-fi retailer Chennai, home cinema specialist",
};

export default async function AboutPage() {
  const supabase = await createClient();
  const data = await getPhilosophy(supabase);

  // Fallbacks if data is missing or incomplete
  const title = data?.title || "About Cinema Focus";
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

  return (
    <div className="animate-fade-in pt-10">
      <Section className="py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">{title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {intro}
        </p>
      </Section>

      <Section background="bg-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <LazyImage 
              src={philosophyImage} 
              alt={philosophyTitle} 
              aspectRatio="aspect-[4/3]"
              containerClassName="rounded-2xl bg-white shadow-sm"
              className="object-cover"
           />
           <div className="space-y-6">
             <h2 className="text-3xl font-medium tracking-tight text-primary">{philosophyTitle}</h2>
             {philosophyText1 && (
               <p className="text-muted-foreground leading-relaxed text-lg">
                 {philosophyText1}
               </p>
             )}
             {philosophyText2 && (
               <p className="text-muted-foreground leading-relaxed text-lg">
                 {philosophyText2}
               </p>
             )}
           </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div className="md:order-2 space-y-6">
             <h2 className="text-3xl font-medium tracking-tight text-primary">{experienceTitle}</h2>
             {experienceText && (
               <p className="text-muted-foreground leading-relaxed text-lg">
                 {experienceText}
               </p>
             )}
             {experienceBullets && experienceBullets.length > 0 && (
               <ul className="space-y-3 text-muted-foreground text-lg">
                 {experienceBullets.map((bullet, index) => (
                   <li key={index} className="flex items-center gap-3">
                     <span className="text-primary">✓</span> {bullet}
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
                containerClassName="rounded-2xl"
                className="object-cover"
             />
           </div>
        </div>
      </Section>
    </div>
  );
}

