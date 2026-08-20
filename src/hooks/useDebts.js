import { useState, useEffect, useCallback } from 'react';
import { debtService } from '../services/debtService';

export const useDebts = (customerId = null) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDebts = useCallback(() => {
    setLoading(true);
    try {
      if (customerId) {
        setDebts(debtService.getByCustomerId(customerId));
      } else {
        setDebts(debtService.getAll());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const addDebt = (debtData) => {
    const newDebt = debtService.add(debtData);
    fetchDebts();
    return newDebt;
  };

  const updateDebt = (id, debtData) => {
    const updated = debtService.update(id, debtData);
    fetchDebts();
    return updated;
  };

  const deleteDebt = (id) => {
    debtService.delete(id);
    fetchDebts();
  };

  return {
    debts,
    loading,
    refreshDebts: fetchDebts,
    addDebt,
    updateDebt,
    deleteDebt
  };
};
