"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
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
  { name: 'Dashboard', path: '/admin-dashboard', type: 'dashboard' },
  { name: 'Employees', path: '/admin-dashboard/employees', type: 'employees' },
  { name: 'Tasks', path: '/admin-dashboard/tasks', type: 'tasks' },
  { name: 'Schedule', path: '/admin-dashboard/schedule', type: 'schedule' },
  { name: 'Finance', path: '/admin-dashboard/finance', type: 'finance' },
  { name: 'Analytics', path: '/admin-dashboard/analytics', type: 'analytics' },
  { name: 'Messages', path: '/admin-dashboard/messages', type: 'messages' },
  { name: 'Reports', path: '/admin-dashboard/reports', type: 'reports' },
  { name: 'Settings', path: '/admin-dashboard/settings', type: 'settings' },
];

function DashboardContent({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, notifications } = useAdmin();

  const getUnreadCount = (type) => {
    return notifications[type]?.filter(n => !n.isRead).length || 0;
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
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
              className={`flex items-center justify-between px-4 py-3 ${
                pathname === item.path
                  ? 'bg-purple-500/20 border-r-4 border-purple-500'
                  : 'hover:bg-gray-800'
              }`}
            >
              <span className={`${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
              {getUnreadCount(item.type) > 0 && (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              )}
            </Link>
          ))}
        </nav>
        {/* Logout button */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2 px-4 rounded-lg text-red-400 hover:bg-gray-800 transition-colors"
          >
            <FiLogOut className="mr-2" />
            <span className={isSidebarOpen ? 'block' : 'hidden'}>
              Logout
            </span>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className={`flex-1 ${isSidebarOpen ? 'ml-[250px]' : 'ml-[80px]'} p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-800"
            >
              {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Admin</span>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboardLayout({ children }) {
  return (
    <AdminProvider>
      <DashboardContent>{children}</DashboardContent>
    </AdminProvider>
  );
}