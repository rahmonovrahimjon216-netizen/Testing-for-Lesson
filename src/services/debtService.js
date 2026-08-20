import { storageService } from './storageService';
import { customerService } from './customerService';
import { calculateDebtStatus } from '../utils/calculateDebt';
import { supabaseService } from './supabaseService';

export const debtService = {
  getAll: () => {
    const debts = storageService.get(storageService.KEYS.DEBTS, []);
    // Re-evaluate overdue statuses dynamically based on current date
    return debts.map(debt => {
      const status = calculateDebtStatus(debt.paidAmount, debt.totalAmount, debt.dueDate);
      return { ...debt, status };
    });
  },

  getById: (id) => {
    const debts = debtService.getAll();
    return debts.find(d => d.id === id) || null;
  },

  getByCustomerId: (customerId) => {
    const debts = debtService.getAll();
    return debts.filter(d => d.customerId === customerId);
  },

  add: (debtData) => {
    const debts = storageService.get(storageService.KEYS.DEBTS, []);
    const quantity = Number(debtData.quantity) || 1;
    const price = Number(debtData.price) || 0;
    const totalAmount = debtData.totalAmount ? Number(debtData.totalAmount) : (quantity * price);
    const paidAmount = Number(debtData.paidAmount) || 0;
    const remainingAmount = Math.max(0, totalAmount - paidAmount);
    const status = calculateDebtStatus(paidAmount, totalAmount, debtData.dueDate);

    const customer = customerService.getById(debtData.customerId);
    const customerName = customer ? customer.name : debtData.customerName || 'Noma\'lum mijoz';

    const newDebt = {
      id: `debt-${Date.now()}`,
      customerId: debtData.customerId,
      customerName,
      product: debtData.product.trim(),
      quantity,
      price,
      totalAmount,
      paidAmount,
      remainingAmount,
      dueDate: debtData.dueDate,
      status,
      note: debtData.note || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newDebt, ...debts];
    storageService.set(storageService.KEYS.DEBTS, updated);

    // Sync to Supabase
    supabaseService.upsertDebt(newDebt).catch(err => console.warn("Supabase sync warning:", err));

    // Update customer stats
    customerService.recalculateCustomerTotals(debtData.customerId);

    return newDebt;
  },

  update: (id, debtData) => {
    const debts = storageService.get(storageService.KEYS.DEBTS, []);
    const index = debts.findIndex(d => d.id === id);
    if (index === -1) return null;

    const oldDebt = debts[index];
    const quantity = debtData.quantity !== undefined ? Number(debtData.quantity) : oldDebt.quantity;
    const price = debtData.price !== undefined ? Number(debtData.price) : oldDebt.price;
    const totalAmount = debtData.totalAmount !== undefined ? Number(debtData.totalAmount) : (quantity * price);
    const paidAmount = debtData.paidAmount !== undefined ? Number(debtData.paidAmount) : oldDebt.paidAmount;
    const remainingAmount = Math.max(0, totalAmount - paidAmount);
    const dueDate = debtData.dueDate || oldDebt.dueDate;
    const status = calculateDebtStatus(paidAmount, totalAmount, dueDate);

    debts[index] = {
      ...oldDebt,
      ...debtData,
      quantity,
      price,
      totalAmount,
      paidAmount,
      remainingAmount,
      dueDate,
      status
    };

    storageService.set(storageService.KEYS.DEBTS, debts);

    // Sync to Supabase
    supabaseService.upsertDebt(debts[index]).catch(err => console.warn("Supabase sync warning:", err));

    customerService.recalculateCustomerTotals(oldDebt.customerId);
    return debts[index];
  },

  delete: (id) => {
    const debts = storageService.get(storageService.KEYS.DEBTS, []);
    const debt = debts.find(d => d.id === id);
    if (!debt) return;

    const updated = debts.filter(d => d.id !== id);
    storageService.set(storageService.KEYS.DEBTS, updated);

    // Sync to Supabase
    supabaseService.deleteDebt(id).catch(err => console.warn("Supabase sync warning:", err));

    // Remove associated payments
    const payments = storageService.get(storageService.KEYS.PAYMENTS, []);
    storageService.set(storageService.KEYS.PAYMENTS, payments.filter(p => p.debtId !== id));

    customerService.recalculateCustomerTotals(debt.customerId);
  }
};
