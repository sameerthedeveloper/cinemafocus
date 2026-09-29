import LoginScreen from '@/components/panel/LoginScreen';

export const metadata = { title: 'Sign in' };

export default function PortalLoginPage() {
  return (
    <LoginScreen
      eyebrow="Owner portal"
      title="Your business, at a glance"
      blurb="See visitors, customer enquiries, and everything live on your website — products, brands, gallery and press."
      placeholder="you@cinemafocus.in"
      endpoint="/api/portal/login"
      redirectTo="/portal/dashboard"
      footer={{ text: 'Staff member?', href: '/admin/login', label: 'Go to the admin console' }}
    />
  );
}
