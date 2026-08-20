import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BadgeDollarSign, Eye, EyeOff, Lock, Phone, KeyRound, CheckCircle2, ShieldCheck, MessageSquare, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { authService } from '../services/authService';

export const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Phone, 2: SMS Verification, 3: New Password, 4: Success
  const [resetPhone, setResetPhone] = useState('');
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [generatedSmsCode, setGeneratedSmsCode] = useState('');
  const [smsNotification, setSmsNotification] = useState(null); // Simulated incoming SMS popup
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { login } = useAuth();
  const { lang, changeLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setError(lang === 'ru' ? "Пожалуйста, введите номер телефона и пароль." : "Iltimos, telefon raqamingiz va parolingizni kiriting.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login(phone, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || (lang === 'ru' ? "Ошибка при входе!" : "Kirishda xatolik yuz berdi!"));
      }
    } catch (err) {
      setError(err.message || (lang === 'ru' ? "Ошибка входа!" : "Kirishda xatolik!"));
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send SMS code to phone
  const handleSendSms = (e) => {
    e.preventDefault();
    setResetError('');
    if (!resetPhone.trim() || resetPhone.length < 9) {
      setResetError(lang === 'ru' ? "Пожалуйста, введите правильный номер телефона." : "Iltimos, to'g'ri telefon raqamingizni kiriting.");
      return;
    }

    // Generate random 4-digit SMS verification code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedSmsCode(code);
    setResetStep(2);

    // Show realistic SMS Toast Banner
    setSmsNotification({
      phone: resetPhone,
      code
    });

    setTimeout(() => {
      setSmsNotification(null);
    }, 12000);
  };

  // Step 2: Verify SMS Code
  const handleVerifySmsCode = (e) => {
    e.preventDefault();
    setResetError('');
    if (resetCodeInput.trim() !== generatedSmsCode) {
      setResetError(lang === 'ru' ? "Неверный SMS код подтверждения." : "SMS tasdiqlash kodi noto'g'ri kiritildi.");
      return;
    }
    setResetStep(3);
  };

  // Step 3: Set New Password
  const handleSaveNewPassword = async (e) => {
    e.preventDefault();
    setResetError('');

    if (!newPassword || newPassword.length < 4) {
      setResetError(lang === 'ru' ? "Новый пароль должен содержать минимум 4 символа." : "Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError(lang === 'ru' ? "Пароли не совпадают." : "Parollar bir-biriga mos kelmadi.");
      return;
    }

    setResetLoading(true);
    try {
      const res = await authService.resetPassword(resetPhone, newPassword);
      if (res.success) {
        setPhone(resetPhone);
        setPassword(newPassword);
        setResetStep(4);
      } else {
        setResetError(res.error || (lang === 'ru' ? "Ошибка обновления пароля!" : "Parolni yangilashda xatolik!"));
      }
    } catch (err) {
      setResetError(err.message || "Xatolik yuz berdi!");
    } finally {
      setResetLoading(false);
    }
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setResetStep(1);
    setResetPhone('');
    setResetCodeInput('');
    setGeneratedSmsCode('');
    setSmsNotification(null);
    setNewPassword('');
    setConfirmNewPassword('');
    setResetError('');
  };

  return (
    <div className="min-h-screen bg-[#f3f4f8] dark:bg-[#070b15] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans transition-colors duration-200 relative">
      
      {/* Real-time SMS Toast Banner Popup */}
      {smsNotification && (
        <div className="fixed top-5 right-5 z-[100] max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/40 animate-bounce flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-300">
              <span>📲 {lang === 'ru' ? 'Новое SMS' : 'Yangi SMS keldi'}</span>
              <span className="text-[10px] text-emerald-400">{lang === 'ru' ? 'Сейчас' : 'Hozirgina'}</span>
            </div>
            <p className="mt-1 text-slate-200 font-medium">
              [QarzDaftar] <span className="font-bold">{smsNotification.phone}</span>:
            </p>
            <div className="mt-1 font-mono text-base font-black tracking-widest text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg inline-block border border-emerald-500/30">
              {smsNotification.code}
            </div>
          </div>
        </div>
      )}

      {/* Main Card Wrapper */}
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[36px] shadow-2xl shadow-slate-200/60 dark:shadow-none overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] border border-slate-100 dark:border-slate-800">
        
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

          {/* Center Form Section */}
          <div className="my-auto space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('loginTitle')}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                {t('loginSubtitle')}
              </p>
            </div>

            {/* Main Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-xs font-bold text-rose-600 dark:text-rose-400">
                  {error}
                </div>
              )}

              {/* Phone Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t('phoneLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-100/70 dark:bg-slate-800/60 border-0 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-100/70 dark:bg-slate-800/60 border-0 rounded-2xl py-3.5 pl-11 pr-11 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600 cursor-pointer"
                  />
                  {t('rememberMe')}
                </label>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-slate-900 dark:text-slate-100 hover:underline font-bold"
                >
                  {t('forgotPassword')}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#40233f] dark:bg-emerald-600 hover:bg-[#2f192e] dark:hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[#40233f]/30 dark:shadow-emerald-600/30 transition-all active:scale-[0.99] mt-2"
              >
                {loading ? "..." : t('loginBtn')}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <div className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 pt-2">
            {t('noAccount')}{' '}
            <Link to="/register" className="font-bold text-slate-900 dark:text-white hover:underline ml-1">
              {t('registerLink')}
            </Link>
          </div>
        </div>

        {/* Right Column: Poster Image */}
        <div className="hidden lg:block lg:col-span-6 p-4">
          <div className="relative w-full h-full min-h-[520px] rounded-[32px] rounded-tl-[80px] rounded-br-[80px] overflow-hidden shadow-xl bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
              alt="QarzDaftar Business"
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

      {/* SMS Verification Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {t('resetPasswordTitle')}
                  </h3>
                </div>
              </div>

              <button
                onClick={closeResetModal}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {resetError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-xs font-bold text-rose-600 dark:text-rose-400">
                {resetError}
              </div>
            )}

            {/* STEP 1: Enter Phone & Request SMS Code */}
            {resetStep === 1 && (
              <form onSubmit={handleSendSms} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {t('phoneLabel')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="+998 90 123 45 67"
                      value={resetPhone}
                      onChange={(e) => setResetPhone(e.target.value)}
                      className="w-full bg-slate-100/80 dark:bg-slate-800/60 border-0 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {t('sendSmsBtn')}
                </button>
              </form>
            )}

            {/* STEP 2: Input Received SMS Code */}
            {resetStep === 2 && (
              <form onSubmit={handleVerifySmsCode} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-medium space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>📲 {t('smsSentSuccess')}</span>
                  </div>
                  <p>
                    <span className="font-bold">{resetPhone}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {t('enterSmsCode')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="••••"
                      value={resetCodeInput}
                      onChange={(e) => setResetCodeInput(e.target.value)}
                      className="w-full bg-slate-100/80 dark:bg-slate-800/60 border-0 rounded-2xl py-3.5 pl-11 pr-4 text-center font-mono text-lg tracking-[0.5em] font-extrabold text-slate-900 dark:text-white placeholder:tracking-normal placeholder:font-sans outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setResetStep(1)}
                    className="w-1/3 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition-all"
                  >
                    {t('back')}
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99]"
                  >
                    {t('verifyCodeBtn')}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Enter New Password */}
            {resetStep === 3 && (
              <form onSubmit={handleSaveNewPassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {t('newPasswordLabel')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-100/80 dark:bg-slate-800/60 border-0 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {t('confirmNewPasswordLabel')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full bg-slate-100/80 dark:bg-slate-800/60 border-0 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99]"
                >
                  {resetLoading ? "..." : t('savePasswordBtn')}
                </button>
              </form>
            )}

            {/* STEP 4: Success Message */}
            {resetStep === 4 && (
              <div className="text-center space-y-4 py-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {lang === 'ru' ? "Пароль успешно обновлен!" : "Parolingiz Muvaffaqiyatli Yangilandi!"}
                  </h4>
                </div>
                <button
                  onClick={closeResetModal}
                  className="w-full py-3.5 bg-[#40233f] dark:bg-emerald-600 hover:bg-[#2f192e] dark:hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all active:scale-[0.99]"
                >
                  {t('loginBtn')}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
