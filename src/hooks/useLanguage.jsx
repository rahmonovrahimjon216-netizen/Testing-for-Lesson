import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  uz: {
    // Navigation & Common
    dashboard: "Bosh sahifa",
    customers: "Mijozlar",
    debts: "Qarzlar",
    payments: "To‘lovlar",
    statistics: "Statistika",
    reports: "Hisobotlar",
    notifications: "Xabarnomalar",
    settings: "Sozlamalar",
    logout: "Chiqish",
    welcome: "Xush kelibsiz",
    search: "Qidirish...",
    save: "Saqlash",
    cancel: "Bekor qilish",
    delete: "O‘chirish",
    edit: "Tahrirlash",
    add: "Qo‘shish",
    back: "Orqaga",
    action: "Amallar",
    status: "Holati",

    // Auth - Login
    loginTitle: "Xush kelibsiz",
    loginSubtitle: "Tizimga kirish uchun ma'lumotlaringizni kiriting",
    phoneLabel: "Telefon raqami",
    passwordLabel: "Parol",
    rememberMe: "Eslab qolish",
    forgotPassword: "Parolni unutdingizmi?",
    loginBtn: "Kirish",
    noAccount: "Hisobingiz yo‘qmi?",
    registerLink: "Ro‘yxatdan o‘tish",
    
    // Auth - Forgot Password Modal
    resetPasswordTitle: "Parolni SMS orqali Tiklash",
    sendSmsBtn: "SMS Kodini Yuborish",
    verifyCodeBtn: "Kodni Tasdiqlash",
    enterSmsCode: "4 Xonali SMS Tasdiqlash Kodi",
    newPasswordLabel: "Yangi Parol",
    confirmNewPasswordLabel: "Yangi Parolni Tasdiqlash",
    savePasswordBtn: "Parolni Saqlash",
    smsSentSuccess: "SMS tasdiqlash kodi yuborildi!",

    // Auth - Register
    registerTitle: "Ro‘yxatdan o‘tish",
    registerSubtitle: "QarzDaftar platformasida o‘z biznesingizni boshlang",
    fullNameLabel: "Ism-familiyangiz",
    businessNameLabel: "Biznes / Do'koningiz nomi",
    addressLabel: "Do'koningiz manzili",
    registerBtn: "Ro‘yxatdan o‘tish",
    alreadyHaveAccount: "Hisobingiz bormi?",
    loginLink: "Tizimga kirish",

    // Dashboard
    totalDebts: "Jami qarzlar",
    totalPaid: "Jami undirilgan",
    activeCustomersCount: "Faol qarzdorlar",
    overdueDebtsCount: "Muddati o'tganlar",
    recentDebts: "So'nggi qarzlar",
    recentPayments: "So'nggi to'lovlar",
    addDebt: "+ Yangi Qarz",
    addPayment: "+ To'lov Qabul Qilish",

    // Customers
    addCustomerBtn: "Mijoz qo‘shish",
    customerName: "Mijoz ismi",
    remainingDebt: "Qolgan qarz",

    // Settings
    themeSettings: "Tizim ko'rinishi",
    langSettings: "Tizim tili",
    lightMode: "Yorug' rejim (Light)",
    darkMode: "Qorong'u rejim (Dark)",
    supabaseStatus: "Supabase Backend Ulangan",
    testConnection: "Ulanishni Tekshirish"
  },
  ru: {
    // Navigation & Common
    dashboard: "Главная",
    customers: "Клиенты",
    debts: "Долги",
    payments: "Платежи",
    statistics: "Статистика",
    reports: "Отчеты",
    notifications: "Уведомления",
    settings: "Настройки",
    logout: "Выйти",
    welcome: "Добро пожаловать",
    search: "Поиск...",
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    edit: "Изменить",
    add: "Добавить",
    back: "Назад",
    action: "Действия",
    status: "Статус",

    // Auth - Login
    loginTitle: "Добро пожаловать",
    loginSubtitle: "Введите данные для входа в систему",
    phoneLabel: "Номер телефона",
    passwordLabel: "Пароль",
    rememberMe: "Запомнить меня",
    forgotPassword: "Забыли пароль?",
    loginBtn: "Войти",
    noAccount: "Нет аккаунта?",
    registerLink: "Зарегистрироваться",
    
    // Auth - Forgot Password Modal
    resetPasswordTitle: "Сброс пароля по SMS",
    sendSmsBtn: "Отправить SMS код",
    verifyCodeBtn: "Подтвердить код",
    enterSmsCode: "4-значный SMS код подтверждения",
    newPasswordLabel: "Новый пароль",
    confirmNewPasswordLabel: "Подтвердите новый пароль",
    savePasswordBtn: "Сохранить пароль",
    smsSentSuccess: "SMS код подтверждения отправлен!",

    // Auth - Register
    registerTitle: "Регистрация",
    registerSubtitle: "Начните вести учет бизнеса в QarzDaftar",
    fullNameLabel: "Ваше имя и фамилия",
    businessNameLabel: "Название магазина / бизнеса",
    addressLabel: "Адрес магазина",
    registerBtn: "Зарегистрироваться",
    alreadyHaveAccount: "Уже есть аккаунт?",
    loginLink: "Войти в систему",

    // Dashboard
    totalDebts: "Общий долг",
    totalPaid: "Всего оплачено",
    activeCustomersCount: "Активные должники",
    overdueDebtsCount: "Просрочено",
    recentDebts: "Последние долги",
    recentPayments: "Последние платежи",
    addDebt: "+ Новый долг",
    addPayment: "+ Принять оплату",

    // Customers
    addCustomerBtn: "Добавить клиента",
    customerName: "Имя клиента",
    remainingDebt: "Остаток долга",

    // Settings
    themeSettings: "Внешний вид",
    langSettings: "Язык системы",
    lightMode: "Светлый режим",
    darkMode: "Темный режим",
    supabaseStatus: "Supabase Backend Подключен",
    testConnection: "Проверить соединение"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('qarzdaftar_lang') || 'uz';
  });

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('qarzdaftar_lang', newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['uz']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
