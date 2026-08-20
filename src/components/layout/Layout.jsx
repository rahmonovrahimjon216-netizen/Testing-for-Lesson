import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { AddDebtModal } from '../debts/AddDebtModal';
import { Toast } from '../ui/Toast';

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f8] dark:bg-[#070b15] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onQuickAddDebt={() => setIsAddDebtOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet context={{ showToast, openAddDebtModal: () => setIsAddDebtOpen(true) }} />
        </main>
      </div>

      {/* Global Quick Add Debt Modal */}
      <AddDebtModal
        isOpen={isAddDebtOpen}
        onClose={() => setIsAddDebtOpen(false)}
        onSuccess={(msg) => showToast(msg || "Qarz muvaffaqiyatli qo'shildi!", 'success')}
      />

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
