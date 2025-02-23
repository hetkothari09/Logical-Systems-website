"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';

export default function Messages() {
  const { employees, chats, messages, initializeChats, sendMessage, getChatMessages, startChat } = useAdmin();
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('chats'); // 'chats' or 'employees'

  useEffect(() => {
    if (chats.length === 0) {
      initializeChats();
    }
  }, [chats.length, initializeChats]);

  useEffect(() => {
    if (selectedChat) {
      const chatMessages = getChatMessages(selectedChat.id);
      setCurrentMessages(chatMessages);
    }
  }, [selectedChat, messages, getChatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    sendMessage(selectedChat.id, newMessage);
    setNewMessage('');
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
    <div className="flex h-[calc(100vh-6rem)]">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-800/50 rounded-lg overflow-hidden mr-4">
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setView('chats')}
              className={`flex-1 py-2 rounded-lg ${
                view === 'chats' ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setView('employees')}
              className={`flex-1 py-2 rounded-lg ${
                view === 'employees' ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              Employees
            </button>
          </div>
          <input
            type="text"
            placeholder={view === 'chats' ? "Search chats..." : "Search employees..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg"
          />
        </div>
        <div className="overflow-y-auto h-[calc(100%-8rem)]">
          {view === 'chats' ? (
            filteredChats.map(chat => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer hover:bg-gray-700/50 ${
                  selectedChat?.id === chat.id ? 'bg-gray-700/50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{chat.name}</h3>
                    <p className="text-sm text-gray-400">{chat.role}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full ${
                      chat.online ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-1 truncate">{chat.lastMessage}</p>
                {chat.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">{chat.timestamp}</p>
                )}
              </motion.div>
            ))
          ) : (
            filteredEmployees.map(employee => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleStartNewChat(employee)}
                className="p-4 cursor-pointer hover:bg-gray-700/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-gray-400">{employee.role}</p>
                  </div>
                  <button className="text-purple-500 text-sm">
                    Chat
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex-1 bg-gray-800/50 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 bg-gray-700/50">
            <h2 className="font-medium">{selectedChat.name}</h2>
            <p className="text-sm text-gray-400">{selectedChat.role}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {currentMessages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] rounded-lg p-3 ${
                  message.isAdmin ? 'bg-purple-600' : 'bg-gray-700'
                }`}>
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 bg-gray-700/50">
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
                className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 bg-gray-800/50 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
}