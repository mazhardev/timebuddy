'use client';

import { useWorldClock } from '@/hooks/useWorldClock';
import ClockCard from '@/components/ClockCard';
import Navigation from '@/components/Navigation';
import { POPULAR_TIMEZONES, getCityName } from '@/lib/time-utils';

export default function Home() {
  const now = useWorldClock();

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-6 tracking-tight">
            Global Time, <br />
            Synchronized.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Track time across the globe with precision. The ultimate dashboard for remote teams and digital nomads.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_TIMEZONES.map((zone) => (
            <ClockCard
              key={zone}
              zone={zone}
              city={getCityName(zone)}
              now={now}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
