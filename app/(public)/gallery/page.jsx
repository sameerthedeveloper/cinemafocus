import { getProjects } from '@/lib/cms';
import GalleryClient from './GalleryClient';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Installation Gallery | Cinema Focus Chennai',
  description: "A visual journey through Cinema Focus's most exquisite home cinema and audio installations. See how we bring premium sound to life across India.",
  path: '/gallery',
});

export default async function GalleryPage() {
  const projects = await getProjects();
  return <GalleryClient projects={projects} />;
}
