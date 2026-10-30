import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#070B1F]/90 backdrop-blur-md border-b border-[#26346B]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <NavLink
          to="/"
          className="flex items-center gap-2 group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7BFF] rounded"
        >
          <span className="font-display text-2xl sm:text-3xl font-black tracking-wider text-white uppercase group-hover:text-[#3D7BFF] transition-colors">
            UCL<span className="text-[#3D7BFF]"> ZONE</span>
          </span>
        </NavLink>

        {/* Zone 2: Clean single-line nav links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#9AA7D6]"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                isActive
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#3D7BFF]'
                  : 'hover:text-[#EEF2FF]'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/fixtures"
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                isActive
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#3D7BFF]'
                  : 'hover:text-[#EEF2FF]'
              }`
            }
          >
            Fixtures
          </NavLink>
          <NavLink
            to="/standings"
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                isActive
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#3D7BFF]'
                  : 'hover:text-[#EEF2FF]'
              }`
            }
          >
            Standings
          </NavLink>
          <NavLink
            to="/clubs"
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                isActive
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#3D7BFF]'
                  : 'hover:text-[#EEF2FF]'
              }`
            }
          >
            Clubs
          </NavLink>
          <NavLink
            to="/players"
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                isActive
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#3D7BFF]'
                  : 'hover:text-[#EEF2FF]'
              }`
            }
          >
            Players
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                isActive
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#3D7BFF]'
                  : 'hover:text-[#EEF2FF]'
              }`
            }
          >
            Analytics
          </NavLink>
          <NavLink
            to="/news"
            className={({ isActive }) =>
              `whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                isActive
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#3D7BFF]'
                  : 'hover:text-[#EEF2FF]'
              }`
            }
          >
            News
          </NavLink>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/match/m-2026-07-rma-mci')}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#3D7BFF] hover:bg-[#3D7BFF]/90 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Featured Match
          </button>
        </div>
      </div>
    </header>
  );
};
