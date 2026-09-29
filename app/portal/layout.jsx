export const metadata = {
  title: { default: 'Owner Portal', template: '%s · Owner Portal' },
  robots: { index: false, follow: false, nocache: true },
};

export default function PortalRootLayout({ children }) {
  return children;
}
