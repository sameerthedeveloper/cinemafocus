import Section from './Section';
import PressReleaseCard from './PressReleaseCard';
import SectionHeader from './SectionHeader';

const PressReleases = ({ releases }) => {
  if (!releases || releases.length === 0) return null;

  return (
    <Section id="press-releases" className="bg-background">
      <SectionHeader title="Press room" lead="News, launches and announcements." href="/press" linkLabel="All press releases" />
      <ul className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {releases.slice(0, 3).map((release) => (
          <li key={release.id || release.slug}>
            <PressReleaseCard release={release} headingLevel="h3" />
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default PressReleases;
