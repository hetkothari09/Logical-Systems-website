"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';

const DashboardCard = ({ title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gray-800/50 p-6 rounded-xl border-l-4 ${color}`}
  >
    <h3 className="text-gray-400 mb-2">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

export default function AdminDashboard() {
  const { tasks, employees, finances, getStatistics, notifications } = useAdmin();
  const stats = getStatistics();

  const getUnreadCount = (type) => {
    return notifications[type]?.filter(n => !n.isRead).length || 0;
  };

  const totalNotifications = Object.keys(notifications).reduce(
    (sum, type) => sum + getUnreadCount(type), 
    0
  );

  // Calculate monthly revenue
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthlyRevenue = finances
    .filter(t => new Date(t.date) >= firstDayOfMonth && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Dashboard Overview
        {totalNotifications > 0 && (
          <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded-full">
            {totalNotifications} new
          </span>
        )}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Employees" 
          value={stats.totalEmployees} 
          color="border-blue-500" 
        />
        <DashboardCard 
          title="Active Tasks" 
          value={tasks.filter(t => t.status === 'In Progress').length} 
          color="border-green-500" 
        />
        <DashboardCard 
          title="Pending Tasks" 
          value={stats.pendingTasks} 
          color="border-yellow-500" 
        />
        <DashboardCard 
          title="Monthly Revenue" 
          value={`₹${monthlyRevenue.toLocaleString()}`} 
          color="border-purple-500" 
        />
      </div>
      {totalNotifications > 0 && (
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Recent Notifications</h2>
          <div className="space-y-2">
            {Object.entries(notifications).map(([type, items]) => {
              const unread = items.filter(n => !n.isRead);
              if (unread.length === 0) return null;
              
              return (
                <div key={type} className="flex justify-between items-center">
                  <span className="capitalize">{type}</span>
                  <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded">
                    {unread.length} new
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}