import { redirect } from 'next/navigation';

/**
 * Admin Root Page
 * 
 * This page handles the base /admin path.
 * It immediately redirects to the dashboard.
 * The middleware handles authenticating the user and sending them to /admin/login if required.
 */
export default function AdminRootPage() {
  redirect('/admin/dashboard');
}
