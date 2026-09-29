import LoginScreen from '@/components/panel/LoginScreen';

export const metadata = { title: 'Admin sign in', robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <LoginScreen
      eyebrow="Admin console"
      title="Sign in to the Admin Console"
      blurb="Manage the catalog, press, gallery and site content."
      endpoint="/api/auth/login"
      redirectTo="/admin/dashboard"
      footer={{ text: 'Site owner?', href: '/portal/login', label: 'Open the owner portal' }}
    />
  );
}
