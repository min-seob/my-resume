import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CareerTimelineSection } from "@/components/sections/CareerTimelineSection";
import { CoreStrengthSection } from "@/components/sections/CoreStrengthSection";
import { FeaturedProjectsSection } from "@/components/sections/FeaturedProjectsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ResumeDownloadSection } from "@/components/sections/ResumeDownloadSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { SummarySection } from "@/components/sections/SummarySection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SummarySection />
        <CoreStrengthSection />
        <FeaturedProjectsSection />
        <CareerTimelineSection />
        <SkillsSection />
        <ResumeDownloadSection />
      </main>
      <Footer />
    </>
  );
}
