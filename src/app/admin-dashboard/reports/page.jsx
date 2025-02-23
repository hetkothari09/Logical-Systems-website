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

  const dateRangeOptions = {
    currentWeek: 'Current Week',
    lastWeek: 'Last Week',
    month: 'Current Month',
    year: 'Current Year'
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'timeseries',
        time: {
          unit: dateRange.includes('Week') ? 'day' : dateRange === 'month' ? 'week' : 'month',
          displayFormats: {
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: { 
          color: 'rgb(156, 163, 175)',
          source: 'auto',
          autoSkip: true
        }
      },
      y: {
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

  const revenueData = {
    labels: financialStats.labels,
    datasets: [
      {
        label: 'Revenue',
        data: financialStats.revenue,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: financialStats.expenses,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4
      }
    ]
  };

  const handleExport = async () => {
    const data = {
      financial: {
        summary: {
          totalRevenue: financialStats.totalRevenue.toFixed(2),
          totalExpenses: financialStats.totalExpenses.toFixed(2),
          netProfit: (financialStats.totalRevenue - financialStats.totalExpenses).toFixed(2)
        },
        transactions: finances.map(t => ({
          date: t.date,
          type: t.type,
          category: t.category,
          amount: t.amount.toFixed(2),
          description: t.description
        }))
      },
      employee: {
        summary: {
          totalEmployees: employees.length,
          activeEmployees: employees.filter(emp => emp.status === 'Active').length
        },
        employees: employees.map(emp => ({
          name: emp.name,
          role: emp.role,
          status: emp.status,
          email: emp.email,
          phone: emp.phone,
          tasksCompleted: tasks.filter(t => t.assignedTo === emp.name && t.status === 'Completed').length
        }))
      },
      tasks: {
        summary: {
          total: tasks.length,
          completed: tasks.filter(t => t.status === 'Completed').length,
          inProgress: tasks.filter(t => t.status === 'In Progress').length,
          pending: tasks.filter(t => t.status === 'Pending').length
        },
        tasks: tasks.map(t => ({
          title: t.title,
          assignedTo: t.assignedTo,
          status: t.status,
          priority: t.priority,
          deadline: t.deadline,
          description: t.description
        }))
      }
    };

    const reportData = data[reportType];
    
    if (exportFormat === 'pdf') {
      try {
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        
        // Set font size and add title
        doc.setFontSize(16);
        doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 10, 20);
        
        // Add date range
        doc.setFontSize(12);
        doc.text(`Date Range: ${dateRangeOptions[dateRange]}`, 10, 30);
        
        // Add summary section
        doc.setFontSize(14);
        doc.text('Summary', 10, 45);
        doc.setFontSize(12);
        
        let yPos = 55;
        Object.entries(reportData.summary).forEach(([key, value]) => {
          const formattedKey = key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.slice(1);
          doc.text(`${formattedKey}: ${value}`, 15, yPos);
          yPos += 10;
        });
        
        doc.save(`${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      }
    } else if (exportFormat === 'csv') {
      try {
        let csv = '';
        const items = reportData[Object.keys(reportData)[1]]; // Get the array of items (transactions/employees/tasks)
        
        // Add headers
        csv += Object.keys(items[0]).join(',') + '\n';
        
        // Add data rows
        items.forEach(item => {
          csv += Object.values(item).join(',') + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating CSV:', error);
        alert('Error generating CSV. Please try again.');
      }
    } else {
      try {
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating JSON:', error);
        alert('Error generating JSON. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Reports
        </h1>
        <div className="flex gap-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-gray-700 px-4 py-2 rounded-lg"
          >
            <option value="financial">Financial Report</option>
            <option value="employee">Employee Report</option>
            <option value="tasks">Tasks Report</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-700 px-4 py-2 rounded-lg"
          >
            <option value="currentWeek">Current Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="month">Current Month</option>
            <option value="year">Current Year</option>
          </select>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="bg-gray-700 px-4 py-2 rounded-lg"
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Export
          </button>
        </div>
      </div>

      {reportType === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-500">₹{financialStats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-500">₹{financialStats.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Net Profit</h3>
              <p className={`text-2xl font-bold ${
                financialStats.totalRevenue - financialStats.totalExpenses >= 0 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                ₹{(financialStats.totalRevenue - financialStats.totalExpenses).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Financial Overview</h2>
            <div className="h-[400px]">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {reportType === 'employee' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Total Employees</h3>
              <p className="text-2xl font-bold">{employees.length}</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Active Employees</h3>
              <p className="text-2xl font-bold text-green-500">
                {employees.filter(emp => emp.status === 'Active').length}
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold">Employee Performance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Tasks Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 text-sm">{employee.name}</td>
                      <td className="px-6 py-4 text-sm">{employee.role}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          employee.status === 'Active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {tasks.filter(t => t.assignedTo === employee.name && t.status === 'Completed').length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {reportType === 'tasks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Total Tasks</h3>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Completed</h3>
              <p className="text-2xl font-bold text-green-500">
                {tasks.filter(t => t.status === 'Completed').length}
              </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">In Progress</h3>
              <p className="text-2xl font-bold text-blue-500">
                {tasks.filter(t => t.status === 'In Progress').length}
              </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-gray-400 mb-2">Pending</h3>
              <p className="text-2xl font-bold text-yellow-500">
                {tasks.filter(t => t.status === 'Pending').length}
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold">Task Overview</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Assigned To</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Priority</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 text-sm">{task.title}</td>
                      <td className="px-6 py-4 text-sm">{task.assignedTo}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.status === 'Completed' 
                            ? 'bg-green-500/20 text-green-400'
                            : task.status === 'In Progress'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === 'High'
                            ? 'bg-red-500/20 text-red-400'
                            : task.priority === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{task.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}