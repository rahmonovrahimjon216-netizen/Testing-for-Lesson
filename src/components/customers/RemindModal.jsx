import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Send, MessageSquare, PhoneCall } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const RemindModal = ({ isOpen, onClose, customer, onSendReminder }) => {
  if (!customer) return null;

  const handleTelegram = () => {
    onSendReminder(`📲 Telegram orqali ${customer.name}ga qarz eslatmasi yuborildi!`);
    onClose();
  };

  const handleSMS = () => {
    onSendReminder(`💬 SMS xabarnoma ${customer.phone} raqamiga muvaffaqiyatli yuborildi!`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Qarzni eslatish">
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {customer.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {customer.phone}
          </p>
          <div className="pt-2 text-xs font-bold text-rose-600 dark:text-rose-400">
            Qolgan qarz: {formatCurrency(customer.remainingAmount)}
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handleTelegram}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-sky-200 dark:border-sky-800/60 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500 text-white group-hover:scale-105 transition-transform">
                <Send className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold">Telegram orqali eslatish</span>
                <span className="block text-[11px] text-sky-600 dark:text-sky-400">Tayyor xabarni Telegram bot orqali jo'natadi</span>
              </div>
            </div>
          </button>

          <button
            onClick={handleSMS}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500 text-white group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold">SMS orqali eslatish</span>
                <span className="block text-[11px] text-emerald-600 dark:text-emerald-400">SMS shlyuzi orqali avtomatik SMS yuboradi</span>
              </div>
            </div>
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Yopish
          </Button>
        </div>
      </div>
    </Modal>
  );
};
