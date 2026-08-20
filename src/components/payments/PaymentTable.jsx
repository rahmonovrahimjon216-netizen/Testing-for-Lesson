import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { CreditCard, Trash2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const PaymentTable = ({ payments, onDelete }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="overflow-x-auto rounded-[28px] border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none">
      <table className="w-full text-left border-collapse min-w-[650px]">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <th className="py-4 px-5">{t('customerName')}</th>
            <th className="py-4 px-5 text-right">{lang === 'ru' ? "Сумма" : "Summa"}</th>
            <th className="py-4 px-5">{lang === 'ru' ? "Способ оплаты" : "To‘lov usuli"}</th>
            <th className="py-4 px-5">{lang === 'ru' ? "Дата" : "Sana"}</th>
            <th className="py-4 px-5">{lang === 'ru' ? "Примечание" : "Izoh"}</th>
            {onDelete && <th className="py-4 px-5 text-right">{t('action')}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
          {payments.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
              <td className="py-4 px-5 font-bold text-slate-900 dark:text-slate-100">
                <Link
                  to={`/customers/${p.customerId}`}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {p.customerName}
                </Link>
                {p.product && (
                  <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                    {p.product}
                  </span>
                )}
              </td>
              <td className="py-4 px-5 text-right font-black text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(p.amount)}
              </td>
              <td className="py-4 px-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  {p.method}
                </span>
              </td>
              <td className="py-4 px-5 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                {formatDate(p.date, 'short')}
              </td>
              <td className="py-4 px-5 text-slate-500 dark:text-slate-400 text-xs font-medium italic">
                {p.note || '-'}
              </td>
              {onDelete && (
                <td className="py-4 px-5 text-right">
                  <button
                    onClick={() => onDelete(p.id)}
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
