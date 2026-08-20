import { isOverdue } from './formatDate';

/**
 * Calculates debt item total and evaluates status based on remaining amount & due date.
 */
export const calculateDebtStatus = (paidAmount, totalAmount, dueDate) => {
  const remainingAmount = Math.max(0, totalAmount - paidAmount);
  
  if (remainingAmount <= 0) {
    return 'To‘langan';
  }
  
  if (isOverdue(dueDate, remainingAmount)) {
    return 'Muddati o‘tgan';
  }

  // Check if due today or tomorrow
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays >= 0 && diffDays <= 2) {
    return 'Yaqinlashmoqda';
  }
  
  return 'Faol';
};

/**
 * Calculates overall status for a customer based on their debts list.
 */
export const getCustomerStatus = (remainingAmount, customerDebts = []) => {
  if (remainingAmount <= 0) {
    return 'Qarzi yo‘q';
  }
  const hasOverdue = customerDebts.some(d => d.remainingAmount > 0 && isOverdue(d.dueDate, d.remainingAmount));
  if (hasOverdue) {
    return 'Muddati o‘tgan';
  }
  return 'Qarzi bor';
};
