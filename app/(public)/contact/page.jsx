import { getFooter } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import ContactClient from './ContactClient';

export const metadata = {
  title: "Contact Us",
  description: "Ready to elevate your home audio experience? Visit the Cinema Focus showroom or send us a message for expert consultation.",
  keywords: "contact Cinema Focus, audio showroom Oman, home cinema consultation, visit showroom",
};

export default async function ContactPage() {
  const supabase = await createClient();
  const info = await getFooter(supabase);
  return <ContactClient initialInfo={info} />;
}
