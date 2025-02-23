"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEmployee } from '@/contexts/EmployeeContext';
import { FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const TaskCard = ({ task, onStatusChange }) => {
  const statusColors = {
    'Pending': 'bg-yellow-500/20 text-yellow-400',
    'In Progress': 'bg-blue-500/20 text-blue-400',
    'Completed': 'bg-green-500/20 text-green-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-xl p-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{task.title}</h3>
          <p className="text-gray-400 mt-1">{task.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <FiClock />
          <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiAlertCircle />
          <span>Priority: {task.priority}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {task.status !== 'Completed' && (
          <button
            onClick={() => onStatusChange(task.id, 'Completed')}
            className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30"
          >
            Mark Complete
          </button>
        )}
        {task.status === 'Pending' && (
          <button
            onClick={() => onStatusChange(task.id, 'In Progress')}
            className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30"
          >
            Start Task
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default function Tasks() {
  const { getMyTasks, updateTaskStatus } = useEmployee();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const myTasks = getMyTasks();
  
  const filteredTasks = myTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || task.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          My Tasks
        </h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-700/50 rounded-lg px-4 py-2"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-700/50 rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={updateTaskStatus}
          />
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
}