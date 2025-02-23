"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEmployee } from '@/contexts/EmployeeContext';

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

export default function EmployeeDashboard() {
  const { currentEmployee, getMyTasks } = useEmployee();
  const [mounted, setMounted] = useState(false);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    setMounted(true);
    const myTasks = getMyTasks();
    setTaskStats({
      total: myTasks.length,
      inProgress: myTasks.filter(t => t.status === 'In Progress').length,
      completed: myTasks.filter(t => t.status === 'Completed').length
    });
  }, [getMyTasks]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Welcome, {currentEmployee.name}
        </h1>
        <div className="text-gray-400">
          <p>{currentEmployee.role}</p>
          <p className="text-sm">{currentEmployee.email}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="My Tasks" 
          value={taskStats.total} 
          color="border-blue-500" 
        />
        <DashboardCard 
          title="In Progress" 
          value={taskStats.inProgress} 
          color="border-yellow-500" 
        />
        <DashboardCard 
          title="Completed" 
          value={taskStats.completed} 
          color="border-green-500" 
        />
      </div>
    </div>
  );
}