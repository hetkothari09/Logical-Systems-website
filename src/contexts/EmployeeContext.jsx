"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export const EmployeeContext = createContext();

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
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

export function EmployeeProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [messages, setMessages] = useLocalStorage('messages', []);
  const [events, setEvents] = useLocalStorage('events', []);
  const [chats, setChats] = useLocalStorage('chats', []);
  const [notifications, setNotifications] = useLocalStorage('notifications', {
    tasks: [],
    messages: [],
    schedule: []
  });
  const [currentEmployee, setCurrentEmployee] = useLocalStorage('currentEmployee', {
    id: 1,
    name: 'John Doe',
    role: 'Technician',
    email: 'john@example.com',
    phone: '+91 9876543210',
    status: 'Active',
    joinDate: '2024-01-15'
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

  const getMyTasks = () => tasks.filter(task => task.assignedTo === currentEmployee.name);

  const updateTaskStatus = (taskId, status) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
    
    // Notify admin
    const taskTitle = tasks.find(t => t.id === taskId)?.title;
    addNotification('tasks', `Task ${status}: ${taskTitle}`);
    if (Notification.permission === 'granted') {
      new Notification('Task Status Updated', {
        body: `Task ${status}: ${taskTitle}`,
        icon: '/images/og-image.jpg'
      });
    }
  };

  const getMySchedule = () => events.filter(event => 
    event.participants?.includes(currentEmployee.name)
  );

  const getMyMessages = () => {
    const adminChat = {
      id: 'admin',
      name: 'Admin',
      role: 'Administrator',
      lastMessage: messages.length > 0 ? messages[messages.length - 1].content : 'No messages yet',
      unread: messages.filter(m => !m.isRead && m.sender === 'Admin').length
    };

    const myMessages = messages.filter(msg => 
      (msg.sender === currentEmployee.name && msg.recipient === 'Admin') ||
      (msg.sender === 'Admin' && msg.recipient === currentEmployee.name)
    );

    return { 
      messages: myMessages,
      chats: [adminChat]
    };
  };

  const sendMessage = (content, recipient) => {
    const newMessage = {
      id: Date.now(),
      content,
      sender: currentEmployee.name,
      recipient,
      timestamp: new Date().toISOString(),
      isRead: false,
      isEmployee: true
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    addNotification('messages', `Message sent to ${recipient}`);

    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification('Message Sent', {
        body: content,
        icon: '/images/og-image.jpg'
      });
    }
  };

  const updateProfile = (updatedData) => {
    setCurrentEmployee(prev => ({
      ...prev,
      ...updatedData
    }));
    addNotification('profile', 'Profile updated successfully');
  };

  const logout = () => {
    setCurrentEmployee({
      id: 1,
      name: 'John Doe',
      role: 'Technician',
      email: 'john@example.com',
      phone: '+91 9876543210',
      status: 'Active',
      joinDate: '2024-01-15'
    });
    setNotifications({
      tasks: [],
      messages: [],
      schedule: []
    });
  };

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <EmployeeContext.Provider
      value={{
        currentEmployee,
        tasks,
        messages,
        events,
        chats,
        notifications,
        getMyTasks,
        updateTaskStatus,
        getMySchedule,
        getMyMessages,
        sendMessage,
        updateProfile,
        markNotificationAsRead,
        addNotification,
        logout
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}