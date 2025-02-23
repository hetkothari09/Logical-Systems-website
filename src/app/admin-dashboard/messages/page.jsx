"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';

export default function Messages() {
  const { employees } = useAdmin();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize chats from employees
  useEffect(() => {
    const initialChats = employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      lastMessage: "No messages yet",
      timestamp: "",
      unread: 0,
      online: Math.random() > 0.5 // Random online status for demo
    }));
    setChats(initialChats);
    if (initialChats.length > 0) {
      setSelectedChat(initialChats[0]);
    }
  }, [employees]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg = {
      id: Date.now(),
      sender: 'Admin',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAdmin: true
    };

    setMessages(prev => [...prev, newMsg]);
    
    // Update last message in chats
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: newMessage, timestamp: 'Just now' }
        : chat
    ));

    setNewMessage('');
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-gray-800/30 rounded-xl overflow-hidden">
      {/* Chats Sidebar */}
      <div className="w-80 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full px-4 py-2 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-400"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 cursor-pointer hover:bg-gray-700/50 ${
                selectedChat?.id === chat.id ? 'bg-gray-700/50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      {chat.name.charAt(0)}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{chat.name}</div>
                    <div className="text-sm text-gray-400">{chat.role}</div>
                  </div>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-purple-500 text-xs px-2 py-1 rounded-full">
                    {chat.unread}
                  </div>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-400 flex justify-between">
                <span className="truncate">{chat.lastMessage}</span>
                <span className="text-xs">{chat.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="font-medium text-lg">{selectedChat.name}</div>
              <div className="ml-2 text-sm text-gray-400">{selectedChat.role}</div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white">
                <span>📞</span>
              </button>
              <button className="text-gray-400 hover:text-white">
                <span>📹</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isAdmin
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs mt-1 opacity-70">{message.timestamp}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-400"
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
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a conversation to start messaging
        </div>
      )}
    </div>
  );
}