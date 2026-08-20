import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Wallet,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  PieChart as PieIcon,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { useCustomers } from '../hooks/useCustomers';
import { useDebts } from '../hooks/useDebts';
import { usePayments } from '../hooks/usePayments';
import { StatCard } from '../components/ui/StatCard';
import { formatCurrency } from '../utils/formatCurrency';

export const Statistics = () => {
  const { customers } = useCustomers();
  const { debts } = useDebts();
  const { payments } = usePayments();

  const [timePeriod, setTimePeriod] = useState('daily'); // 'daily', 'weekly', 'monthly'

  // Summary Metrics
  const totalDebt = customers.reduce((sum, c) => sum + (c.remainingAmount || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const activeDebtsCount = debts.filter(d => d.status === 'Faol' || d.status === 'Yaqinlashmoqda').length;
  const overdueDebtsCount = debts.filter(d => d.status === 'Muddati o‘tgan').length;

  // Pie chart data for Customer status breakdown
  const pieData = useMemo(() => {
    const active = customers.filter(c => c.status === 'Qarzi bor').length;
    const overdue = customers.filter(c => c.status === 'Muddati o‘tgan').length;
    const clean = customers.filter(c => c.status === 'Qarzi yo‘q').length;

    return [
      { name: 'Qarzi bor', value: active, color: '#f59e0b' },
      { name: 'Muddati o‘tgan', value: overdue, color: '#f43f5e' },
      { name: 'Qarzi yo‘q', value: clean, color: '#10b981' }
    ];
  }, [customers]);

  // Dynamic Bar Chart Data based on time period filter
  const barChartData = useMemo(() => {
    if (timePeriod === 'daily') {
      return Array.from({ length: 7 }).map((_, idx) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - idx));
        const dateStr = d.toISOString().split('T')[0];
        const label = `${d.getDate()}-${['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sep', 'Okt', 'Noy', 'Dek'][d.getMonth()]}`;

        const debtVal = debts.filter(debt => debt.createdAt === dateStr).reduce((s, debt) => s + debt.totalAmount, 0);
        const payVal = payments.filter(pay => pay.date === dateStr).reduce((s, pay) => s + pay.amount, 0);

        return { name: label, BerilganQarz: debtVal, UndirilganTolov: payVal };
      });
    }

    if (timePeriod === 'weekly') {
      return [
        { name: '1-hafta', BerilganQarz: 3500000, UndirilganTolov: 2100000 },
        { name: '2-hafta', BerilganQarz: 4200000, UndirilganTolov: 3100000 },
        { name: '3-hafta', BerilganQarz: 2800000, UndirilganTolov: 1900000 },
        { name: '4-hafta (Joriy)', BerilganQarz: 5100000, UndirilganTolov: 2850000 }
      ];
    }

    // Monthly
    return [
      { name: 'May', BerilganQarz: 14000000, UndirilganTolov: 11000000 },
      { name: 'Iyun', BerilganQarz: 18500000, UndirilganTolov: 15200000 },
      { name: 'Iyul', BerilganQarz: 21000000, UndirilganTolov: 19400000 },
      { name: 'Avgust', BerilganQarz: 15600000, UndirilganTolov: 12500000 }
    ];
  }, [debts, payments, timePeriod]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Statistika
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Moliyaviy tahlil, qarzlar va to'lovlar o'sish ko'rsatkichlari.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          {[
            { id: 'daily', label: 'Kunlik' },
            { id: 'weekly', label: 'Haftalik' },
            { id: 'monthly', label: 'Oylik' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setTimePeriod(btn.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timePeriod === btn.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Umumiy qarz"
          value={formatCurrency(totalDebt)}
          icon={Wallet}
          color="amber"
          subtext="Mijozlardagi qarzdorlik"
        />
        <StatCard
          title="Umumiy to‘lov"
          value={formatCurrency(totalPaid)}
          icon={CheckCircle2}
          color="emerald"
          subtext="Undirilgan to'lovlar"
        />
        <StatCard
          title="Faol qarzlar"
          value={`${activeDebtsCount} ta`}
          icon={TrendingUp}
          color="blue"
          subtext="Vaqti kutilayotgan qarzlar"
        />
        <StatCard
          title="Muddati o‘tgan"
          value={`${overdueDebtsCount} ta`}
          icon={AlertCircle}
          color="rose"
          subtext="Diqqat talab qarzlar"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart - 2 cols */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Berilgan qarzlar va Undirilgan to‘lovlar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {timePeriod === 'daily' ? 'Kunlik' : timePeriod === 'weekly' ? 'Haftalik' : 'Oylik'} solishtirma diagrammasi
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val) => formatCurrency(val)}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="BerilganQarz" name="Berilgan qarz" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="UndirilganTolov" name="Undirilgan to'lov" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart - 1 col */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Mijozlar tarkibi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Qarzdorlik bo'yicha mijozlar taqsimoti
            </p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val) => `${val} ta mijoz`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{item.value} ta</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
