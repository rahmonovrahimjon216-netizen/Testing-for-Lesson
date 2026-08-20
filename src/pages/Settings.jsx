import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Settings as SettingsIcon, User, Store, Phone, MapPin, Save, Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Settings = () => {
  const { showToast } = useOutletContext();
  const { user, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, changeLanguage, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
    address: user?.address || ''
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    showToast("✅ Profil sozlamalari saqlandi!", "success");
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          {t('settings')}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          {lang === 'ru' ? "Управление профилем и настройками языка." : "Profil va til sozlamalarini boshqaring."}
        </p>
      </div>

      {/* Language Section */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-lg shadow-slate-200/40 dark:shadow-none space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" /> {t('languageSectionTitle')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('languageSectionSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => {
              changeLanguage('uz');
              showToast("O'zbek tili tanlandi 🇺🇿", "info");
            }}
            className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all ${
              lang === 'uz'
                ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇺🇿</span>
              <div>
                <span className="font-bold text-sm block">O‘zbek tili</span>
                <span className="text-xs text-slate-500">Lotin alifbosida</span>
              </div>
            </div>
            {lang === 'uz' && <span className="text-xs font-bold text-emerald-600">Faol</span>}
          </button>

          <button
            onClick={() => {
              changeLanguage('ru');
              showToast("Русский язык выбран 🇷🇺", "info");
            }}
            className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all ${
              lang === 'ru'
                ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇷🇺</span>
              <div>
                <span className="font-bold text-sm block">Русский язык</span>
                <span className="text-xs text-slate-500">На русском языке</span>
              </div>
            </div>
            {lang === 'ru' && <span className="text-xs font-bold text-emerald-600">Активный</span>}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-lg shadow-slate-200/40 dark:shadow-none space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" /> Profil ma'lumotlari
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="F.I.SH."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={User}
              required
            />
            <Input
              label="Telefon raqam"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={Phone}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Do'kon / Biznes nomi"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              icon={Store}
            />
            <Input
              label="Manzil"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              icon={MapPin}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" icon={Save} className="rounded-full">
              Saqlash
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
