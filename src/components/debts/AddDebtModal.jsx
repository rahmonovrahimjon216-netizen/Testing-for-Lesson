import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Package, Hash, DollarSign, Calendar, FileText, User } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { debtService } from '../../services/debtService';
import { formatCurrency } from '../../utils/formatCurrency';

export const AddDebtModal = ({ isOpen, onClose, onSuccess, defaultCustomerId = null }) => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerId: defaultCustomerId || '',
    product: '',
    quantity: 1,
    price: '',
    totalAmount: 0,
    dueDate: '',
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const allCust = customerService.getAll();
      setCustomers(allCust);
      
      const defaultId = defaultCustomerId || (allCust.length > 0 ? allCust[0].id : '');
      
      // Default due date: 14 days from today
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 14);
      const dueDateStr = defaultDueDate.toISOString().split('T')[0];

      setFormData({
        customerId: defaultId,
        product: '',
        quantity: 1,
        price: '',
        totalAmount: 0,
        dueDate: dueDateStr,
        note: ''
      });
      setErrors({});
    }
  }, [isOpen, defaultCustomerId]);

  // Recalculate total dynamically
  const handleQuantityOrPriceChange = (field, val) => {
    const nextFormData = { ...formData, [field]: val };
    const q = Number(nextFormData.quantity) || 0;
    const p = Number(nextFormData.price) || 0;
    nextFormData.totalAmount = q * p;
    setFormData(nextFormData);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customerId) {
      newErrors.customerId = "Mijoz tanlanishi shart.";
    }
    if (!formData.product.trim()) {
      newErrors.product = "Mahsulot yoki xizmat nomi shart.";
    }
    if (Number(formData.quantity) <= 0) {
      newErrors.quantity = "Miqdor 0 dan katta bo‘lishi kerak.";
    }
    if (Number(formData.price) <= 0) {
      newErrors.price = "Narx 0 dan katta bo‘lishi kerak.";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "To'lov muddati tanlanishi shart.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      debtService.add(formData);
      onSuccess("✅ Qarz muvaffaqiyatli qo‘shildi.");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="+ Qarz qo‘shish" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" /> Mijoz <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            className={`w-full bg-white dark:bg-slate-900 border ${
              errors.customerId ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
            } rounded-2xl text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium`}
          >
            <option value="">-- Mijozni tanlang --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>
          {errors.customerId && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.customerId}</p>}
        </div>

        {/* Product / Service */}
        <Input
          label="Mahsulot yoki Xizmat nomi"
          required
          icon={Package}
          placeholder="Masalan: Un 50kg, Qurilish mollari, Xizmat haqim..."
          value={formData.product}
          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          error={errors.product}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quantity */}
          <Input
            label="Miqdor (dona / kg)"
            required
            type="number"
            min="1"
            icon={Hash}
            value={formData.quantity}
            onChange={(e) => handleQuantityOrPriceChange('quantity', e.target.value)}
            error={errors.quantity}
          />

          {/* Price */}
          <Input
            label="Birlik narxi (so'm)"
            required
            type="number"
            min="1"
            icon={DollarSign}
            placeholder="75 000"
            value={formData.price}
            onChange={(e) => handleQuantityOrPriceChange('price', e.target.value)}
            error={errors.price}
          />
        </div>

        {/* Total calculation auto preview */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between shadow-sm">
          <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300">
            Jami summa (avtomatik):
          </span>
          <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
            {formatCurrency(formData.totalAmount)}
          </span>
        </div>

        {/* Due date */}
        <Input
          label="To'lov muddati (Due Date)"
          required
          type="date"
          icon={Calendar}
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          error={errors.dueDate}
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
            placeholder="Izoh yozing..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-full">
            Bekor qilish
          </Button>
          <Button type="submit" disabled={loading} className="rounded-full">
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
