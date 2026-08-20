import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CreditCard, Plus, Calendar, DollarSign } from 'lucide-react';

import { usePayments } from '../hooks/usePayments';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { PaymentTable } from '../components/payments/PaymentTable';
import { AddPaymentModal } from '../components/payments/AddPaymentModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Loading } from '../components/ui/Loading';
import { formatCurrency } from '../utils/formatCurrency';
import { getTodayDateString } from '../utils/formatDate';

export const Payments = () => {
  const { showToast } = useOutletContext();
  const { payments, loading, deletePayment, refreshPayments } = usePayments();
  const { lang, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const filteredPayments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return payments.filter((p) => {
      const matchesSearch =
        p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.method.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (timeFilter === 'all') return true;

      const payDate = new Date(p.date);
      payDate.setHours(0, 0, 0, 0);

      if (timeFilter === 'today') {
        return p.date === getTodayDateString();
      }

      if (timeFilter === 'week') {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return payDate >= oneWeekAgo;
      }

      if (timeFilter === 'month') {
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return payDate >= oneMonthAgo;
      }

      return true;
    });
  }, [payments, searchQuery, timeFilter]);

  const totalPaymentSum = useMemo(() => {
    return filteredPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [filteredPayments]);

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deletePayment(deleteTargetId);
      showToast("🗑 To'lov yozuvi o‘chirildi va qarz qayta hisoblandi.", "info");
      setDeleteTargetId(null);
    }
  };

  if (loading) {
    return <Loading text={lang === 'ru' ? "Загрузка платежей..." : "To'lovlar ro'yxati yuklanmoqda..."} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            {t('payments')}
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ru' ? "История всех платежей, полученных от клиентов." : "Mijozlar tomonidan amalga oshirilgan barcha to'lovlar tarixi."}
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} icon={Plus} size="lg" className="rounded-full">
          {t('addPaymentBtn')}
        </Button>
      </div>

      {/* Summary Total Card */}
      <div className="p-8 rounded-[32px] bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-600/20 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-100 block">
            {lang === 'ru' ? "Всего платежей (за выбранный период)" : "Jami to‘lov (tanlangan davr bo'yicha)"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
            {formatCurrency(totalPaymentSum)}
          </h2>
        </div>
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md hidden sm:block">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Filter and Search Bar Styled Like Reference UI */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-lg shadow-slate-200/40 dark:shadow-none">
        <div className="w-full md:w-96">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('search')}
          />
        </div>

        {/* Time Filter Pill Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: lang === 'ru' ? 'Все' : 'Barchasi' },
            { id: 'today', label: lang === 'ru' ? 'Сегодня' : 'Bugun' },
            { id: 'week', label: lang === 'ru' ? 'На этой неделе' : 'Bu hafta' },
            { id: 'month', label: lang === 'ru' ? 'В этом месяце' : 'Bu oy' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                timeFilter === tab.id
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Empty State */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title={lang === 'ru' ? "Платежи не найдены" : "To'lovlar topilmadi"}
          description={
            searchQuery
              ? `"${searchQuery}" bo'yicha to'lov topilmadi.`
              : (lang === 'ru' ? "Нет доступных платежей по этому фильтру." : "Ushbu filter bo'yicha hali to'lovlar mavjud emas.")
          }
          actionLabel={`+ ${t('addPaymentBtn')}`}
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <PaymentTable payments={filteredPayments} onDelete={(id) => setDeleteTargetId(id)} />
      )}

      {/* Modals */}
      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(msg) => {
          refreshPayments();
          showToast(msg, 'success');
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title={lang === 'ru' ? "Отменить платеж?" : "To'lovni bekor qilish"}
        message={lang === 'ru' ? "Вы действительно хотите отменить этот платеж?" : "Ushbu to'lovni bekor qilishni tasdiqlaysizmi? Qarz summasi avtomatik oshadi."}
      />
    </div>
  );
};
