"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/contexts/AdminContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
);

const navItems = [
  { name: 'Dashboard', path: '/admin-dashboard' },
  { name: 'Employees', path: '/admin-dashboard/employees' },
  { name: 'Tasks', path: '/admin-dashboard/tasks' },
  { name: 'Schedule', path: '/admin-dashboard/schedule' },
  { name: 'Finance', path: '/admin-dashboard/finance' },
  { name: 'Analytics', path: '/admin-dashboard/analytics' },
  { name: 'Messages', path: '/admin-dashboard/messages' },
  { name: 'Reports', path: '/admin-dashboard/reports' },
  { name: 'Settings', path: '/admin-dashboard/settings' },
];

export default function AdminDashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <AdminProvider>
      <div className="min-h-screen bg-black text-white flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ width: 250 }}
          animate={{ width: isSidebarOpen ? 250 : 80 }}
          className="fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800"
        >
          <div className="p-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h2>
          </div>
          <nav className="mt-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 ${
                  pathname === item.path
                    ? 'bg-purple-500/20 border-r-4 border-purple-500'
                    : 'hover:bg-gray-800'
                }`}
              >
                <span className={`${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
              </Link>
            ))}
          </nav>
        </motion.aside>

        {/* Main content */}
        <main className={`flex-1 ${isSidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} p-8`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-800"
              >
                {isSidebarOpen ? '←' : '→'}
              </button>
              <div className="flex items-center gap-4">
                <span className="text-gray-400">Admin</span>
                <button
                  onClick={() => window.location.href = '/'}
                  className="text-red-500 hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </AdminProvider>
  );
}