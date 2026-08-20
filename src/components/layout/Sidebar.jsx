import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BadgeDollarSign,
  CreditCard,
  BarChart3,
  FileText,
  Bell,
  Settings,
  LogOut,
  Store
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { label: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('customers'), path: '/customers', icon: Users },
    { label: t('debts'), path: '/debts', icon: BadgeDollarSign },
    { label: t('payments'), path: '/payments', icon: CreditCard },
    { label: t('statistics'), path: '/statistics', icon: BarChart3 },
    { label: t('reports'), path: '/reports', icon: FileText },
    { label: t('notifications'), path: '/notifications', icon: Bell },
    { label: t('settings'), path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80 h-screen sticky top-0 z-30 select-none transition-colors">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="w-10 h-10 rounded-[14px] bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/25">
          <BadgeDollarSign className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none">
            Qarz<span className="text-emerald-600 dark:text-emerald-400">Daftar</span>
          </h1>
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 block">
            {lang === 'ru' ? "SaaS Платформа" : "SaaS Platforma"}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {lang === 'ru' ? "Главное меню" : "Asosiy menyu"}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-full font-extrabold text-xs sm:text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-md shadow-slate-900/20 dark:shadow-emerald-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center flex-shrink-0 text-sm border border-emerald-300 dark:border-emerald-700">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {user?.name || 'Foydalanuvchi'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                <Store className="w-3 h-3 flex-shrink-0" />
                {user?.businessName || 'Biznes'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title={t('logout')}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
