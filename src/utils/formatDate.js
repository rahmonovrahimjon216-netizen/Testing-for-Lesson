/**
 * Formats YYYY-MM-DD or ISO string into Uzbek readable date.
 * Example: "2026-08-19" -> "19.08.2026" or "19-avgust, 2026"
 */
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (format === 'short') {
    return `${day}.${month}.${year}`;
  }

  const monthsUz = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];

  return `${day}-${monthsUz[date.getMonth()]}, ${year}`;
};

export const getTodayDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isOverdue = (dueDateStr, remainingAmount) => {
  if (!dueDateStr || remainingAmount <= 0) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

export const isDueSoon = (dueDateStr, remainingAmount) => {
  if (!dueDateStr || remainingAmount <= 0) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 2;
};
