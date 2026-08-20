import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Wallet,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  ChevronRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { useCustomers } from '../hooks/useCustomers';
import { useDebts } from '../hooks/useDebts';
import { usePayments } from '../hooks/usePayments';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, getTodayDateString } from '../utils/formatDate';

export const Dashboard = () => {
  const { openAddDebtModal } = useOutletContext();
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const { customers } = useCustomers();
  const { debts } = useDebts();
  const { payments } = usePayments();

  // Calculated Statistics
  const totalDebt = customers.reduce((sum, c) => sum + (c.remainingAmount || 0), 0);
  const totalCustomersCount = customers.length;

  const todayStr = getTodayDateString();
  const paidToday = payments
    .filter(p => p.date === todayStr)
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const overdueCount = debts.filter(d => d.status === 'Muddati o‘tgan').length;

  // Chart data: past 7 days statistics
  const chartData = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = `${d.getDate()}-${['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sep', 'Okt', 'Noy', 'Dek'][d.getMonth()]}`;

    const debtSum = debts
      .filter(debt => debt.createdAt === dateStr)
      .reduce((sum, debt) => sum + Number(debt.totalAmount || 0), 0);

    const paySum = payments
      .filter(pay => pay.date === dateStr)
      .reduce((sum, pay) => sum + Number(pay.amount || 0), 0);

    return {
      name: dayLabel,
      Qarzlar: debtSum,
      "To'lovlar": paySum
    };
  });

  const recentDebts = debts.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Reference-Style Premium Hero Banner Card */}
      <div className="relative w-full rounded-[36px] bg-gradient-to-r from-slate-900 via-[#40233f] to-emerald-950 p-8 sm:p-10 text-white overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 via-emerald-600 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'ru' ? "QarzDaftar SaaS Платформа" : "QarzDaftar SaaS Platformasi"}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {lang === 'ru' ? `Здравствуйте, ${user?.name?.split(' ')[0] || 'Предприниматель'} 👋` : `Assalomu alaykum, ${user?.name?.split(' ')[0] || 'Tadbirkor'} 👋`}
            </h1>
            
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              {lang === 'ru' ? "Управляйте всеми долгами, клиентами и платежами вашего магазина в одном месте." : "Do'koningiz va qarzdorliklar bo'yicha bugungi umumiy hisob-kitoblar va to'lovlar nazorati."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={openAddDebtModal}
                className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                {t('addDebt')}
              </button>
            </div>
          </div>

          {/* Right Floating Circle Badge matching reference UI */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-center w-36 h-36 flex-shrink-0 shadow-2xl">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-1" />
            <span className="text-xs font-black text-white uppercase tracking-wider">100%</span>
            <span className="text-[10px] text-slate-300 font-semibold">{lang === 'ru' ? "Защита" : "Himoya"}</span>
          </div>
        </div>
      </div>

      {/* Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title={t('totalDebts')}
          value={formatCurrency(totalDebt)}
          icon={Wallet}
          color="amber"
          subtext={lang === 'ru' ? "Ожидается к возврату" : "Qaytarilishi kutilayotgan summa"}
        />
        <StatCard
          title={t('customers')}
          value={`${totalCustomersCount} ta`}
          icon={Users}
          color="blue"
          subtext={lang === 'ru' ? "Всего клиентов" : "Ro'yxatga olingan mijozlar"}
        />
        <StatCard
          title={t('totalPaid')}
          value={formatCurrency(paidToday)}
          icon={CheckCircle2}
          color="emerald"
          subtext={lang === 'ru' ? "Оплачено сегодня" : "Bugun kelib tushgan to'lovlar"}
        />
        <StatCard
          title={t('overdueDebtsCount')}
          value={`${overdueCount} ta`}
          icon={AlertCircle}
          color="rose"
          subtext={lang === 'ru' ? "Требуют напоминания" : "Eslatma yuborish kerak"}
        />
      </div>

      {/* Analytics Chart Card */}
      <div className="p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              {lang === 'ru' ? "Динамика долгов и платежей (7 дней)" : "Qarz va To‘lovlar dinamikasi (So'nggi 7 kun)"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {lang === 'ru' ? "Сравнение выданных долгов и полученных платежей" : "Kunlik berilgan qarzlar va undirilgan to'lovlar taqqoslamasi"}
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorQarz" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTolov" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Area type="monotone" dataKey="Qarzlar" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorQarz)" />
              <Area type="monotone" dataKey="To'lovlar" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTolov)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Oxirgi qarzlar */}
        <div className="p-7 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              {t('recentDebts')}
            </h3>
            <Link
              to="/debts"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
            >
              Barchasi <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-3">{t('customerName')}</th>
                  <th className="py-3 px-3">Mahsulot</th>
                  <th className="py-3 px-3 text-right">Summa</th>
                  <th className="py-3 px-3 text-center">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {recentDebts.map((debt) => (
                  <tr key={debt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                      <Link to={`/customers/${debt.customerId}`} className="hover:underline">
                        {debt.customerName}
                      </Link>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-medium">
                      {debt.product}
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-rose-600 dark:text-rose-400">
                      {formatCurrency(debt.remainingAmount)}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <Badge status={debt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Oxirgi to'lovlar */}
        <div className="p-7 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              {t('recentPayments')}
            </h3>
            <Link
              to="/payments"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
            >
              Barchasi <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-3">{t('customerName')}</th>
                  <th className="py-3 px-3 text-right">Summa</th>
                  <th className="py-3 px-3">To‘lov turi</th>
                  <th className="py-3 px-3 text-right">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {recentPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                      <Link to={`/customers/${pay.customerId}`} className="hover:underline">
                        {pay.customerName}
                      </Link>
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(pay.amount)}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-medium">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold">
                        {pay.method}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-400 font-medium">
                      {formatDate(pay.date, 'short')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
