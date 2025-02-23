"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';

export default function Messages() {
  const { employees, chats, initializeChats, sendMessage, getChatMessages, startChat } = useAdmin();
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const [view, setView] = useState('chats'); // 'chats' or 'employees'
  const messagesEndRef = useRef(null);
  const lastMessageIdRef = useRef(null);

  // Potential Error 1: initializeChats is called without dependency array
  useEffect(() => {
    initializeChats();
  }, []);
  
  useEffect(() => {
    if (!selectedChat) return;
  
    const messages = getChatMessages(selectedChat.id);
    setLocalMessages(messages);
    
    const interval = setInterval(() => {
      const updatedMessages = getChatMessages(selectedChat.id);
      setLocalMessages(updatedMessages);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [selectedChat, getChatMessages]);


  // Potential Error 3: Notification permission check without error handling
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(err => {
        console.error('Error requesting notification permission:', err);
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Potential Error 4: Missing dependency array in useEffect
  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  // Potential Error 5: sendMessage is called with incorrect parameters
  const handleSendMessage = (e) => {
  e.preventDefault();
  if (!newMessage.trim() || !selectedChat) return;

  sendMessage(newMessage.trim(), selectedChat.name);
  setNewMessage('');
  
  // Update local messages immediately
  const updatedMessages = getChatMessages(selectedChat.id);
  setLocalMessages(updatedMessages);
  scrollToBottom();
};

  const handleStartNewChat = (employee) => {
    const chat = startChat(employee);
    setSelectedChat(chat);
    setView('chats');
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Messages
      </h1>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        {/* Sidebar */}
        <div className="col-span-4 bg-gray-800/50 rounded-xl flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setView('chats')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  view === 'chats' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Chats
              </button>
              <button
                onClick={() => setView('employees')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  view === 'employees' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                New Chat
              </button>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {view === 'chats' ? (
              filteredChats.map(chat => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{chat.name}</h3>
                      <p className="text-sm text-gray-400">{chat.role}</p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1 truncate">{chat.lastMessage}</p>
                </motion.div>
              ))
            ) : (
              filteredEmployees.map(employee => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => handleStartNewChat(employee)}
                  className="p-3 rounded-lg mb-2 cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <h3 className="font-medium">{employee.name}</h3>
                  <p className="text-sm text-gray-400">{employee.role}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat messages */}
        {selectedChat ? (
          <div className="col-span-8 bg-gray-800/50 rounded-xl flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-medium">{selectedChat.name}</h3>
              <p className="text-sm text-gray-400">{selectedChat.role}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {localMessages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 flex ${message.sender === 'Admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'Admin' ? 'bg-blue-600' : 'bg-gray-700'
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
        ) : (
          <div className="col-span-8 bg-gray-800/50 rounded-xl flex items-center justify-center">
            <p className="text-gray-400">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}