import { AboutService } from "@/services/about.service";
import { GalleryService } from "@/services/gallery.service";
import ClientAboutPage from "./ClientAboutPage";

export const revalidate = 60; // Cache for 60 seconds

export default async function AboutPage() {
  const [settings, team, milestones, partners, gallery] = await Promise.all([
    AboutService.getAllSettings(),
    AboutService.getTeamMembers(true),
    AboutService.getMilestones(true),
    AboutService.getPartners(true),
    GalleryService.getPublishedItems()
  ]);

  return (
    <ClientAboutPage 
      settings={settings}
      team={team}
      milestones={milestones}
      partners={partners}
      gallery={gallery}
    />
  );
}
