import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  required,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full bg-slate-50/50 dark:bg-slate-800/40 border ${
            error 
              ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' 
              : 'border-slate-200/90 dark:border-slate-800 focus:border-emerald-600 focus:ring-emerald-500/20'
          } rounded-2xl text-slate-900 dark:text-slate-100 ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-4 py-3 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-4 placeholder:text-slate-400 dark:placeholder:text-slate-600 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rose-500 font-semibold">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
