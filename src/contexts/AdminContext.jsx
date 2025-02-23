"use client";
import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  // Employees State
  const [employees, setEmployees] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      role: 'Technician', 
      status: 'Active', 
      tasks: 3,
      email: 'john@example.com',
      phone: '+91 9876543210',
      joinDate: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      role: 'Sales', 
      status: 'Active', 
      tasks: 2,
      email: 'jane@example.com',
      phone: '+91 9876543211',
      joinDate: '2024-02-01'
    },
  ]);

  // Tasks State
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Server Maintenance',
      assignedTo: 'John Doe',
      deadline: '2024-03-20',
      status: 'In Progress',
      priority: 'High',
      description: 'Perform routine server maintenance and updates'
    },
  ]);

  // Events State
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      date: '2024-03-20',
      time: '10:00',
      type: 'meeting',
      participants: ['John Doe', 'Jane Smith'],
      description: 'Weekly team sync-up'
    },
  ]);

  // Finances State
  const [finances, setFinances] = useState([
    {
      id: 1,
      type: 'income',
      amount: 25000,
      category: 'Sales',
      description: 'CCTV Installation',
      date: '2024-03-15'
    },
    {
      id: 2,
      type: 'expense',
      amount: 15000,
      category: 'Equipment',
      description: 'Security Cameras Purchase',
      date: '2024-03-14'
    },
  ]);

  // Employee Management Functions
  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now(),
      tasks: 0,
      status: 'Active'
    };
    setEmployees([...employees, newEmployee]);
  };

  const editEmployee = (id, updatedData) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, ...updatedData } : emp
    ));
  };

  const removeEmployee = (id) => {
    // Remove employee's tasks first
    setTasks(tasks.filter(task => task.assignedTo !== 
      employees.find(emp => emp.id === id)?.name
    ));
    
    // Remove employee from events
    setEvents(events.map(event => ({
      ...event,
      participants: event.participants.filter(
        participant => participant !== employees.find(emp => emp.id === id)?.name
      )
    })));

    // Finally remove the employee
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const updateEmployeeStatus = (id, status) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, status } : emp
    ));
  };

  // Task Management Functions
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      status: 'Pending'
    };
    setTasks([...tasks, newTask]);
    
    // Update employee task count
    setEmployees(employees.map(emp =>
      emp.name === task.assignedTo
        ? { ...emp, tasks: emp.tasks + 1 }
        : emp
    ));
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status } : task
    ));

    // Update employee task count if task is completed
    const task = tasks.find(t => t.id === id);
    if (status === 'Completed') {
      setEmployees(employees.map(emp =>
        emp.name === task.assignedTo
          ? { ...emp, tasks: Math.max(0, emp.tasks - 1) }
          : emp
      ));
    }
  };

  const removeTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task && task.status !== 'Completed') {
      setEmployees(employees.map(emp =>
        emp.name === task.assignedTo
          ? { ...emp, tasks: Math.max(0, emp.tasks - 1) }
          : emp
      ));
    }
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Event Management Functions
  const addEvent = (event) => {
    setEvents([...events, { ...event, id: Date.now() }]);
  };

  const editEvent = (id, updatedData) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, ...updatedData } : event
    ));
  };

  const removeEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Finance Management Functions
  const addTransaction = (transaction) => {
    setFinances([...finances, { ...transaction, id: Date.now() }]);
  };

  const getFinancialStats = (dateRange) => {
    const now = new Date();
    let startDate;
    
    switch(dateRange) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const filteredTransactions = finances.filter(t => new Date(t.date) >= startDate);
    
    const totalRevenue = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Generate time series data
    const labels = [];
    const revenue = [];
    const expenses = [];

    // Generate daily data points for the selected date range
    let currentDate = new Date(startDate);
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      labels.push(dateStr);
      
      const dayRevenue = filteredTransactions
        .filter(t => t.date === dateStr && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      revenue.push(dayRevenue);

      const dayExpenses = filteredTransactions
        .filter(t => t.date === dateStr && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      expenses.push(dayExpenses);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      totalRevenue,
      totalExpenses,
      labels,
      revenue,
      expenses
    };
  };

  // Dashboard Statistics
  const getStatistics = () => {
    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(emp => emp.status === 'Active').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.status === 'Completed').length,
      pendingTasks: tasks.filter(task => task.status === 'Pending').length,
      upcomingEvents: events.filter(event => new Date(event.date) >= new Date()).length
    };
  };

  return (
    <AdminContext.Provider value={{
      // Data
      employees,
      tasks,
      events,
      finances,
      // Employee methods
      addEmployee,
      editEmployee,
      removeEmployee,
      updateEmployeeStatus,
      // Task methods
      addTask,
      updateTaskStatus,
      removeTask,
      // Event methods
      addEvent,
      editEvent,
      removeEvent,
      // Finance methods
      addTransaction,
      getFinancialStats,
      // Statistics
      getStatistics,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);