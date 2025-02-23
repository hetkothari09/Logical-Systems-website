"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

const useLocalStorage = (key, initialValue) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  const setValue = (value) => {
    try {
      setState(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [state, setValue];
};

export function AdminProvider({ children }) {
  const [employees, setEmployees] = useLocalStorage('employees', [
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

  const [tasks, setTasks] = useLocalStorage('tasks', [
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

  const [events, setEvents] = useLocalStorage('events', [
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

  const [finances, setFinances] = useLocalStorage('finances', [
    {
      id: 1,
      type: 'income',
      amount: 1000000,
      category: 'Sales',
      description: 'CCTV Installation',
      date: '2024-01-23'
    },
  ]);

  const [messages, setMessages] = useLocalStorage('messages', []);
  const [chats, setChats] = useLocalStorage('chats', []);

  // Employee functions
  const addEmployee = (employee) => {
    setEmployees([...employees, { ...employee, id: Date.now() }]);
  };

  const editEmployee = (id, updatedData) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, ...updatedData } : emp
    ));
  };

  const removeEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const updateEmployeeStatus = (id, status) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, status } : emp
    ));
  };

  // Task functions
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      status: 'Pending'
    };
    setTasks([...tasks, newTask]);
    
    setEmployees(employees.map(emp =>
      emp.name === task.assignedTo
        ? { ...emp, tasks: emp.tasks + 1 }
        : emp
    ));
  };

  const updateTaskStatus = (id, status) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, status } : t
    ));
    
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

  // Event functions
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

  // Finance functions
  const addTransaction = (transaction) => {
    setFinances([...finances, { ...transaction, id: Date.now() }]);
  };

  // Chat functions
  const initializeChats = () => {
    if (chats.length === 0) {
      const initialChats = employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        lastMessage: "No messages yet",
        timestamp: "",
        unread: 0,
        online: Math.random() > 0.5,
        isActive: false
      }));
      setChats(initialChats);
    }
  };

  const startChat = (employee) => {
    const existingChat = chats.find(chat => chat.id === employee.id);
    if (!existingChat) {
      const newChat = {
        id: employee.id,
        name: employee.name,
        role: employee.role,
        lastMessage: "No messages yet",
        timestamp: "",
        unread: 0,
        online: Math.random() > 0.5,
        isActive: true
      };
      setChats(prevChats => [newChat, ...prevChats]);
      return newChat;
    }
    
    // Move existing chat to top of list
    setChats(prevChats => [
      existingChat,
      ...prevChats.filter(chat => chat.id !== employee.id)
    ]);
    return existingChat;
  };

  const sendMessage = (chatId, content) => {
    const newMessage = {
      id: Date.now(),
      chatId,
      content,
      sender: 'Admin',
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      isAdmin: true
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    const now = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    // Move chat to top when new message is sent
    const updatedChat = chats.find(chat => chat.id === chatId);
    setChats(prevChats => [
      { ...updatedChat, lastMessage: content, timestamp: now, unread: 0 },
      ...prevChats.filter(chat => chat.id !== chatId)
    ]);
  };

  const getChatMessages = (chatId) => {
    return messages.filter(msg => msg.chatId === chatId);
  };

  const getFinancialStats = (dateRange) => {
    const now = new Date();
    let startDate = new Date();
    
    switch(dateRange) {
      case 'currentWeek':
        startDate.setDate(now.getDate() - now.getDay());
        break;
      case 'lastWeek':
        startDate.setDate(now.getDate() - now.getDay() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth(), 1);
        break;
      case 'year':
        startDate.setMonth(0, 1);
        break;
      default:
        startDate.setMonth(now.getMonth(), 1);
    }

    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    const dateArray = [];
    const revenueData = [];
    const expensesData = [];
    
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dateArray.push(dateStr);

      const dayRevenue = finances
        .filter(t => t.date === dateStr && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      revenueData.push(dayRevenue);

      const dayExpenses = finances
        .filter(t => t.date === dateStr && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      expensesData.push(dayExpenses);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const totalRevenue = finances
      .filter(t => new Date(t.date) >= startDate && 
                  new Date(t.date) <= endDate && 
                  t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = finances
      .filter(t => new Date(t.date) >= startDate && 
                  new Date(t.date) <= endDate && 
                  t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      labels: dateArray,
      revenue: revenueData,
      expenses: expensesData,
      totalRevenue,
      totalExpenses
    };
  };
  
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
    <AdminContext.Provider
      value={{
        employees,
        tasks,
        events,
        finances,
        messages,
        chats,
        addEmployee,
        editEmployee,
        removeEmployee,
        updateEmployeeStatus,
        addTask,
        updateTaskStatus,
        removeTask,
        addEvent,
        editEvent,
        removeEvent,
        addTransaction,
        initializeChats,
        startChat,
        sendMessage,
        getChatMessages,
        getFinancialStats,
        getStatistics
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}