import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export const usePayments = (customerId = null) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(() => {
    setLoading(true);
    try {
      if (customerId) {
        setPayments(paymentService.getByCustomerId(customerId));
      } else {
        setPayments(paymentService.getAll());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const addPayment = (paymentData) => {
    const newPayment = paymentService.add(paymentData);
    fetchPayments();
    return newPayment;
  };

  const deletePayment = (id) => {
    paymentService.delete(id);
    fetchPayments();
  };

  return {
    payments,
    loading,
    refreshPayments: fetchPayments,
    addPayment,
    deletePayment
  };
};
