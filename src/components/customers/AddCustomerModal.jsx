import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User, Phone, MapPin, FileText } from 'lucide-react';
import { customerService } from '../../services/customerService';

export const AddCustomerModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '+998',
    address: initialData?.address || '',
    note: initialData?.note || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Ism kiritilishi shart.";
    }
    if (!formData.phone.trim() || formData.phone.length < 9) {
      newErrors.phone = "Telefon raqami noto‘g‘ri.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (initialData) {
        customerService.update(initialData.id, formData);
        onSuccess("✅ Mijoz ma'lumotlari tahrirlandi.");
      } else {
        customerService.add(formData);
        onSuccess("✅ Mijoz muvaffaqiyatli qo‘shildi.");
      }
      onClose();
      setFormData({ name: '', phone: '+998', address: '', note: '' });
      setErrors({});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Mijozni tahrirlash" : "Yangi mijoz qo‘shish"}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Mijoz ismi"
          required
          icon={User}
          placeholder="Masalan: Ali Karimov"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="Telefon raqami"
          required
          icon={Phone}
          placeholder="+998 90 123 45 67"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
        />

        <Input
          label="Manzil"
          icon={MapPin}
          placeholder="Masalan: Toshkent sh., Chilonzor tumani"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" /> Izoh / Qo'shimcha ma'lumot
          </label>
          <textarea
            rows={3}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Mijoz haqida izoh..."
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
