"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { EmployeeProvider } from '@/contexts/EmployeeContext';
import { useEmployee } from '@/contexts/EmployeeContext';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', path: '/employee-dashboard' },
  { name: 'My Tasks', path: '/employee-dashboard/tasks' },
  { name: 'Schedule', path: '/employee-dashboard/schedule' },
  { name: 'Messages', path: '/employee-dashboard/messages' },
  { name: 'Profile', path: '/employee-dashboard/profile' },
];

function DashboardContent({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useEmployee();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Sidebar */}
        <motion.div
          initial={{ width: isSidebarOpen ? '16rem' : '4rem' }}
          animate={{ width: isSidebarOpen ? '16rem' : '4rem' }}
          className="fixed top-0 left-0 h-screen bg-gray-800/50 backdrop-blur-xl z-30"
        >
          <div className="flex flex-col h-full">
            <nav className="mt-16 px-4 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block py-2 px-4 my-1 rounded-lg ${
                    pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Logout button */}
            <div className="px-4 pb-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center py-2 px-4 rounded-lg text-red-400 hover:bg-gray-700/50 transition-colors"
              >
                <FiLogOut className="mr-2" />
                <span className={isSidebarOpen ? 'block' : 'hidden'}>
                  Logout
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <main className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        }`}>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function EmployeeDashboardLayout({ children }) {
  return (
    <EmployeeProvider>
      <DashboardContent>{children}</DashboardContent>
    </EmployeeProvider>
  );
}