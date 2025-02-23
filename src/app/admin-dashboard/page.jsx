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
  const { tasks, employees, finances, getStatistics } = useAdmin();
  const stats = getStatistics();

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
    </div>
  );
}