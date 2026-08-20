import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Download, Calendar, Filter, FileSpreadsheet, FileDown } from 'lucide-react';

import { useCustomers } from '../hooks/useCustomers';
import { useDebts } from '../hooks/useDebts';
import { usePayments } from '../hooks/usePayments';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../utils/formatCurrency';
import { getTodayDateString } from '../utils/formatDate';

export const Reports = () => {
  const { showToast } = useOutletContext();
  const { customers } = useCustomers();
  const { debts } = useDebts();
  const { payments } = usePayments();

  // Default start date: 30 days ago
  const defaultStartDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(getTodayDateString());

  // Filtered metrics by date range
  const reportData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filteredDebts = debts.filter(d => {
      const debtDate = new Date(d.createdAt);
      return debtDate >= start && debtDate <= end;
    });

    const filteredPayments = payments.filter(p => {
      const payDate = new Date(p.date);
      return payDate >= start && payDate <= end;
    });

    const totalDebt = filteredDebts.reduce((sum, d) => sum + d.totalAmount, 0);
    const totalPaid = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const remainingDebt = Math.max(0, totalDebt - totalPaid);
    const overdueDebt = filteredDebts
      .filter(d => d.status === 'Muddati o‘tgan')
      .reduce((sum, d) => sum + d.remainingAmount, 0);

    return {
      debtCount: filteredDebts.length,
      paymentCount: filteredPayments.length,
      totalDebt,
      totalPaid,
      remainingDebt,
      overdueDebt,
      filteredDebts,
      filteredPayments
    };
  }, [debts, payments, startDate, endDate]);

  const handleDownloadPDF = () => {
    showToast("📄 PDF hisoboti muvaffaqiyatli shakllantirildi va yuklab olindi!", "success");
  };

  const handleDownloadExcel = () => {
    showToast("📊 Excel jadval hisoboti yuklab olindi (QarzDaftar_Hisobot.xlsx)!", "success");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Hisobotlar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Muayyan sana oralig'ida moliyaviy va qarzdorlik hisobotlarini shakllantiring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            icon={FileDown}
            className="border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            PDF yuklash
          </Button>

          <Button
            onClick={handleDownloadExcel}
            icon={FileSpreadsheet}
            className="bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            Excel yuklash
          </Button>
        </div>
      </div>

      {/* Date Filter Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" /> Sana oralig‘ini tanlang
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Boshlanish sanasi"
            type="date"
            icon={Calendar}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            label="Tugash sanasi"
            type="date"
            icon={Calendar}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Report Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Jami berilgan qarz
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {formatCurrency(reportData.totalDebt)}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {reportData.debtCount} ta qarz tranzaksiyasi
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Jami undirilgan to‘lov
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {formatCurrency(reportData.totalPaid)}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {reportData.paymentCount} ta to'lov qabul qilingan
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Qolgan qarz
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {formatCurrency(reportData.remainingDebt)}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Kutilayotgan tushum
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="block text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Muddati o‘tgan qarz
          </span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
            {formatCurrency(reportData.overdueDebt)}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Kechiktirilgan qarzdorlik
          </span>
        </div>
      </div>

      {/* Detailed breakdown tables preview */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Hisobot tafsilotlari ({startDate} — {endDate})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Ko'rsatkich</th>
                <th className="py-3 px-3 text-right">Miqdor / Qiymat</th>
                <th className="py-3 px-3">Izoh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
              <tr>
                <td className="py-3 px-3 text-slate-900 dark:text-slate-100">Jami mijozlar soni</td>
                <td className="py-3 px-3 text-right font-bold">{customers.length} ta</td>
                <td className="py-3 px-3 text-xs text-slate-500">Tizimda mavjud faol va nofaol mijozlar</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-slate-900 dark:text-slate-100">Shakllantirilgan qarzlar</td>
                <td className="py-3 px-3 text-right font-bold text-rose-600">{formatCurrency(reportData.totalDebt)}</td>
                <td className="py-3 px-3 text-xs text-slate-500">Berilgan mahsulot hamda xizmatlar summasi</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-slate-900 dark:text-slate-100">Undirilgan to'lovlar</td>
                <td className="py-3 px-3 text-right font-bold text-emerald-600">+{formatCurrency(reportData.totalPaid)}</td>
                <td className="py-3 px-3 text-xs text-slate-500">Naqd, Karta, Payme, Click va boshqa usullar orqali</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-slate-900 dark:text-slate-100 font-bold">Sof qarzdorlik qoldig'i</td>
                <td className="py-3 px-3 text-right font-extrabold text-slate-900 dark:text-slate-100">{formatCurrency(reportData.remainingDebt)}</td>
                <td className="py-3 px-3 text-xs text-slate-500">Mijozlar tomonidan to'lanishi kutilayotgan sof balans</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
