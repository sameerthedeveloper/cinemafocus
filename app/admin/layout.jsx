export const metadata = {
  title: { default: 'Admin', template: '%s · Admin' },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }) {
  return children;
}
