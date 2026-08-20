import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';

export const CustomerCard = ({ customer }) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            to={`/customers/${customer.id}`}
            className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {customer.name}
          </Link>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Phone className="w-3.5 h-3.5" />
            <span>{customer.phone}</span>
          </div>
        </div>
        <Badge status={customer.status} />
      </div>

      {customer.address && (
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{customer.address}</span>
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400">Jami</span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {formatCurrency(customer.totalDebt)}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400">To‘langan</span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(customer.paidAmount)}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400">Qolgan</span>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
            {formatCurrency(customer.remainingAmount)}
          </span>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Link
          to={`/customers/${customer.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          Batafsil <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
