import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, Phone } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { useLanguage } from '../../hooks/useLanguage';

export const CustomerTable = ({ customers, onEdit, onDelete }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="overflow-x-auto rounded-[28px] border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <th className="py-4 px-5">{t('customerName')}</th>
            <th className="py-4 px-5">{t('phoneLabel')}</th>
            <th className="py-4 px-5 text-right">{t('totalDebts')}</th>
            <th className="py-4 px-5 text-right">{t('totalPaid')}</th>
            <th className="py-4 px-5 text-right">{t('remainingDebt')}</th>
            <th className="py-4 px-5 text-center">{t('status')}</th>
            <th className="py-4 px-5 text-right">{t('action')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
          {customers.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
            >
              <td className="py-4 px-5 font-bold text-slate-900 dark:text-slate-100">
                <Link
                  to={`/customers/${c.id}`}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {c.name}
                </Link>
                {c.address && (
                  <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 truncate max-w-xs mt-0.5">
                    {c.address}
                  </span>
                )}
              </td>
              <td className="py-4 px-5 text-slate-600 dark:text-slate-400 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {c.phone}
                </span>
              </td>
              <td className="py-4 px-5 text-right font-semibold text-slate-700 dark:text-slate-300">
                {formatCurrency(c.totalDebt)}
              </td>
              <td className="py-4 px-5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(c.paidAmount)}
              </td>
              <td className="py-4 px-5 text-right font-black text-rose-600 dark:text-rose-400">
                {formatCurrency(c.remainingAmount)}
              </td>
              <td className="py-4 px-5 text-center">
                <Badge status={c.status} />
              </td>
              <td className="py-4 px-5 text-right">
                <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                  <Link
                    to={`/customers/${c.id}`}
                    title="Ko'rish"
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(c)}
                      title={t('edit')}
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(c.id)}
                      title={t('delete')}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
