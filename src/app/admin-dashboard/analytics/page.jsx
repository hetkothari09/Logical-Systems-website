"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import { Line, Bar, Pie } from 'react-chartjs-2';

export default function Analytics() {
  const { employees, tasks, events, finances, getStatistics } = useAdmin();
  const [timeRange, setTimeRange] = useState('month');
  const stats = getStatistics();

  // Task Completion Rate Over Time
  const taskCompletionData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Completion Rate (%)',
      data: [65, 75, 82, 78],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      tension: 0.4
    }]
  };

  // Employee Performance
  const employeePerformanceData = {
    labels: employees.map(emp => emp.name),
    datasets: [{
      label: 'Tasks Completed',
      data: employees.map(emp => 
        tasks.filter(t => t.assignedTo === emp.name && t.status === 'Completed').length
      ),
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
      borderColor: 'rgb(34, 197, 94)',
    }]
  };

  // Task Distribution by Priority
  const taskPriorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [
        tasks.filter(t => t.priority === 'High').length,
        tasks.filter(t => t.priority === 'Medium').length,
        tasks.filter(t => t.priority === 'Low').length,
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.5)',
        'rgba(234, 179, 8, 0.5)',
        'rgba(34, 197, 94, 0.5)',
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(234, 179, 8)',
        'rgb(34, 197, 94)',
      ],
    }]
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-700 px-4 py-2 rounded-lg text-white"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-xl"
        >
          <h3 className="text-gray-400 mb-2">Task Completion Rate</h3>
          <p className="text-3xl font-bold">
            {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-xl"
        >
          <h3 className="text-gray-400 mb-2">Active Projects</h3>
          <p className="text-3xl font-bold">
            {tasks.filter(t => t.status === 'In Progress').length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-xl"
        >
          <h3 className="text-gray-400 mb-2">Team Utilization</h3>
          <p className="text-3xl font-bold">
            {Math.round((employees.filter(e => e.tasks > 0).length / employees.length) * 100)}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-xl"
        >
          <h3 className="text-gray-400 mb-2">Upcoming Events</h3>
          <p className="text-3xl font-bold">{stats.upcomingEvents}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-xl"
        >
          <h2 className="text-xl font-semibold mb-4">Task Completion Trend</h2>
          <div className="h-64">
            <Line
              data={taskCompletionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { color: 'rgb(156, 163, 175)' }
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
        </motion.div>

        {/* Employee Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-xl"
        >
          <h2 className="text-xl font-semibold mb-4">Employee Performance</h2>
          <div className="h-64">
            <Bar
              data={employeePerformanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { color: 'rgb(156, 163, 175)' }
                  },
                  x: {
                    ticks: { color: 'rgb(156, 163, 175)' }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Task Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-xl"
        >
          <h2 className="text-xl font-semibold mb-4">Task Priority Distribution</h2>
          <div className="h-64">
            <Pie
              data={taskPriorityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: 'rgb(156, 163, 175)' }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-xl"
        >
          <h2 className="text-xl font-semibold mb-4">Performance Insights</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Average Task Completion Time</span>
              <span className="text-green-400">3.2 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Team Productivity Score</span>
              <span className="text-blue-400">8.5/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Resource Utilization</span>
              <span className="text-purple-400">76%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Project Success Rate</span>
              <span className="text-yellow-400">92%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}