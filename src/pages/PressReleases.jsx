
import { useState } from 'react';
import Section from '../components/Section';
import SEO from '../components/SEO';
import PressReleaseCard from '../components/PressReleaseCard';
import { pressReleases } from '../lib/seed-data';

const PressReleases = () => {
    // In a real app, we might fetch this or paginate
    const [releases] = useState(pressReleases);
    const featuredRelease = releases[0];
    const otherReleases = releases.slice(1);

    return (
        <div className="animate-fade-in pt-24 pb-20">
            <SEO title="Press Room" description="Latest news and updates from Cinema Focus." />
            
            <Section>
                <div className="mb-16 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight">Press Room.</h1>
                     <p className="text-xl text-muted font-light max-w-2xl mx-auto">
                        Latest news, announcements, and stories from our world.
                    </p>
                </div>
                
                {/* Featured Release */}
                {featuredRelease && (
                    <div className="mb-16">
                        <PressReleaseCard release={featuredRelease} variant="horizontal" />
                    </div>
                )}

                {/* Grid for Other Releases */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherReleases.map((release) => (
                        <PressReleaseCard key={release.id} release={release} />
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default PressReleases;
