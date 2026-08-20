-- QarzDaftar Supabase SQL Database Schema & Initial Seed Data
-- Instructions: Copy and run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/edfespkhfrnppoxcjphr/sql/new)

-- 1. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    total_debt NUMERIC DEFAULT 0,
    paid_amount NUMERIC DEFAULT 0,
    remaining_amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Qarzi yo‘q',
    created_at TEXT NOT NULL,
    note TEXT
);

-- 2. DEBTS TABLE
CREATE TABLE IF NOT EXISTS public.debts (
    id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    product TEXT NOT NULL,
    quantity NUMERIC DEFAULT 1,
    price NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    paid_amount NUMERIC DEFAULT 0,
    remaining_amount NUMERIC NOT NULL,
    due_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    status TEXT DEFAULT 'Faol',
    note TEXT
);

-- 3. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    debt_id TEXT,
    product TEXT,
    amount NUMERIC NOT NULL,
    method TEXT DEFAULT 'Naqd',
    date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    note TEXT
);

-- 4. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    time TEXT,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL
);

-- Disable Row Level Security (RLS) for testing so public anon key can read/write directly
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- SEED MOCK CUSTOMERS DATA
INSERT INTO public.customers (id, name, phone, address, total_debt, paid_amount, remaining_amount, status, created_at, note) VALUES
('cust-1', 'Ali Karimov', '+998 90 123 45 67', 'Toshkent sh., Chilonzor t., 12-dahsa', 2500000, 1000000, 1500000, 'Qarzi bor', '2026-08-01', 'Muntazam mijoz, magazin egasi'),
('cust-2', 'Vali Rustamov', '+998 93 987 65 43', 'Toshkent sh., Yunusobod t., 4-dahsa', 1200000, 400000, 800000, 'Muddati o‘tgan', '2026-07-15', 'Telefon orqali bog‘lanish qiyin'),
('cust-3', 'Sardorbek Rahimov', '+998 91 555 44 33', 'Toshkent sh., Sergeli t., 8A-uy', 800000, 800000, 0, 'Qarzi yo‘q', '2026-08-10', 'Barcha qarzlarni to‘liq yopgan')
ON CONFLICT (id) DO NOTHING;

-- SEED MOCK DEBTS DATA
INSERT INTO public.debts (id, customer_id, customer_name, product, quantity, price, total_amount, paid_amount, remaining_amount, due_date, created_at, status, note) VALUES
('debt-101', 'cust-1', 'Ali Karimov', 'Un 50kg (Qozog‘iston)', 2, 350000, 700000, 300000, 400000, '2026-08-25', '2026-08-10', 'Faol', 'Hafta oxirida to‘laydi'),
('debt-102', 'cust-1', 'Ali Karimov', 'O‘simlik yog‘i 5L', 6, 90000, 540000, 0, 540000, '2026-08-28', '2026-08-12', 'Faol', 'Do‘kon uchun oldi'),
('debt-103', 'cust-2', 'Vali Rustamov', 'Shakar 50kg', 1, 650000, 650000, 0, 650000, '2026-08-15', '2026-08-01', 'Muddati o‘tgan', 'Muddati o‘tib ketgan, eslatma yuborildi')
ON CONFLICT (id) DO NOTHING;

-- SEED MOCK PAYMENTS DATA
INSERT INTO public.payments (id, customer_id, customer_name, debt_id, product, amount, method, date, created_at, note) VALUES
('pay-201', 'cust-1', 'Ali Karimov', 'debt-101', 'Un 50kg (Qozog‘iston)', 300000, 'Naqd', '2026-08-14', '2026-08-14', 'Qisman to‘lov qildi'),
('pay-202', 'cust-3', 'Sardorbek Rahimov', 'debt-105', 'Guruch Alanga 10kg', 400000, 'Click', '2026-08-18', '2026-08-18', 'Qarzi to‘liq yopildi')
ON CONFLICT (id) DO NOTHING;
