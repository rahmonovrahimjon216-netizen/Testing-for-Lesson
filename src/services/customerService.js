import { storageService } from './storageService';
import { calculateDebtStatus, getCustomerStatus } from '../utils/calculateDebt';
import { supabaseService } from './supabaseService';

export const customerService = {
  getAll: () => {
    return storageService.get(storageService.KEYS.CUSTOMERS, []);
  },

  getById: (id) => {
    const customers = customerService.getAll();
    return customers.find(c => c.id === id) || null;
  },

  add: (customerData) => {
    const customers = customerService.getAll();
    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: customerData.name.trim(),
      phone: customerData.phone.trim(),
      address: customerData.address || '',
      note: customerData.note || '',
      totalDebt: 0,
      paidAmount: 0,
      remainingAmount: 0,
      status: "Qarzi yo‘q",
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newCustomer, ...customers];
    storageService.set(storageService.KEYS.CUSTOMERS, updated);

    // Sync to Supabase
    supabaseService.upsertCustomer(newCustomer).catch(err => console.warn("Supabase sync warning:", err));

    // Add notification
    const notifs = storageService.get(storageService.KEYS.NOTIFICATIONS, []);
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: "info",
      title: "Yangi mijoz",
      message: `"${newCustomer.name}" tizimga qo'shildi.`,
      time: "Hozirgina",
      read: false,
      date: new Date().toISOString().split('T')[0]
    };
    storageService.set(storageService.KEYS.NOTIFICATIONS, [newNotif, ...notifs]);

    return newCustomer;
  },

  update: (id, customerData) => {
    const customers = customerService.getAll();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return null;

    customers[index] = {
      ...customers[index],
      ...customerData
    };

    storageService.set(storageService.KEYS.CUSTOMERS, customers);
    supabaseService.upsertCustomer(customers[index]).catch(err => console.warn("Supabase sync warning:", err));
    return customers[index];
  },

  delete: (id) => {
    const customers = customerService.getAll();
    const updated = customers.filter(c => c.id !== id);
    storageService.set(storageService.KEYS.CUSTOMERS, updated);

    // Sync to Supabase
    supabaseService.deleteCustomer(id).catch(err => console.warn("Supabase sync warning:", err));

    // Clean up customer debts & payments as well
    const debts = storageService.get(storageService.KEYS.DEBTS, []);
    const payments = storageService.get(storageService.KEYS.PAYMENTS, []);
    
    storageService.set(storageService.KEYS.DEBTS, debts.filter(d => d.customerId !== id));
    storageService.set(storageService.KEYS.PAYMENTS, payments.filter(p => p.customerId !== id));
  },

  // Recalculate customer aggregate numbers from their debts list
  recalculateCustomerTotals: (customerId) => {
    const customers = customerService.getAll();
    const debts = storageService.get(storageService.KEYS.DEBTS, []);
    const customerDebts = debts.filter(d => d.customerId === customerId);

    const totalDebt = customerDebts.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
    const paidAmount = customerDebts.reduce((sum, d) => sum + (d.paidAmount || 0), 0);
    const remainingAmount = Math.max(0, totalDebt - paidAmount);
    const status = getCustomerStatus(remainingAmount, customerDebts);

    const index = customers.findIndex(c => c.id === customerId);
    if (index !== -1) {
      customers[index] = {
        ...customers[index],
        totalDebt,
        paidAmount,
        remainingAmount,
        status
      };
      storageService.set(storageService.KEYS.CUSTOMERS, customers);
      supabaseService.upsertCustomer(customers[index]).catch(err => console.warn("Supabase sync warning:", err));
    }
  }
};
