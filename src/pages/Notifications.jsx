import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, CheckCheck, AlertCircle, CheckCircle2, Info, Trash2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export const Notifications = () => {
  const { showToast } = useOutletContext();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  const loadNotifications = () => {
    const data = storageService.get(storageService.KEYS.NOTIFICATIONS, []);
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    storageService.set(storageService.KEYS.NOTIFICATIONS, updated);
    showToast("✅ Barcha bildirishnomalar o'qilgan deb belgilandi.", "success");
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    storageService.set(storageService.KEYS.NOTIFICATIONS, updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    storageService.set(storageService.KEYS.NOTIFICATIONS, updated);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'danger':
        return <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400"><AlertCircle className="w-5 h-5" /></div>;
      case 'warning':
        return <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400"><AlertCircle className="w-5 h-5" /></div>;
      case 'success':
        return <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-5 h-5" /></div>;
      default:
        return <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"><Info className="w-5 h-5" /></div>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Bildirishnomalar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Qarz muddati o'tishi, yangi to'lovlar va mijozlar bo'yicha ogohlantirishlar.
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <Button onClick={markAllAsRead} icon={CheckCheck} variant="outline">
            Barchasini o‘qilgan qilish
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'all', label: `Barchasi (${notifications.length})` },
          { id: 'unread', label: `O‘qilmagan (${notifications.filter(n => !n.read).length})` },
          { id: 'read', label: `O‘qilgan (${notifications.filter(n => n.read).length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              filter === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Bildirishnomalar topilmadi"
          description="Hozircha hech qanday bildirishnoma mavjud emas."
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all duration-150 flex items-start justify-between gap-4 cursor-pointer ${
                !n.read
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {getIcon(n.type)}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block pt-0.5">
                    {n.time} • {n.date}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n.id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="O‘chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
