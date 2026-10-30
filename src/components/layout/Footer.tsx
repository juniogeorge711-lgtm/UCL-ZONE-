import React from 'react';
import { Link } from 'react-router-dom';
import { SampleDataBadge } from '../ui/SampleDataBadge';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#26346B]/50 bg-[#070B1F] text-[#9AA7D6] py-12 px-4 sm:px-6 lg:px-8 pb-20 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-black tracking-wider text-white uppercase">
              UCL<span className="text-[#3D7BFF]"> ZONE</span>
            </span>
            <SampleDataBadge />
          </div>
          <p className="text-xs text-[#9AA7D6] max-w-md">
            Independent fan hub & football analytics dashboard. Not officially affiliated with or endorsed by UEFA. All scores and match events in sample mode are for demonstration purposes.
          </p>
        </div>

        <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center gap-6 text-xs">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/fixtures" className="hover:text-white transition-colors">Fixtures</Link>
          <Link to="/standings" className="hover:text-white transition-colors">Standings</Link>
          <Link to="/clubs" className="hover:text-white transition-colors">Clubs</Link>
          <Link to="/players" className="hover:text-white transition-colors">Players</Link>
          <Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link>
          <Link to="/news" className="hover:text-white transition-colors">News</Link>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto border-t border-[#26346B]/30 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#9AA7D6]/70 gap-3">
        <span>© 2026 UCL ZONE. Built with React, TypeScript & Recharts.</span>
        <span>Local kickoff times converted via Intl.DateTimeFormat.</span>
      </div>
    </footer>
  );
};
