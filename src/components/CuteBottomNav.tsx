import React from 'react';
import { ActiveTab } from '../types/schedule';
import { Home, CalendarDays, Heart, Users } from 'lucide-react';

export interface CuteBottomNavProps {
  /** Currently active navigation tab */
  activeTab: ActiveTab;
  /** Callback fired when a tab is selected */
  onTabChange: (tab: ActiveTab) => void;
  /** Additional CSS class names */
  className?: string;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Beranda', emoji: '🏠', icon: Home },
  { id: 'calendar', label: 'Kalender', emoji: '📅', icon: CalendarDays },
  { id: 'notes', label: 'Pesan Cinta', emoji: '🔔', icon: Heart },
  { id: 'team', label: 'Jadwal Teman', emoji: '👥', icon: Users },
];

export const CuteBottomNav: React.FC<CuteBottomNavProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <nav
      role="navigation"
      aria-label="Navigasi Menu Utama"
      className={`fixed bottom-3 inset-x-0 max-w-sm sm:max-w-md mx-auto z-40 bg-white/95 backdrop-blur-md border border-pink-200/90 rounded-full shadow-lg shadow-pink-200/50 px-3 sm:px-4 py-2 flex items-center justify-around select-none transition-all ${className}`}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-pink-400 ${
              isActive
                ? 'bg-pink-100 text-pink-600 font-bold scale-105 shadow-2xs'
                : 'text-[#8C5E68] hover:text-[#D63447] hover:bg-pink-50/70 font-semibold'
            }`}
          >
            {/* Icon / Emoji */}
            <span className="relative flex items-center justify-center text-sm sm:text-base">
              {isActive ? (
                <span className="leading-none">{item.emoji}</span>
              ) : (
                <IconComponent className="w-4 h-4 text-[#A8727D] transition-colors" />
              )}
            </span>

            {/* Label */}
            <span
              className={`text-xs whitespace-nowrap transition-colors tracking-tight ${
                isActive ? 'text-[#C2185B] font-extrabold' : 'text-[#8C5E68]'
              }`}
            >
              {item.label}
            </span>

            {/* Subtle active strawberry dot */}
            {isActive && (
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-[#FF6B8B] animate-pulse ml-0.5"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default CuteBottomNav;
