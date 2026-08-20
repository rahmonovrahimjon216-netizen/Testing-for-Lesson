import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ text = "Yuklanmoqda..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400 mb-2" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};
