"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import { Line } from 'react-chartjs-2';

export default function Reports() {
  const { employees, tasks, finances, getFinancialStats } = useAdmin();
  const [reportType, setReportType] = useState('financial');
  const [dateRange, setDateRange] = useState('month');
  const [exportFormat, setExportFormat] = useState('pdf');

  const financialStats = getFinancialStats(dateRange);

  const handleExport = () => {
    // Implementation for report export
    console.log(`Exporting ${reportType} report in ${exportFormat} format`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Reports
        </h1>
        <div className="flex space-x-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-gray-700 px-4 py-2 rounded-lg text-white"
          >
            <option value="financial">Financial Report</option>
            <option value="employee">Employee Report</option>
            <option value="task">Task Report</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-700 px-4 py-2 rounded-lg text-white"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="bg-gray-700 px-4 py-2 rounded-lg text-white"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Export
          </button>
        </div>
      </div>

      {/* Report Content */}
      {reportType === 'financial' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-xl">
              <h3 className="text-gray-400 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold">₹{financialStats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl">
              <h3 className="text-gray-400 mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold">₹{financialStats.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl">
              <h3 className="text-gray-400 mb-2">Net Profit</h3>
              <p className="text-3xl font-bold">
                ₹{(financialStats.totalRevenue - financialStats.totalExpenses).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Revenue vs Expenses</h2>
            <div className="h-80">
              <Line
                data={{
                  labels: financialStats.labels,
                  datasets: [
                    {
                      label: 'Revenue',
                      data: financialStats.revenue,
                      borderColor: 'rgb(34, 197, 94)',
                      backgroundColor: 'rgba(34, 197, 94, 0.5)',
                    },
                    {
                      label: 'Expenses',
                      data: financialStats.expenses,
                      borderColor: 'rgb(239, 68, 68)',
                      backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `₹${value}`,
                        color: 'rgb(156, 163, 175)'
                      }
                    },
                    x: {
                      ticks: { color: 'rgb(156, 163, 175)' }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: { color: 'rgb(156, 163, 175)' }
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {reportType === 'employee' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Employee report content */}
          <div className="bg-gray-800/50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Employee Performance Report</h2>
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Tasks Completed</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4">{emp.name}</td>
                    <td className="px-6 py-4">{emp.role}</td>
                    <td className="px-6 py-4">
                      {tasks.filter(t => t.assignedTo === emp.name && t.status === 'Completed').length}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        emp.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                        emp.status === 'Inactive' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {reportType === 'task' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Task report content */}
          <div className="bg-gray-800/50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Task Status Report</h2>
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Assigned To</th>
                  <th className="px-6 py-3 text-left">Deadline</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4">{task.title}</td>
                    <td className="px-6 py-4">{task.assignedTo}</td>
                    <td className="px-6 py-4">{task.deadline}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        task.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                        task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                        task.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        task.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                        task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}