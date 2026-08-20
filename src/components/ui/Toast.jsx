import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const borders = {
    success: 'border-emerald-500/30',
    error: 'border-rose-500/30',
    info: 'border-blue-500/30'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in max-w-sm w-full">
      <div className={`flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border ${borders[toast.type] || borders.info} shadow-xl shadow-slate-900/10`}>
        <div className="flex-shrink-0 pt-0.5">
          {icons[toast.type] || icons.info}
        </div>
        <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
          {toast.message}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
