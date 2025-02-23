"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import Modal from '@/components/admin/Modal';

export default function Tasks() {
  const { tasks, employees, addTask, updateTaskStatus, removeTask } = useAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: '',
    deadline: '',
    priority: 'Medium',
    description: ''
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addTask(newTask);
    setNewTask({
      title: '',
      assignedTo: '',
      deadline: '',
      priority: 'Medium',
      description: ''
    });
    setIsAddModalOpen(false);
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      removeTask(taskId);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-500/20 text-yellow-400',
      'In Progress': 'bg-blue-500/20 text-blue-400',
      'Completed': 'bg-green-500/20 text-green-400',
      'Cancelled': 'bg-red-500/20 text-red-400'
    };
    return colors[status] || colors['Pending'];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'text-red-400',
      'Medium': 'text-yellow-400',
      'Low': 'text-green-400'
    };
    return colors[priority] || colors['Medium'];
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Task Management
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Create Task
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 p-4 rounded-xl space-y-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400"
        />
        <div className="flex space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 rounded-lg text-white"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-gray-800/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Assigned To</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Deadline</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Priority</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredTasks.map((task) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-700/30"
              >
                <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{task.assignedTo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{task.deadline}</td>
                <td className={`px-6 py-4 whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Assign To
            </label>
            <select
              required
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Deadline
            </label>
            <input
              type="date"
              required
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Priority
            </label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Task
          </button>
        </form>
      </Modal>
    </div>
  );
}