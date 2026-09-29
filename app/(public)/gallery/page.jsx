import { getProjects } from '@/lib/cms';
import GalleryClient from './GalleryClient';

export const metadata = {
  title: "Installation Gallery",
  description: "A visual journey through Cinema Focus's most exquisite home cinema and audio installations. See how we bring premium sound to life.",
  keywords: "home cinema installations, audio setup gallery, premium speaker installations, Cinema Focus projects, showroom gallery",
};

export default async function GalleryPage() {
  const projects = await getProjects();
  return <GalleryClient projects={projects} />;
}
