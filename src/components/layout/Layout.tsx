import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#070B1F] text-[#EEF2FF]">
      {/* Floodlit stadium atmospheric ambient glow */}
      <div className="fixed inset-0 pointer-events-none stadium-glow -z-10" />
      <div className="fixed inset-0 pointer-events-none stadium-pitch-lines opacity-40 -z-10" />

      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};
