import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { BentoGrid } from '@/components/sections/BentoGrid';
import { FeaturesShowcase } from '@/components/sections/FeaturesShowcase';
import { LogosMarquee } from '@/components/sections/LogosMarquee';
import { Stats } from '@/components/sections/Stats';
import { CTA } from '@/components/sections/CTA';
import { Footer } from '@/components/sections/Footer';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Architecture } from '@/components/sections/Architecture';
import { Testimonials } from '@/components/sections/Testimonials';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white">
      <Navbar />
      <main>
        <Hero />
        <BentoGrid />
        <FeaturesShowcase />
        <HowItWorks />
        <Architecture />
        <LogosMarquee />
        <Testimonials />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
