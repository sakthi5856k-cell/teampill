import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import DepartmentSection from "../components/home/DepartmentSection";
import AnnouncementSection from "../components/home/AnnouncementSection";
import DiscordSection from "../components/home/DiscordSection";
import FooterCTA from "../components/home/FooterCTA";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">

      <HeroSection />

      <StatsSection />

      <DepartmentSection />

      <AnnouncementSection />

      <DiscordSection />

      <FooterCTA />

    </main>
  );
}
