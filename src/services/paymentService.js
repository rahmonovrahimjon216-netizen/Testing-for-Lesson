import { storageService } from './storageService';
import { debtService } from './debtService';
import { customerService } from './customerService';
import { formatCurrency } from '../utils/formatCurrency';
import { supabaseService } from './supabaseService';

export const paymentService = {
  getAll: () => {
    return storageService.get(storageService.KEYS.PAYMENTS, []);
  },

  getByCustomerId: (customerId) => {
    const payments = paymentService.getAll();
    return payments.filter(p => p.customerId === customerId);
  },

  add: (paymentData) => {
    const payments = storageService.get(storageService.KEYS.PAYMENTS, []);
    const amount = Number(paymentData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      throw new Error("To'lov summasi 0 dan katta bo'lishi kerak!");
    }

    const debt = debtService.getById(paymentData.debtId);
    if (!debt) {
      throw new Error("Tegishli qarz topilmadi!");
    }

    if (amount > debt.remainingAmount) {
      throw new Error(`To'lov summasi qolgan qarzdan (${formatCurrency(debt.remainingAmount)}) ko'p bo'lishi mumkin emas!`);
    }

    const newPayment = {
      id: `pay-${Date.now()}`,
      customerId: debt.customerId,
      customerName: debt.customerName,
      debtId: debt.id,
      product: debt.product,
      amount,
      method: paymentData.method || 'Naqd',
      date: paymentData.date || new Date().toISOString().split('T')[0],
      note: paymentData.note || ''
    };

    const updatedPayments = [newPayment, ...payments];
    storageService.set(storageService.KEYS.PAYMENTS, updatedPayments);

    // Sync to Supabase
    supabaseService.insertPayment(newPayment).catch(err => console.warn("Supabase sync warning:", err));

    // Update debt paid & remaining amount
    const newPaidAmount = debt.paidAmount + amount;
    debtService.update(debt.id, {
      paidAmount: newPaidAmount
    });

    // Add notification
    const notifs = storageService.get(storageService.KEYS.NOTIFICATIONS, []);
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: "success",
      title: "Yangi to'lov",
      message: `${debt.customerName} ${formatCurrency(amount)} to‘ladi (${newPayment.method}).`,
      time: "Hozirgina",
      read: false,
      date: newPayment.date
    };
    storageService.set(storageService.KEYS.NOTIFICATIONS, [newNotif, ...notifs]);

    return newPayment;
  },

  delete: (id) => {
    const payments = paymentService.getAll();
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    const updated = payments.filter(p => p.id !== id);
    storageService.set(storageService.KEYS.PAYMENTS, updated);

    // Sync to Supabase
    supabaseService.deletePayment(id).catch(err => console.warn("Supabase sync warning:", err));

    // Revert debt paid amount
    const debt = debtService.getById(payment.debtId);
    if (debt) {
      const newPaidAmount = Math.max(0, debt.paidAmount - payment.amount);
      debtService.update(debt.id, { paidAmount: newPaidAmount });
    }
  }
};
