import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BadgeDollarSign, Plus, Search } from 'lucide-react';

import { useDebts } from '../hooks/useDebts';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { DebtTable } from '../components/debts/DebtTable';
import { AddDebtModal } from '../components/debts/AddDebtModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Loading } from '../components/ui/Loading';
import { isDueSoon } from '../utils/formatDate';

export const Debts = () => {
  const { showToast, openAddDebtModal } = useOutletContext();
  const { debts, loading, deleteDebt, refreshDebts } = useDebts();
  const { lang, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const filteredDebts = useMemo(() => {
    return debts.filter((d) => {
      const matchesSearch =
        d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.product.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterTab === 'all') return true;
      if (filterTab === 'active') return d.status === 'Faol' || d.status === 'Yaqinlashmoqda';
      if (filterTab === 'overdue') return d.status === 'Muddati o‘tgan';
      if (filterTab === 'due_today') return isDueSoon(d.dueDate, d.remainingAmount);
      if (filterTab === 'paid') return d.status === 'To‘langan';

      return true;
    });
  }, [debts, searchQuery, filterTab]);

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteDebt(deleteTargetId);
      showToast("🗑 Qarz yozuvi o‘chirildi.", "info");
      setDeleteTargetId(null);
    }
  };

  if (loading) {
    return <Loading text={lang === 'ru' ? "Загрузка долгов..." : "Qarzlar ro'yxati yuklanmoqda..."} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BadgeDollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            {t('debts')}
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ru' ? "Все выданные, активные и погашенные долги магазина." : "Mijozlarga berilgan barcha to'langan va to'lanmagan qarzlar."}
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} icon={Plus} size="lg" className="rounded-full">
          {t('addDebt')}
        </Button>
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

        {/* Status Filter Pill Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: lang === 'ru' ? 'Все' : 'Barchasi' },
            { id: 'active', label: lang === 'ru' ? 'Активные' : 'Faol' },
            { id: 'overdue', label: lang === 'ru' ? 'Просрочено' : 'Muddati o‘tgan' },
            { id: 'due_today', label: lang === 'ru' ? 'Оплата сегодня' : 'Bugun to‘lanishi kerak' },
            { id: 'paid', label: lang === 'ru' ? 'Оплачено' : 'To‘langan' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Empty state */}
      {filteredDebts.length === 0 ? (
        <EmptyState
          icon={BadgeDollarSign}
          title={lang === 'ru' ? "Долги не найдены" : "Qarzlar topilmadi"}
          description={
            searchQuery
              ? `"${searchQuery}" bo'yicha qarz yozuvlari topilmadi.`
              : (lang === 'ru' ? "Записей задолженностей нет." : "🎉 Hozircha qarzdorlik yo‘q.")
          }
          actionLabel={`+ ${t('addDebt')}`}
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <DebtTable debts={filteredDebts} onDelete={(id) => setDeleteTargetId(id)} />
      )}

      {/* Modals */}
      <AddDebtModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(msg) => {
          refreshDebts();
          showToast(msg, 'success');
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title={lang === 'ru' ? "Удалить запись долга?" : "Qarzni o‘chirish"}
        message={lang === 'ru' ? "Вы действительно хотите удалить эту запись о долге?" : "Ushbu qarz yozuvini va uning barcha bog'liq to'lovlarini o'chirishni tasdiqlaysizmi?"}
      />
    </div>
  );
};
