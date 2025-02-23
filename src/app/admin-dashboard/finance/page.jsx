"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import Modal from '@/components/admin/Modal';
import { Line } from 'react-chartjs-2';

export default function Finance() {
  const { finances, addTransaction, getFinancialStats } = useAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState('month');
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    });
    setNewTransaction({
      type: 'income',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(false);
  };

  const stats = getFinancialStats(dateRange);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: { color: 'rgb(156, 163, 175)' }
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          callback: (value) => `₹${value}`,
          color: 'rgb(156, 163, 175)'
        }
      }
    },
    plugins: {
      legend: {
        labels: { color: 'rgb(156, 163, 175)' }
      }
    }
  };

  // Chart data
  const revenueData = {
    labels: stats.labels,
    datasets: [
      {
        label: 'Revenue',
        data: stats.revenue,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: stats.expenses,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Finance
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-500">₹{stats.totalRevenue}</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-500">₹{stats.totalExpenses}</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Net Profit</h3>
          <p className={`text-2xl font-bold ${stats.totalRevenue - stats.totalExpenses >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ₹{stats.totalRevenue - stats.totalExpenses}
          </p>
        </div>
      </div>

      <div className="bg-gray-800/50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Financial Overview</h2>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-700 px-3 py-1 rounded-lg"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <div className="h-[400px]">
          <Line data={revenueData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {finances.map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-700/30"
                >
                  <td className="px-6 py-4 text-sm">{transaction.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{transaction.category}</td>
                  <td className="px-6 py-4 text-sm">{transaction.description}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ₹{transaction.amount}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Type
            </label>
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Category
            </label>
            <input
              type="text"
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <input
              type="text"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Date
            </label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Transaction
          </button>
        </form>
      </Modal>
    </div>
  );
}