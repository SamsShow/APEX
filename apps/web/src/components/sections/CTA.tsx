import React from 'react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-16">
      <div className="container overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-purple-600/10 p-10 text-center">
        <h3 className="text-2xl font-semibold text-white">Ready to experience Apex?</h3>
        <p className="mt-2 text-zinc-300">Join now and unlock premium features and support.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button>Get Started</Button>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </div>
    </section>
  );
}


