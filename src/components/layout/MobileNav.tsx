import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Trophy, BarChart3, Shield } from 'lucide-react';

export const MobileNav: React.FC = () => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070B1F]/95 backdrop-blur-md border-t border-[#26346B]/60 h-14 flex items-center justify-around px-2"
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
            isActive ? 'text-[#3D7BFF]' : 'text-[#9AA7D6] hover:text-[#EEF2FF]'
          }`
        }
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/fixtures"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
            isActive ? 'text-[#3D7BFF]' : 'text-[#9AA7D6] hover:text-[#EEF2FF]'
          }`
        }
      >
        <Calendar className="w-4 h-4 mb-0.5" />
        <span>Fixtures</span>
      </NavLink>

      <NavLink
        to="/standings"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
            isActive ? 'text-[#3D7BFF]' : 'text-[#9AA7D6] hover:text-[#EEF2FF]'
          }`
        }
      >
        <Trophy className="w-4 h-4 mb-0.5" />
        <span>Table</span>
      </NavLink>

      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
            isActive ? 'text-[#3D7BFF]' : 'text-[#9AA7D6] hover:text-[#EEF2FF]'
          }`
        }
      >
        <BarChart3 className="w-4 h-4 mb-0.5" />
        <span>Stats</span>
      </NavLink>

      <NavLink
        to="/clubs"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
            isActive ? 'text-[#3D7BFF]' : 'text-[#9AA7D6] hover:text-[#EEF2FF]'
          }`
        }
      >
        <Shield className="w-4 h-4 mb-0.5" />
        <span>Clubs</span>
      </NavLink>
    </nav>
  );
};
