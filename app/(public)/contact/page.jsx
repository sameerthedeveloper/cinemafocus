import { getFooter } from '@/lib/cms';
import ContactClient from './ContactClient';

export const metadata = {
  title: "Contact Us",
  description: "Ready to elevate your home audio experience? Visit the Cinema Focus showroom or send us a message for expert consultation.",
  keywords: "contact Cinema Focus, audio showroom Chennai, home cinema consultation, visit showroom",
};

export default async function ContactPage() {
  const info = await getFooter();
  return <ContactClient initialInfo={info} />;
}
