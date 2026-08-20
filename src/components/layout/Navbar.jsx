import React from 'react';
import { Sun, Moon, Menu, BadgeDollarSign, Plus } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { NotificationDropdown } from '../ui/NotificationDropdown';
import { Button } from '../ui/Button';

export const Navbar = ({ onOpenMobileMenu, onQuickAddDebt }) => {
  const { theme, toggleTheme } = useTheme();
  const { lang, changeLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Menyu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-9 h-9 rounded-[14px] bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <BadgeDollarSign className="w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
              Qarz<span className="text-emerald-600 dark:text-emerald-400">Daftar</span>
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Language Switcher UZ / RU */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black">
            <button
              onClick={() => changeLanguage('uz')}
              className={`px-2 py-1 rounded-lg transition-all ${
                lang === 'uz'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              UZ 🇺🇿
            </button>
            <button
              onClick={() => changeLanguage('ru')}
              className={`px-2 py-1 rounded-lg transition-all ${
                lang === 'ru'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              RU 🇷🇺
            </button>
          </div>

          {/* Quick Add Debt Action */}
          <Button
            size="sm"
            onClick={onQuickAddDebt}
            icon={Plus}
            className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {t('addDebt')}
          </Button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? "Yorug' rejim" : "Qorong'u rejim"}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
};
