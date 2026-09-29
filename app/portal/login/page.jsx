import LoginScreen from '@/components/panel/LoginScreen';

export const metadata = { title: 'Sign in' };

export default function PortalLoginPage() {
  return (
    <LoginScreen
      eyebrow="Owner portal"
      title="Sign in to the Owner Portal"
      blurb="See your visitors, customer enquiries and everything live on your website."
      endpoint="/api/portal/login"
      redirectTo="/portal/dashboard"
      footer={{ text: 'Staff member?', href: '/admin/login', label: 'Go to the admin console' }}
    />
  );
}
