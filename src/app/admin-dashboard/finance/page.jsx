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
          Financial Overview
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Add Transaction
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-xl border-l-4 border-green-500"
        >
          <h3 className="text-gray-400 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-xl border-l-4 border-red-500"
        >
          <h3 className="text-gray-400 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold">₹{stats.totalExpenses.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-xl border-l-4 border-blue-500"
        >
          <h3 className="text-gray-400 mb-2">Net Profit</h3>
          <p className="text-3xl font-bold">₹{(stats.totalRevenue - stats.totalExpenses).toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 p-6 rounded-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Revenue vs Expenses</h2>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-700 px-4 py-2 rounded-lg text-white"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <div className="h-80">
          <Line
            data={revenueData}
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
                  ticks: {
                    color: 'rgb(156, 163, 175)'
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: 'rgb(156, 163, 175)'
                  }
                }
              }
            }}
          />
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {finances.slice(0, 10).map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-700/30"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      transaction.type === 'income' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.description}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Transaction"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Type
            </label>
            <select
              required
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
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
              required
              min="0"
              step="0.01"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Category
            </label>
            <select
              required
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            >
              <option value="">Select Category</option>
              {newTransaction.type === 'income' ? (
                <>
                  <option value="Sales">Sales</option>
                  <option value="Services">Services</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </>
              ) : (
                <>
                  <option value="Equipment">Equipment</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Salary">Salary</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Transaction
          </button>
        </form>
      </Modal>
    </div>
  );
}