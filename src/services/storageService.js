const KEYS = {
  CUSTOMERS: 'qarzdaftar_customers',
  DEBTS: 'qarzdaftar_debts',
  PAYMENTS: 'qarzdaftar_payments',
  NOTIFICATIONS: 'qarzdaftar_notifications',
  THEME: 'qarzdaftar_theme',
  USER: 'qarzdaftar_user'
};

export const storageService = {
  get: (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
    }
  },

  initDefaultData: () => {
    try {
      // Purge any mock/legacy customer records
      const existingCust = localStorage.getItem(KEYS.CUSTOMERS);
      if (!existingCust || existingCust.includes('cust-1') || existingCust.includes('Bekzod') || existingCust.includes('Karimov') || existingCust.includes('Ali') || existingCust.includes('Vali') || existingCust.includes('Sardor')) {
        localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify([]));
      }

      // Purge any mock/legacy debt records
      const existingDebts = localStorage.getItem(KEYS.DEBTS);
      if (!existingDebts || existingDebts.includes('debt-1') || existingDebts.includes('Karimov') || existingDebts.includes('Ali') || existingDebts.includes('Vali') || existingDebts.includes('Sardor')) {
        localStorage.setItem(KEYS.DEBTS, JSON.stringify([]));
      }

      // Purge any mock/legacy payment records (Ali Karimov, Vali Umarov, Nodira Qosimova, Sardor Rahimov)
      const existingPays = localStorage.getItem(KEYS.PAYMENTS);
      if (!existingPays || existingPays.includes('pay-1') || existingPays.includes('Karimov') || existingPays.includes('Ali') || existingPays.includes('Vali') || existingPays.includes('Sardor') || existingPays.includes('Nodira')) {
        localStorage.setItem(KEYS.PAYMENTS, JSON.stringify([]));
      }

      // Purge any mock/legacy notification records
      const existingNotifs = localStorage.getItem(KEYS.NOTIFICATIONS);
      if (!existingNotifs || existingNotifs.includes('notif-1') || existingNotifs.includes('Karimov') || existingNotifs.includes('Ali')) {
        localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
      }
    } catch (err) {
      console.error("initDefaultData error:", err);
    }
  },

  // Helper to completely clear all data to 0
  clearAllData: () => {
    localStorage.removeItem(KEYS.CUSTOMERS);
    localStorage.removeItem(KEYS.DEBTS);
    localStorage.removeItem(KEYS.PAYMENTS);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify([]));
    localStorage.setItem(KEYS.DEBTS, JSON.stringify([]));
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify([]));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
  },

  KEYS
};

// Execute cleanup of any mock data on load
storageService.initDefaultData();
