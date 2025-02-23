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
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, state]);

  return [state, setState];
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
  const [notifications, setNotifications] = useLocalStorage('notifications', {
    dashboard: [],
    employees: [],
    tasks: [],
    schedule: [],
    messages: [],
    finance: [],
    analytics: [],
    reports: [],
    settings: []
  });

  const markNotificationAsRead = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: prev[type].map(n => ({ ...n, isRead: true }))
    }));
  };

  const addNotification = (type, content) => {
    setNotifications(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), { id: Date.now(), content, isRead: false }]
    }));
  };

  // Employee functions
  const addEmployee = (employee) => {
    const newEmployee = { ...employee, id: Date.now() };
    setEmployees([...employees, newEmployee]);
    addNotification('employees', `New employee added: ${employee.name}`);
  };

  const editEmployee = (id, updatedData) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, ...updatedData } : emp
    ));
    addNotification('employees', `Employee updated: ${updatedData.name}`);
  };

  const removeEmployee = (id) => {
    const employee = employees.find(emp => emp.id === id);
    setEmployees(employees.filter(emp => emp.id !== id));
    addNotification('employees', `Employee removed: ${employee.name}`);
  };

  const updateEmployeeStatus = (id, status) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, status } : emp
    ));
    const employee = employees.find(emp => emp.id === id);
    addNotification('employees', `Employee status updated: ${employee.name} is now ${status}`);
  };

  // Task functions
  const addTask = (task) => {
    const newTask = { ...task, id: Date.now() };
    setTasks([...tasks, newTask]);
    addNotification('tasks', `New task assigned: ${task.title} to ${task.assignedTo}`);
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status } : task
    ));
    const task = tasks.find(t => t.id === id);
    addNotification('tasks', `Task status updated: ${task.title} is now ${status}`);
  };

  const removeTask = (id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.filter(task => task.id !== id));
    addNotification('tasks', `Task removed: ${task.title}`);
  };

  // Event functions
  const addEvent = (event) => {
    const newEvent = { ...event, id: Date.now() };
    setEvents([...events, newEvent]);
    addNotification('schedule', `New event scheduled: ${event.title}`);
  };

  const editEvent = (id, updatedData) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, ...updatedData } : event
    ));
    addNotification('schedule', `Event updated: ${updatedData.title}`);
  };

  const removeEvent = (id) => {
    const event = events.find(e => e.id === id);
    setEvents(events.filter(event => event.id !== id));
    addNotification('schedule', `Event cancelled: ${event.title}`);
  };

  // Finance functions
  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, id: Date.now() };
    setFinances([...finances, newTransaction]);
    addNotification('finance', 
      `New ${transaction.type}: ₹${transaction.amount} - ${transaction.description}`
    );
  };

  // Chat functions
  const initializeChats = () => {
    if (chats.length === 0) {
      const initialChats = employees.map(emp => {
        const employeeMessages = messages.filter(msg => 
          msg.sender === emp.name || msg.recipient === emp.name
        );
        const lastMessage = employeeMessages.length > 0 
          ? employeeMessages[employeeMessages.length - 1].content 
          : "No messages yet";
        const unreadCount = employeeMessages.filter(
          msg => !msg.isRead && msg.sender === emp.name
        ).length;

        return {
          id: emp.id,
          name: emp.name,
          role: emp.role,
          lastMessage,
          timestamp: employeeMessages.length > 0 
            ? employeeMessages[employeeMessages.length - 1].timestamp 
            : new Date().toISOString(),
          unread: unreadCount,
          online: false,
          isActive: false
        };
      });
      setChats(initialChats);
    }
  };

  const startChat = (employee) => {
    const employeeMessages = messages.filter(msg => 
      msg.sender === employee.name || msg.recipient === employee.name
    );
    const lastMessage = employeeMessages.length > 0 
      ? employeeMessages[employeeMessages.length - 1].content 
      : "No messages yet";
    const unreadCount = employeeMessages.filter(
      msg => !msg.isRead && msg.sender === employee.name
    ).length;

    const existingChat = chats.find(chat => chat.id === employee.id);
    if (!existingChat) {
      const newChat = {
        id: employee.id,
        name: employee.name,
        role: employee.role,
        lastMessage,
        timestamp: employeeMessages.length > 0 
          ? employeeMessages[employeeMessages.length - 1].timestamp 
          : new Date().toISOString(),
        unread: unreadCount,
        online: false,
        isActive: true
      };
      setChats(prevChats => [newChat, ...prevChats]);
      return newChat;
    }
    
    setChats(prevChats => [
      { ...existingChat, lastMessage, unread: unreadCount },
      ...prevChats.filter(chat => chat.id !== employee.id)
    ]);
    return existingChat;
  };

  const sendMessage = (content, recipientName) => {
    const newMessage = {
      id: Date.now(),
      content,
      sender: 'Admin',
      recipient: recipientName,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    addNotification('messages', `Message sent to ${recipientName}`);
    
    // Update chat
    const recipientEmployee = employees.find(emp => emp.name === recipientName);
    if (recipientEmployee) {
      startChat(recipientEmployee);
    }
  };

  const getChatMessages = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return [];
    
    return messages.filter(msg => 
      (msg.sender === employee.name && msg.recipient === 'Admin') ||
      (msg.sender === 'Admin' && msg.recipient === employee.name)
    );
  };

  const getFinancialStats = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const dateArray = [];
    const revenueData = [];
    const expensesData = [];

    const currentDate = new Date(startDate);

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

  const logout = () => {
    setMessages([]);
    setChats([]);
    setNotifications({
      dashboard: [],
      employees: [],
      tasks: [],
      schedule: [],
      messages: [],
      finance: [],
      analytics: [],
      reports: [],
      settings: []
    });
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
        notifications,
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
        getStatistics,
        markNotificationAsRead,
        addNotification,
        logout
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}