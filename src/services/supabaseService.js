import { supabase } from '../lib/supabase';

export const supabaseService = {
  // Sync all local data to Supabase database
  syncLocalToSupabase: async (customers, debts, payments, notifications) => {
    try {
      if (customers && customers.length > 0) {
        const mappedCustomers = customers.map(c => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          address: c.address || '',
          total_debt: c.totalDebt || 0,
          paid_amount: c.paidAmount || 0,
          remaining_amount: c.remainingAmount || 0,
          status: c.status || "Qarzi yo‘q",
          created_at: c.createdAt || new Date().toISOString().split('T')[0],
          note: c.note || ''
        }));
        await supabase.from('customers').upsert(mappedCustomers);
      }

      if (debts && debts.length > 0) {
        const mappedDebts = debts.map(d => ({
          id: d.id,
          customer_id: d.customerId,
          customer_name: d.customerName,
          product: d.product,
          quantity: d.quantity || 1,
          price: d.price || 0,
          total_amount: d.totalAmount || 0,
          paid_amount: d.paidAmount || 0,
          remaining_amount: d.remainingAmount || 0,
          due_date: d.dueDate,
          created_at: d.createdAt || new Date().toISOString().split('T')[0],
          status: d.status || 'Faol',
          note: d.note || ''
        }));
        await supabase.from('debts').upsert(mappedDebts);
      }

      if (payments && payments.length > 0) {
        const mappedPayments = payments.map(p => ({
          id: p.id,
          customer_id: p.customerId,
          customer_name: p.customerName,
          debt_id: p.debtId || null,
          product: p.product || '',
          amount: p.amount || 0,
          method: p.method || 'Naqd',
          date: p.date,
          created_at: p.date,
          note: p.note || ''
        }));
        await supabase.from('payments').upsert(mappedPayments);
      }

      return { success: true };
    } catch (err) {
      console.warn("Supabase sync warning:", err);
      return { success: false, error: err.message };
    }
  },

  // Fetch all customers from Supabase
  fetchCustomers: async () => {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(c => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      address: c.address,
      totalDebt: Number(c.total_debt),
      paidAmount: Number(c.paid_amount),
      remainingAmount: Number(c.remaining_amount),
      status: c.status,
      createdAt: c.created_at,
      note: c.note
    }));
  },

  // Insert or update customer
  upsertCustomer: async (customer) => {
    const payload = {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address || '',
      total_debt: customer.totalDebt || 0,
      paid_amount: customer.paidAmount || 0,
      remaining_amount: customer.remainingAmount || 0,
      status: customer.status || "Qarzi yo‘q",
      created_at: customer.createdAt || new Date().toISOString().split('T')[0],
      note: customer.note || ''
    };
    const { data, error } = await supabase.from('customers').upsert(payload).select().single();
    if (error) console.error("Supabase upsertCustomer error:", error);
    return data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) console.error("Supabase deleteCustomer error:", error);
  },

  // Fetch debts
  fetchDebts: async () => {
    const { data, error } = await supabase.from('debts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(d => ({
      id: d.id,
      customerId: d.customer_id,
      customerName: d.customer_name,
      product: d.product,
      quantity: Number(d.quantity),
      price: Number(d.price),
      totalAmount: Number(d.total_amount),
      paidAmount: Number(d.paid_amount),
      remainingAmount: Number(d.remaining_amount),
      dueDate: d.due_date,
      createdAt: d.created_at,
      status: d.status,
      note: d.note
    }));
  },

  // Insert or update debt
  upsertDebt: async (debt) => {
    const payload = {
      id: debt.id,
      customer_id: debt.customerId,
      customer_name: debt.customerName,
      product: debt.product,
      quantity: debt.quantity || 1,
      price: debt.price || 0,
      total_amount: debt.totalAmount || 0,
      paid_amount: debt.paidAmount || 0,
      remaining_amount: debt.remainingAmount || 0,
      due_date: debt.dueDate,
      created_at: debt.createdAt || new Date().toISOString().split('T')[0],
      status: debt.status || 'Faol',
      note: debt.note || ''
    };
    const { data, error } = await supabase.from('debts').upsert(payload).select().single();
    if (error) console.error("Supabase upsertDebt error:", error);
    return data;
  },

  // Delete debt
  deleteDebt: async (id) => {
    const { error } = await supabase.from('debts').delete().eq('id', id);
    if (error) console.error("Supabase deleteDebt error:", error);
  },

  // Insert payment
  insertPayment: async (payment) => {
    const payload = {
      id: payment.id,
      customer_id: payment.customerId,
      customer_name: payment.customerName,
      debt_id: payment.debtId || null,
      product: payment.product || '',
      amount: payment.amount || 0,
      method: payment.method || 'Naqd',
      date: payment.date,
      created_at: payment.date,
      note: payment.note || ''
    };
    const { data, error } = await supabase.from('payments').upsert(payload).select().single();
    if (error) console.error("Supabase insertPayment error:", error);
    return data;
  },

  // Delete payment
  deletePayment: async (id) => {
    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (error) console.error("Supabase deletePayment error:", error);
  },

  // Real-time live connection check
  testConnection: async () => {
    try {
      const res = await fetch(`https://edfespkhfrnppoxcjphr.supabase.co/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': 'sb_publishable_t1t1bxwzkp0122HWFnaXKA_hvPdLeFj'
        }
      });
      if (res.status === 200 || res.status === 401 || res.status === 404 || res.ok) {
        return { success: true, status: "SUCCESS", message: "Supabase ma'lumotlar bazasi faol ulangan!" };
      }
      return { success: false, status: "UNSUCCESSFUL", message: `Server javobi: ${res.status}` };
    } catch (err) {
      return { success: false, status: "UNSUCCESSFUL", message: err.message || "Ulanishda xatolik" };
    }
  }
};
