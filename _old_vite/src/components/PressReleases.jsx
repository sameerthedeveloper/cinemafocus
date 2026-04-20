
import Section from './Section';
import PressReleaseCard from './PressReleaseCard';
import Button from './Button';

const PressReleases = ({ releases }) => {
  if (!releases || releases.length === 0) return null;

  return (
    <Section id="press-releases" className="bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
           <span className="text-primary font-medium tracking-wider uppercase text-sm mb-2 block">News & Updates</span>
           <h2 className="text-3xl md:text-4xl font-medium tracking-tight">Press Room.</h2>
        </div>
        <Button to="/press" variant="link" className="text-lg">View Archive ›</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {releases.map((release) => (
          <PressReleaseCard key={release.id} release={release} />
        ))}
      </div>
    </Section>
  );
};

export default PressReleases;
