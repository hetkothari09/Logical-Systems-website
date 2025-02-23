"use client";
import React from 'react';
import { motion } from 'framer-motion';

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
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Dashboard Overview
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Employees" value="12" color="border-blue-500" />
        <DashboardCard title="Active Tasks" value="8" color="border-green-500" />
        <DashboardCard title="Pending Tasks" value="3" color="border-yellow-500" />
        <DashboardCard title="Monthly Revenue" value="₹85,000" color="border-purple-500" />
      </div>

      {/* Add more dashboard sections as needed */}
    </div>
  );
}