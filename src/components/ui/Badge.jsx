import React from 'react';

export const Badge = ({ status, className = '' }) => {
  let badgeStyles = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm";
  let dotColor = "bg-emerald-500";

  switch (status) {
    case 'Faol':
    case 'Qarzi bor':
      badgeStyles += " bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60";
      dotColor = "bg-emerald-500 animate-pulse";
      break;
    case 'Yaqinlashmoqda':
      badgeStyles += " bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60";
      dotColor = "bg-amber-500";
      break;
    case 'Muddati o‘tgan':
      badgeStyles += " bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60";
      dotColor = "bg-rose-500";
      break;
    case 'To‘langan':
    case 'Qarzi yo‘q':
      badgeStyles += " bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60";
      dotColor = "bg-emerald-500";
      break;
    default:
      badgeStyles += " bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
      dotColor = "bg-slate-400";
  }

  return (
    <span className={`${badgeStyles} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};
