import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User, CreditCard, DollarSign, Calendar, FileText } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { debtService } from '../../services/debtService';
import { paymentService } from '../../services/paymentService';
import { formatCurrency } from '../../utils/formatCurrency';
import { getTodayDateString } from '../../utils/formatDate';

export const AddPaymentModal = ({ isOpen, onClose, onSuccess, defaultCustomerId = null, defaultDebtId = null }) => {
  const [customers, setCustomers] = useState([]);
  const [customerDebts, setCustomerDebts] = useState([]);
  
  const [formData, setFormData] = useState({
    customerId: defaultCustomerId || '',
    debtId: defaultDebtId || '',
    amount: '',
    method: 'Naqd',
    date: getTodayDateString(),
    note: ''
  });

  const [selectedDebt, setSelectedDebt] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const allCust = customerService.getAll();
      setCustomers(allCust);
      const custId = defaultCustomerId || (allCust.length > 0 ? allCust[0].id : '');
      setFormData(prev => ({
        ...prev,
        customerId: custId,
        debtId: defaultDebtId || '',
        amount: '',
        method: 'Naqd',
        date: getTodayDateString(),
        note: ''
      }));
      setErrors({});
    }
  }, [isOpen, defaultCustomerId, defaultDebtId]);

  useEffect(() => {
    if (formData.customerId) {
      const debts = debtService.getByCustomerId(formData.customerId).filter(d => d.remainingAmount > 0);
      setCustomerDebts(debts);
      
      if (formData.debtId) {
        const found = debts.find(d => d.id === formData.debtId);
        setSelectedDebt(found || (debts.length > 0 ? debts[0] : null));
        if (!found && debts.length > 0) {
          setFormData(prev => ({ ...prev, debtId: debts[0].id }));
        }
      } else if (debts.length > 0) {
        setFormData(prev => ({ ...prev, debtId: debts[0].id }));
        setSelectedDebt(debts[0]);
      } else {
        setSelectedDebt(null);
      }
    } else {
      setCustomerDebts([]);
      setSelectedDebt(null);
    }
  }, [formData.customerId, formData.debtId]);

  const handleDebtChange = (debtId) => {
    setFormData(prev => ({ ...prev, debtId }));
    const found = customerDebts.find(d => d.id === debtId);
    setSelectedDebt(found || null);
    if (found) {
      setFormData(prev => ({ ...prev, amount: found.remainingAmount }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customerId) {
      newErrors.customerId = "Mijoz tanlanishi shart.";
    }
    if (!formData.debtId || !selectedDebt) {
      newErrors.debtId = "To'lanishi kerak bo'lgan qarz tanlanishi shart.";
    }
    const numAmount = Number(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Summa 0 dan katta bo‘lishi kerak.";
    } else if (selectedDebt && numAmount > selectedDebt.remainingAmount) {
      newErrors.amount = `Summa qolgan qarzdan (${formatCurrency(selectedDebt.remainingAmount)}) ko'p bo'lishi mumkin emas.`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      paymentService.add(formData);
      onSuccess("✅ To‘lov qabul qilindi va qarz summasi yangilandi!");
      onClose();
    } catch (err) {
      setErrors({ amount: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="+ To‘lov kiritish" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" /> Mijoz <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value, debtId: '' })}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
          >
            <option value="">-- Mijozni tanlang --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({formatCurrency(c.remainingAmount)} qarz)
              </option>
            ))}
          </select>
          {errors.customerId && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.customerId}</p>}
        </div>

        {/* Debt Select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Qaysi qarz uchun? <span className="text-rose-500">*</span>
          </label>
          {customerDebts.length === 0 ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs border border-amber-200 dark:border-amber-900/60 font-medium">
              Bu mijozda faol to'lanmagan qarz yo'q.
            </div>
          ) : (
            <select
              value={formData.debtId}
              onChange={(e) => handleDebtChange(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            >
              {customerDebts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.product} - {formatCurrency(d.remainingAmount)} qolgan
                </option>
              ))}
            </select>
          )}
          {errors.debtId && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.debtId}</p>}
        </div>

        {selectedDebt && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">Mahsulot:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{selectedDebt.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jami qarz summasi:</span>
              <span className="font-semibold">{formatCurrency(selectedDebt.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Qolgan summa:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{formatCurrency(selectedDebt.remainingAmount)}</span>
            </div>
          </div>
        )}

        {/* Payment Amount */}
        <Input
          label="To'lov summasi (so'm)"
          required
          type="number"
          min="1"
          icon={DollarSign}
          placeholder="Masalan: 500 000"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={errors.amount}
        />

        {/* Payment method */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" /> To'lov usuli
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {['Naqd', 'Karta', 'Click', 'Payme', 'Boshqa'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFormData({ ...formData, method: m })}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  formData.method === m
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <Input
          label="To'lov sanasi"
          required
          type="date"
          icon={Calendar}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        {/* Note */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" /> Izoh
          </label>
          <textarea
            rows={2}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="To'lov haqida izoh..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-full">
            Bekor qilish
          </Button>
          <Button type="submit" disabled={loading || !selectedDebt} className="rounded-full">
            {loading ? "Qabul qilinmoqda..." : "To'lovni kiritish"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
