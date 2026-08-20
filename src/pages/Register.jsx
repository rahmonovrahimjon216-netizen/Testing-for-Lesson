import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BadgeDollarSign, User, Phone, Store, Lock, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    businessName: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { lang, changeLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = lang === 'ru' ? "Укажите имя." : "Ism kiritilishi shart.";
    if (!formData.phone.trim() || formData.phone.length < 9) errs.phone = lang === 'ru' ? "Неверный номер." : "Telefon raqami noto‘g‘ri.";
    if (!formData.businessName.trim()) errs.businessName = lang === 'ru' ? "Укажите магазин." : "Do'kon yoki biznes nomi shart.";
    if (!formData.password) errs.password = lang === 'ru' ? "Введите пароль." : "Parol kiriting.";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = lang === 'ru' ? "Пароли не совпадают." : "Parollar mos kelmadi.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: res.error || (lang === 'ru' ? "Ошибка регистрации!" : "Ro'yxatdan o'tishda xatolik yuz berdi!") });
      }
    } catch (err) {
      setErrors({ general: err.message || "Xatolik!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f8] dark:bg-[#070b15] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans transition-colors duration-200">
      {/* Main Card Wrapper */}
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[36px] shadow-2xl shadow-slate-200/60 dark:shadow-none overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] border border-slate-100 dark:border-slate-800 my-4">
        
        {/* Left Column: Form Side */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6">
          
          {/* Top Logo, Theme Toggle & Language Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <BadgeDollarSign className="w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                Qarz<span className="text-emerald-600 dark:text-emerald-400">Daftar</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Dark / Light Mode Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title={theme === 'dark' ? "Light mode" : "Dark mode"}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Language Switcher Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black">
                <button
                  type="button"
                  onClick={() => changeLanguage('uz')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    lang === 'uz'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  UZ 🇺🇿
                </button>
                <button
                  type="button"
                  onClick={() => changeLanguage('ru')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    lang === 'ru'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  RU 🇷🇺
                </button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="my-auto space-y-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('registerTitle')}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                {t('registerSubtitle')}
              </p>
            </div>

            {/* Main Register Form */}
            <form onSubmit={handleRegister} className="space-y-3.5">
              {errors.general && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-xs font-bold text-rose-600 dark:text-rose-400">
                  {errors.general}
                </div>
              )}

              {/* Name Input */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  {t('fullNameLabel')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rahimjon Qodirov"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-100/70 dark:bg-slate-800/60 border-0 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.name}</p>}
              </div>

              {/* Phone & Business Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {t('phoneLabel')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="+998901234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-100/70 dark:bg-slate-800/60 border-0 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {t('businessNameLabel')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Store className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Savdo Plus"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full bg-slate-100/70 dark:bg-slate-800/60 border-0 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                    />
                  </div>
                  {errors.businessName && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.businessName}</p>}
                </div>
              </div>

              {/* Password & Confirm Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {t('passwordLabel')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-100/70 dark:bg-slate-800/60 border-0 rounded-2xl py-3 pl-10 pr-8 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                    />
                  </div>
                  {errors.password && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {t('confirmNewPasswordLabel')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-slate-100/70 dark:bg-slate-800/60 border-0 rounded-2xl py-3 pl-10 pr-8 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#40233f] dark:bg-emerald-600 hover:bg-[#2f192e] dark:hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#40233f]/30 dark:shadow-emerald-600/30 transition-all active:scale-[0.99] mt-3"
              >
                {loading ? "..." : t('registerBtn')}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <div className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-bold text-slate-900 dark:text-white hover:underline ml-1">
              {t('loginLink')}
            </Link>
          </div>
        </div>

        {/* Right Column: Poster Image */}
        <div className="hidden lg:block lg:col-span-6 p-4">
          <div className="relative w-full h-full min-h-[560px] rounded-[32px] rounded-tl-[80px] rounded-br-[80px] overflow-hidden shadow-xl bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
              alt="QarzDaftar Platform"
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-slate-950/60" />

            <div className="absolute top-10 right-10 left-16 text-right space-y-2">
              <h3 className="text-2xl font-black text-white leading-tight drop-shadow-md tracking-tight">
                {lang === 'ru' ? "Управление долгами и клиентами" : "Qarzlar va mijozlarni qulay boshqarish"}
              </h3>
              <p className="text-xs font-medium text-emerald-300/90 tracking-wide">
                {lang === 'ru' ? "Простой и эффективный учет для вашего бизнеса." : "Biznesingiz uchun qulay va ishonchli hisob-kitob tizimi."}
              </p>
            </div>

            <div className="absolute bottom-8 left-8 right-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-300">{lang === 'ru' ? "Надежная система" : "Ishonchli va qulay"}</p>
                <p className="text-base font-black text-white">QarzDaftar SaaS</p>
              </div>
              <div className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-extrabold text-xs whitespace-nowrap">
                {lang === 'ru' ? "АКТИВНО" : "FAOL"}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
