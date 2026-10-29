import { Bell, Package, MessageSquare, Eye } from 'lucide-react';
import Button from '@/components/Button';
import Field from '@/components/ui/Field';
import { Badge, Card, StatCard, Delta, EmptyState, Skeleton } from '@/components/panel/ui';
import '@/app/admin/admin.css';

export const metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
};

const COLORS = [
  { group: 'Ink', items: [
    ['ink-950', '#0a0a0a', 'Cinema black. Hero, footer, dark bands'],
    ['ink-700', '#3a3a3c', 'Strong secondary text'],
    ['ink-500', '#6e6e73', 'Muted text'],
    ['ink-200', '#d2d2d7', 'Strong border'],
    ['ink-100', '#e8e8ed', 'Border'],
    ['ink-50', '#f5f5f7', 'Panel and app background'],
  ]},
  { group: 'Brass', items: [
    ['brass-700', '#8a6420', 'Brass text on light'],
    ['brass-500', '#b8862b', 'Accent: the one thing to press or notice'],
    ['brass-300', '#dcb872', 'Brass on dark'],
    ['brass-50', '#fbf3e2', 'Soft fill, active badges'],
  ]},
  { group: 'Signal', items: [
    ['green-600', '#248a3d', 'Success'],
    ['amber-600', '#b25e09', 'Warning'],
    ['red-600', '#d70015', 'Danger'],
    ['blue-600', '#0071e3', 'Info'],
  ]},
];

const SCALE = [
  ['t-display', 'Hear the room', 'Display. Hero only, once per page'],
  ['t-h1', 'Reference-class audio', 'Page title'],
  ['t-h2', 'Speakers built to disappear', 'Section title'],
  ['t-h3', 'ATC SCM50A active monitor', 'Card and subsection title (sans, 600)'],
  ['t-body', 'Every system is auditioned in our Chennai showroom before it is specified for your room.', 'Body. Capped at 62ch'],
  ['t-small', 'Prices include GST. Delivery within Tamil Nadu in 5 working days.', 'Supporting text'],
];

const RADII = [['xs', 'Tags'], ['sm', 'Inputs'], ['md', 'Menus'], ['lg', 'Cards'], ['full', 'Pills, CTAs']];

function Swatch({ name, hex, use }) {
  const dark = ['ink-950', 'ink-700', 'ink-500', 'brass-700', 'brass-500', 'green-600', 'amber-600', 'red-600', 'blue-600'].includes(name);
  return (
    <div className="rounded-[var(--radius-md)] overflow-hidden border border-border">
      <div className="h-20 flex items-end p-3 text-xs font-medium" style={{ background: hex, color: dark ? '#fff' : '#0a0a0a' }}>{hex}</div>
      <div className="p-3">
        <div className="text-sm font-semibold">{name}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{use}</div>
      </div>
    </div>
  );
}

function Band({ id, title, intro, children, dark }) {
  return (
    <section id={id} className={dark ? 'theme-dark' : undefined}>
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] py-[var(--section-y)]">
        <h2 className="t-h2">{title}</h2>
        {intro && <p className="t-body text-muted-foreground mt-3">{intro}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="bg-background text-foreground">
      <header className="theme-dark">
        <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] pt-24 pb-20 md:pt-40 md:pb-28">
          <h1 className="t-display max-w-[14ch]">Hear the room.</h1>
          <p className="t-body mt-6 text-muted-foreground">
            Cinema Focus design system. One set of tokens drives the public site and the admin panel.
            Matte black, quiet white, and a single brass accent.
          </p>
          <nav aria-label="Sections" className="mt-10 flex flex-wrap gap-2 text-sm">
            {[['color', 'Color'], ['type', 'Type'], ['shape', 'Shape and motion'], ['site', 'Site components'], ['admin', 'Admin components']].map(([id, l]) => (
              <a key={id} href={`#${id}`} className="h-9 px-4 inline-flex items-center rounded-full border border-border hover:border-[hsl(var(--brand))] hover:text-[hsl(var(--brand-ink))] transition-colors">{l}</a>
            ))}
          </nav>
        </div>
      </header>

      <Band id="color" title="Color" intro="Neutral by default. Brass appears only on the primary action, the active state, and the focus ring, so it always means something.">
        <div className="space-y-10">
          {COLORS.map((g) => (
            <div key={g.group}>
              <h3 className="t-h3 mb-4">{g.group}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {g.items.map(([n, h, u]) => <Swatch key={n} name={n} hex={h} use={u} />)}
              </div>
            </div>
          ))}
        </div>
      </Band>

      <div className="bg-secondary">
        <Band id="type" title="Type" intro="Instrument Serif carries headlines on the public site. Hanken Grotesk does everything else. The admin keeps its sans headings for density.">
          <div className="space-y-8 divide-y divide-border">
            {SCALE.map(([cls, sample, note]) => (
              <div key={cls} className="pt-8 first:pt-0 grid md:grid-cols-[14rem_1fr] gap-2 md:gap-8 items-baseline">
                <div className="text-sm"><code className="font-mono">.{cls}</code><div className="text-xs text-muted-foreground mt-1">{note}</div></div>
                <p className={cls}>{sample}</p>
              </div>
            ))}
          </div>
        </Band>
      </div>

      <Band id="shape" title="Shape and motion" intro="Radius follows hierarchy. Elevation is for light surfaces; dark surfaces use borders. Motion confirms an action, and the page entrance happens once.">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="t-h3 mb-4">Radius</h3>
            <div className="flex flex-wrap gap-4">
              {RADII.map(([k, use]) => (
                <div key={k} className="text-center">
                  <div className="w-20 h-20 border border-ring bg-brand-soft" style={{ borderRadius: `var(--radius-${k})` }} />
                  <div className="text-xs font-medium mt-2">{k}</div>
                  <div className="text-xs text-muted-foreground">{use}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="t-h3 mb-4">Elevation</h3>
            <div className="flex flex-wrap gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-28 h-20 rounded-[var(--radius-lg)] bg-white flex items-center justify-center text-sm font-medium" style={{ boxShadow: `var(--shadow-${n})` }}>shadow-{n}</div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <h3 className="t-h3 mb-4">Timing</h3>
            <ul className="text-sm space-y-1.5">
              <li><code className="font-mono">--dur-fast</code> 150ms. Hover, press</li>
              <li><code className="font-mono">--dur-base</code> 300ms. State change</li>
              <li><code className="font-mono">--dur-slow</code> 600ms. Entrance, once per page</li>
              <li><code className="font-mono">--ease-out</code> for everything. Reduced-motion users get instant transitions</li>
            </ul>
          </div>
        </div>
      </Band>

      <div className="theme-dark">
        <Band id="site" title="Site components" intro="Buttons are uppercase, tracked, and pill-shaped on hero and CTA bands. Forms and cards use the tighter radii.">
          <div className="space-y-12">
            <div>
              <h3 className="t-h3 mb-4">Buttons</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="brand" className="rounded-full">Book an audition</Button>
                <Button variant="primary" className="rounded-full">View products</Button>
                <Button variant="outline" className="rounded-full">Download catalog</Button>
                <Button variant="ghost" className="rounded-full">Learn more</Button>
                <Button variant="primary" size="sm" className="rounded-full">Small</Button>
                <Button disabled className="rounded-full">Unavailable</Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
              <Field label="Full name" placeholder="Priya Raman" />
              <Field label="Email" type="email" hint="We reply within one working day." placeholder="you@example.com" />
              <Field label="Phone" error="Enter a 10-digit mobile number." defaultValue="98400" />
              <Field label="Room size" as="select"><option>Under 150 sq ft</option><option>150 to 300 sq ft</option><option>Over 300 sq ft</option></Field>
              <Field className="md:col-span-2" label="Tell us about your room" as="textarea" placeholder="Dimensions, current gear, budget range" />
            </div>
          </div>
        </Band>
      </div>

      <div className="admin-shell">
        <Band id="admin" title="Admin components" intro="Denser, lighter, softer. Same tokens: brass marks the active nav item and unread counts; signal colors carry status.">
          <div className="space-y-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Page views" value="12,480" sub="Last 30 days" icon={Eye} delta={<Delta pct={14} />} />
              <StatCard label="Products" value="86" sub="4 drafts" icon={Package} delta={<Delta pct={0} />} />
              <StatCard label="Messages" value="23" sub="5 unread" icon={MessageSquare} delta={<Delta pct={-8} />} />
              <StatCard label="Alerts" value="2" sub="Needs review" icon={Bell} delta={<Delta pct={null} />} />
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <Card title="Status" subtitle="Badges pair a dot with a label, never color alone">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="success">Published</Badge>
                  <Badge tone="warning">Draft</Badge>
                  <Badge tone="danger">Failed</Badge>
                  <Badge tone="info">Scheduled</Badge>
                  <Badge>Archived</Badge>
                </div>
              </Card>
              <Card title="Loading" subtitle="Skeletons keep layout stable">
                <div className="space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /></div>
              </Card>
            </div>

            <div className="flex items-center gap-4">
              <div className="segmented" role="group" aria-label="Range">
                <button type="button" className="is-active">7 days</button>
                <button type="button">30 days</button>
                <button type="button">90 days</button>
              </div>
              <Button variant="brand" size="sm" className="rounded-full">Save changes</Button>
            </div>

            <EmptyState title="No messages yet" hint="New enquiries from the contact form appear here." />
          </div>
        </Band>
      </div>
    </div>
  );
}
