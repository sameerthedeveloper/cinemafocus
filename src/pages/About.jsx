import React from 'react';
import Section from '../components/Section';
const heroImg = '/images/hero-light.png';
const speakersImg = '/images/speakers.png';

const About = () => {
  return (
    <div className="animate-fade-in">
      <Section className="py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">About Cinema Focus</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We are more than just a retailer; we are a destination for those who seek to experience music and film exactly as the artist intended.
        </p>
      </Section>

      <Section background="bg-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white">
             <img 
               src={heroImg} 
               alt="Our Showroom" 
               className="w-full h-full object-cover"
             />
           </div>
           <div className="space-y-6">
             <h2 className="text-3xl font-medium tracking-tight text-primary">Our Philosophy</h2>
             <p className="text-muted-foreground leading-relaxed text-lg">
               At Cinema Focus, we believe that high-fidelity sound is a gateway to emotion. 
               Whether it's the subtle breath of a vocalist or the thunderous roar of a cinematic explosion, 
               every detail matters. Our curated selection represents the pinnacle of audio engineering.
             </p>
             <p className="text-muted-foreground leading-relaxed text-lg">
               Founded in 2010, we have spent over a decade perfecting the art of system matching—pairing 
               speakers, amplifiers, and sources that synergize to create magic.
             </p>
           </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
           {/* Order swap on desktop */}
           <div className="md:order-2 space-y-6">
             <h2 className="text-3xl font-medium tracking-tight text-primary">The Experience</h2>
             <p className="text-muted-foreground leading-relaxed text-lg">
               Our showroom is designed as a sanctuary for the senses. We invite you to bring your favorite 
               music and get lost in the sound. Our expert consultants are here not to sell, but to guide 
               you on your journey to sonic nirvana.
             </p>
             <ul className="space-y-3 text-muted-foreground text-lg">
                <li className="flex items-center gap-3"><span className="text-primary">✓</span> Private Listening Rooms</li>
                <li className="flex items-center gap-3"><span className="text-primary">✓</span> Expert Calibration Services</li>
                <li className="flex items-center gap-3"><span className="text-primary">✓</span> Home Installation & Support</li>
             </ul>
           </div>
           <div className="md:order-1 aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
             <img 
               src={speakersImg} 
               alt="Listening Experience" 
               className="w-full h-full object-cover"
             />
           </div>
        </div>
      </Section>
    </div>
  );
};

export default About;
