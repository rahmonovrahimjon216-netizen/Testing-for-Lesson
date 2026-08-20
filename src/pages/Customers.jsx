import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Users, Search, Filter } from 'lucide-react';

import { useCustomers } from '../hooks/useCustomers';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { CustomerTable } from '../components/customers/CustomerTable';
import { CustomerCard } from '../components/customers/CustomerCard';
import { AddCustomerModal } from '../components/customers/AddCustomerModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Loading } from '../components/ui/Loading';

export const Customers = () => {
  const { showToast } = useOutletContext();
  const { customers, loading, deleteCustomer, refreshCustomers } = useCustomers();
  const { lang, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Filter & Search Logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery);

      if (selectedStatus === 'all') return matchesSearch;
      if (selectedStatus === 'has_debt') return matchesSearch && c.remainingAmount > 0;
      if (selectedStatus === 'no_debt') return matchesSearch && c.remainingAmount === 0;
      if (selectedStatus === 'overdue') return matchesSearch && c.status === 'Muddati o‘tgan';
      return matchesSearch;
    });
  }, [customers, searchQuery, selectedStatus]);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsAddModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteCustomer(deleteTargetId);
      showToast("🗑 Mijoz va uning barcha qarzlari o‘chirildi.", "info");
      setDeleteTargetId(null);
    }
  };

  if (loading) {
    return <Loading text={lang === 'ru' ? "Загрузка клиентов..." : "Mijozlar yuklanmoqda..."} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            {t('customers')}
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ru' ? "Список всех клиентов магазина и история расчетов." : "Barcha qarzdor va faol mijozlar ro'yxati hamda hisob-kitoblari."}
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingCustomer(null);
            setIsAddModalOpen(true);
          }}
          icon={Plus}
          size="lg"
          className="rounded-full"
        >
          {t('addCustomerBtn')}
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

        {/* Status Filter Pill Buttons (Reference UI Style) */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: lang === 'ru' ? 'Все' : 'Barchasi' },
            { id: 'has_debt', label: lang === 'ru' ? 'Есть долг' : 'Qarzi bor' },
            { id: 'overdue', label: lang === 'ru' ? 'Просрочено' : 'Muddati o‘tgan' },
            { id: 'no_debt', label: lang === 'ru' ? 'Нет долга' : 'Qarzi yo‘q' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedStatus === tab.id
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List Display */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={lang === 'ru' ? "Клиенты не найдены" : "Mijozlar topilmadi"}
          description={
            searchQuery
              ? `"${searchQuery}" bo'yicha hech qanday mijoz topilmadi.`
              : (lang === 'ru' ? "Клиенты еще не добавлены." : "Hali mijozlar qo'shilmagan.")
          }
          actionLabel={`+ ${t('addCustomerBtn')}`}
          onAction={() => {
            setEditingCustomer(null);
            setIsAddModalOpen(true);
          }}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <CustomerTable
              customers={filteredCustomers}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteTargetId(id)}
            />
          </div>

          {/* Mobile Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteTargetId(id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCustomer(null);
        }}
        editingCustomer={editingCustomer}
        onSuccess={(msg) => {
          showToast(msg, 'success');
          refreshCustomers();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title={lang === 'ru' ? "Удалить клиента?" : "Mijozni o‘chirishni tasdiqlaysizmi?"}
        message={lang === 'ru' ? "Все долги и история платежей клиента будут удалены." : "Ushbu mijoz va uning barcha qarzlar tarixi o‘chib ketadi!"}
        confirmLabel={t('delete')}
        confirmVariant="rose"
      />
    </div>
  );
};
