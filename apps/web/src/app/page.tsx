import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { BentoGrid } from '@/components/sections/BentoGrid';
import { LogosMarquee } from '@/components/sections/LogosMarquee';
import { Stats } from '@/components/sections/Stats';
import { CTA } from '@/components/sections/CTA';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <BentoGrid />
        <LogosMarquee />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
