import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import LiveScoresPreview from "@/components/home/LiveScoresPreview";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProgramsPreview from "@/components/home/ProgramsPreview";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <LiveScoresPreview />
        <FeaturesSection />
        <ProgramsPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
