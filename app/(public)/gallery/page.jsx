import { getProjects } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import GalleryClient from './GalleryClient';

export const metadata = {
  title: "Installation Gallery | Cinema Focus",
  description: "A visual journey through Cinema Focus's most exquisite home cinema and audio installations. See how we bring premium sound to life.",
  keywords: "home cinema installations, audio setup gallery, premium speaker installations, Cinema Focus projects, showroom gallery",
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const projects = await getProjects(supabase);
  return <GalleryClient projects={projects} />;
}
