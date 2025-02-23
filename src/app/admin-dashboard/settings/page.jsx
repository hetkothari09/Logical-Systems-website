"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profileSettings');
      return saved ? JSON.parse(saved) : {
        name: 'Admin User',
        email: 'admin@logicalsystems.com',
        phone: '+91 9876543210',
        notifications: {
          email: true,
          push: true,
          tasks: true,
          events: true
        },
        theme: 'dark',
        language: 'English'
      };
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('profileSettings', JSON.stringify(profileData));
    }
  }, [profileData]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('profileSettings', JSON.stringify(profileData));
    alert('Profile updated successfully!');
  };

  const handleNotificationToggle = (type) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Settings
      </h1>

      <div className="flex space-x-4 border-b border-gray-700">
        {['profile', 'notifications', 'security', 'appearance'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize ${
              activeTab === tab
                ? 'text-purple-500 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
          onSubmit={handleProfileUpdate}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Changes
          </button>
        </motion.form>
      )}

      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {Object.entries(profileData.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <span className="capitalize">{key} Notifications</span>
              <button
                onClick={() => handleNotificationToggle(key)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  value ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  value ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <button className="w-full bg-gray-800/50 p-4 rounded-lg text-left hover:bg-gray-700/50">
            <h3 className="font-medium">Change Password</h3>
            <p className="text-sm text-gray-400">Update your password</p>
          </button>
          <button className="w-full bg-gray-800/50 p-4 rounded-lg text-left hover:bg-gray-700/50">
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-400">Add an extra layer of security</p>
          </button>
          <button className="w-full bg-gray-800/50 p-4 rounded-lg text-left hover:bg-gray-700/50">
            <h3 className="font-medium">Login History</h3>
            <p className="text-sm text-gray-400">View your login history</p>
          </button>
        </motion.div>
      )}

      {activeTab === 'appearance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Theme</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setProfileData({ ...profileData, theme: 'dark' })}
                className={`px-4 py-2 rounded ${
                  profileData.theme === 'dark'
                    ? 'bg-purple-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setProfileData({ ...profileData, theme: 'light' })}
                className={`px-4 py-2 rounded ${
                  profileData.theme === 'light'
                    ? 'bg-purple-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Light
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}