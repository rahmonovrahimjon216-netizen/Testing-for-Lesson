import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'emerald', subtext }) => {
  const colors = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200/60 dark:border-emerald-800/60'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200/60 dark:border-blue-800/60'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200/60 dark:border-amber-800/60'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200/60 dark:border-rose-800/60'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200/60 dark:border-purple-800/60'
    }
  };

  const activeColor = colors[color] || colors.emerald;

  return (
    <div className="p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-lg shadow-slate-200/40 dark:shadow-none hover:shadow-xl transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </span>
        <div className={`p-3.5 rounded-2xl ${activeColor.bg} ${activeColor.text} ${activeColor.border} border group-hover:scale-105 transition-transform duration-200`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </h4>
        {subtext && (
          <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
