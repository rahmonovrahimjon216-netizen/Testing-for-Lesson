import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext, Link } from 'react-router-dom';
import {
  User,
  Phone,
  MapPin,
  FileText,
  Plus,
  CreditCard,
  Edit3,
  Trash2,
  Bell,
  ArrowLeft,
  Calendar,
  History
} from 'lucide-react';

import { customerService } from '../services/customerService';
import { debtService } from '../services/debtService';
import { paymentService } from '../services/paymentService';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DebtTable } from '../components/debts/DebtTable';
import { PaymentTable } from '../components/payments/PaymentTable';
import { AddDebtModal } from '../components/debts/AddDebtModal';
import { AddPaymentModal } from '../components/payments/AddPaymentModal';
import { AddCustomerModal } from '../components/customers/AddCustomerModal';
import { RemindModal } from '../components/customers/RemindModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

export const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useOutletContext();

  const [customer, setCustomer] = useState(null);
  const [debts, setDebts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('debts'); // 'debts' or 'payments'

  // Modals state
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [isRemindOpen, setIsRemindOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteDebtId, setDeleteDebtId] = useState(null);

  const loadData = () => {
    const cust = customerService.getById(id);
    if (!cust) {
      navigate('/customers');
      return;
    }
    setCustomer(cust);
    setDebts(debtService.getByCustomerId(id));
    setPayments(paymentService.getByCustomerId(id));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleDeleteCustomer = () => {
    customerService.delete(id);
    showToast("🗑 Mijoz o‘chirildi.", "info");
    navigate('/customers');
  };

  const handleDeleteDebt = (debtId) => {
    debtService.delete(debtId);
    showToast("🗑 Qarz o'chirildi va mijoz balancesi qayta hisoblandi.", "info");
    loadData();
  };

  const handleDeletePayment = (paymentId) => {
    paymentService.delete(paymentId);
    showToast("🗑 To'lov o'chirildi va qarz summasi qayta tiklandi.", "info");
    loadData();
  };

  if (!customer) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button & title */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Mijozlar ro'yxatiga qaytish
        </Link>
        <Badge status={customer.status} />
      </div>

      {/* Main Profile & Stats Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          {/* Customer info */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center text-xl border border-emerald-200 dark:border-emerald-800">
              {customer.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {customer.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> {customer.phone}
                </span>
                {customer.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {customer.address}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formatDate(customer.createdAt, 'short')} dan beri
                </span>
              </div>
              {customer.note && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1">
                  "{customer.note}"
                </p>
              )}
            </div>
          </div>

          {/* Actions toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setIsAddDebtOpen(true)}
              icon={Plus}
              size="sm"
            >
              Qarz qo‘shish
            </Button>
            <Button
              onClick={() => setIsAddPaymentOpen(true)}
              icon={CreditCard}
              variant="secondary"
              size="sm"
            >
              To‘lov kiritish
            </Button>
            <Button
              onClick={() => setIsRemindOpen(true)}
              icon={Bell}
              variant="outline"
              size="sm"
              className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              Eslatish
            </Button>
            <Button
              onClick={() => setIsEditCustomerOpen(true)}
              icon={Edit3}
              variant="outline"
              size="sm"
            >
              Tahrirlash
            </Button>
            <Button
              onClick={() => setIsDeleteConfirmOpen(true)}
              icon={Trash2}
              variant="danger"
              size="sm"
            >
              O‘chirish
            </Button>
          </div>
        </div>

        {/* 3 Summary Financial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Jami qarz
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 block">
              {formatCurrency(customer.totalDebt)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
            <span className="block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              To‘langan
            </span>
            <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1 block">
              {formatCurrency(customer.paidAmount)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
            <span className="block text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Qolgan qarz
            </span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
              {formatCurrency(customer.remainingAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Debts & Payments History Tabs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('debts')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeTab === 'debts'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Qarzlar tarixi ({debts.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeTab === 'payments'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              To‘lovlar tarixi ({payments.length})
            </button>
          </div>
        </div>

        {activeTab === 'debts' ? (
          debts.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Bu mijozda hech qanday qarz yozuvi mavjud emas.
            </div>
          ) : (
            <DebtTable debts={debts} onDelete={(debtId) => setDeleteDebtId(debtId)} />
          )
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            Hali to'lovlar kiritilmagan.
          </div>
        ) : (
          <PaymentTable payments={payments} onDelete={handleDeletePayment} />
        )}
      </div>

      {/* Modals */}
      <AddDebtModal
        isOpen={isAddDebtOpen}
        onClose={() => setIsAddDebtOpen(false)}
        defaultCustomerId={customer.id}
        onSuccess={(msg) => {
          showToast(msg, 'success');
          loadData();
        }}
      />

      <AddPaymentModal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        defaultCustomerId={customer.id}
        onSuccess={(msg) => {
          showToast(msg, 'success');
          loadData();
        }}
      />

      <AddCustomerModal
        isOpen={isEditCustomerOpen}
        onClose={() => setIsEditCustomerOpen(false)}
        initialData={customer}
        onSuccess={(msg) => {
          showToast(msg, 'success');
          loadData();
        }}
      />

      <RemindModal
        isOpen={isRemindOpen}
        onClose={() => setIsRemindOpen(false)}
        customer={customer}
        onSendReminder={(msg) => showToast(msg, 'info')}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteCustomer}
        title="Mijozni o‘chirish"
        message={`"${customer.name}" va unga tegishli barcha ma'lumotlarni o'chirishni tasdiqlaysizmi?`}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteDebtId)}
        onClose={() => setDeleteDebtId(null)}
        onConfirm={() => handleDeleteDebt(deleteDebtId)}
        title="Qarzni o‘chirish"
        message="Haqiqatan ham bu qarzni va uning to'lovlarini o'chirmoqchimisiz?"
      />
    </div>
  );
};
