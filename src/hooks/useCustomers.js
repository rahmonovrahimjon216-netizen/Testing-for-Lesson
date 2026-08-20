import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    try {
      const data = customerService.getAll();
      setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const addCustomer = (customerData) => {
    const newCust = customerService.add(customerData);
    fetchCustomers();
    return newCust;
  };

  const updateCustomer = (id, customerData) => {
    const updated = customerService.update(id, customerData);
    fetchCustomers();
    return updated;
  };

  const deleteCustomer = (id) => {
    customerService.delete(id);
    fetchCustomers();
  };

  return {
    customers,
    loading,
    refreshCustomers: fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  };
};
