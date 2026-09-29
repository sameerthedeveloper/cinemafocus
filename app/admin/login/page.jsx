import LoginScreen from '@/components/panel/LoginScreen';

export const metadata = { title: 'Admin sign in', robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <LoginScreen
      eyebrow="Admin console"
      title="Welcome back"
      blurb="Manage the catalog, press, gallery and site content behind the Cinema Focus experience."
      placeholder="admin@cinemafocus.in"
      endpoint="/api/auth/login"
      redirectTo="/admin/dashboard"
      footer={{ text: 'Site owner?', href: '/portal/login', label: 'Open the owner portal' }}
    />
  );
}
