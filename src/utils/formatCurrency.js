/**
 * Formats a numeric amount into Uzbek Som string representation.
 * Example: 150000 -> "150 000 so'm"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return "0 so'm";
  const num = Math.round(Number(amount));
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
};

export const parseCurrencyInput = (str) => {
  if (!str) return 0;
  return Number(str.toString().replace(/\D/g, '')) || 0;
};
