"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useEmployee } from '@/contexts/EmployeeContext';

export default function Messages() {
  const { currentEmployee, getMyMessages, sendMessage } = useEmployee();
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);
  const [localMessages, setLocalMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastMessageIdRef = useRef(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const { messages: newMessages } = getMyMessages();
      setLocalMessages(newMessages);
      const unread = newMessages.filter(m => !m.isRead && m.sender === 'Admin').length;
      setUnreadCount(unread);
      
      // Show notification only for the newest message
      const latestMessage = newMessages[newMessages.length - 1];
      if (latestMessage && 
          latestMessage.sender === 'Admin' && 
          !latestMessage.isRead && 
          latestMessage.id !== lastMessageIdRef.current && 
          Notification.permission === 'granted') {
        lastMessageIdRef.current = latestMessage.id;
        new Notification('New Message from Admin', {
          body: latestMessage.content,
          icon: '/images/og-image.jpg'
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getMyMessages]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMounted(true);
    scrollToBottom();
  }, [localMessages]);

  if (!mounted) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessage(newMessage, 'Admin');
    setNewMessage('');
    scrollToBottom();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Messages {unreadCount > 0 && <span className="text-red-500">({unreadCount})</span>}
      </h1>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        {/* Chat messages */}
        <div className="col-span-12 bg-gray-800/50 rounded-xl flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-medium">Admin</h3>
            <p className="text-sm text-gray-400">Administrator</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {localMessages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 flex ${message.sender === currentEmployee.name ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === currentEmployee.name ? 'bg-blue-600' : 'bg-gray-700'
                }`}>
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg"
              />
              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}