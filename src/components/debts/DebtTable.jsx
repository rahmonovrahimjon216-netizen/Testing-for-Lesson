import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const DebtTable = ({ debts, onDelete }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="overflow-x-auto rounded-[28px] border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none">
      <table className="w-full text-left border-collapse min-w-[750px]">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <th className="py-4 px-5">{t('customerName')}</th>
            <th className="py-4 px-5">{lang === 'ru' ? "Товар / Услуга" : "Mahsulot / Xizmat"}</th>
            <th className="py-4 px-5 text-right">{t('totalDebts')}</th>
            <th className="py-4 px-5 text-right">{t('totalPaid')}</th>
            <th className="py-4 px-5 text-right">{t('remainingDebt')}</th>
            <th className="py-4 px-5">{lang === 'ru' ? "Срок" : "Muddat"}</th>
            <th className="py-4 px-5 text-center">{t('status')}</th>
            {onDelete && <th className="py-4 px-5 text-right">{t('action')}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
          {debts.map((d) => (
            <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
              <td className="py-4 px-5 font-bold text-slate-900 dark:text-slate-100">
                <Link
                  to={`/customers/${d.customerId}`}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {d.customerName}
                </Link>
              </td>
              <td className="py-4 px-5 text-slate-700 dark:text-slate-300 font-medium">
                {d.product} {d.quantity > 1 && <span className="text-xs text-slate-400">({d.quantity}x)</span>}
              </td>
              <td className="py-4 px-5 text-right font-semibold text-slate-700 dark:text-slate-300">
                {formatCurrency(d.totalAmount)}
              </td>
              <td className="py-4 px-5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(d.paidAmount)}
              </td>
              <td className="py-4 px-5 text-right font-black text-rose-600 dark:text-rose-400">
                {formatCurrency(d.remainingAmount)}
              </td>
              <td className="py-4 px-5 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                {formatDate(d.dueDate, 'short')}
              </td>
              <td className="py-4 px-5 text-center">
                <Badge status={d.status} />
              </td>
              {onDelete && (
                <td className="py-4 px-5 text-right">
                  <button
                    onClick={() => onDelete(d.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title={t('delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
