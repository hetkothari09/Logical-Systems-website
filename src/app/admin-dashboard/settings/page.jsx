"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@logicalsystems.com',
    phone: '+91 9876543210',
    notifications: {
      email: true,
      push: true,
      tasks: true,
      events: true
    },
    theme: 'dark'
  });

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

      {/* Settings Navigation */}
      <div className="flex space-x-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 ${
            activeTab === 'profile'
              ? 'text-purple-500 border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 ${
            activeTab === 'notifications'
              ? 'text-purple-500 border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2 ${
            activeTab === 'appearance'
              ? 'text-purple-500 border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Appearance
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 ${
            activeTab === 'security'
              ? 'text-purple-500 border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Security
        </button>
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gray-800/50 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Full Name
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
            <button className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Save Changes
            </button>
          </div>
        </motion.div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gray-800/50 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('email')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    profileData.notifications.email ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      profileData.notifications.email ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-400">Receive push notifications</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('push')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    profileData.notifications.push ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      profileData.notifications.push ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {/* Add more notification settings as needed */}
            </div>
          </div>
        </motion.div>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gray-800/50 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold">Appearance Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Theme
              </label>
              <select
                value={profileData.theme}
                onChange={(e) => setProfileData({ ...profileData, theme: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gray-800/50 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold">Security Settings</h2>
            <div className="space-y-4">
              <button className="w-full bg-gray-700 p-4 rounded-lg text-left hover:bg-gray-600 transition-colors">
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-gray-400">Update your password</p>
              </button>
              <button className="w-full bg-gray-700 p-4 rounded-lg text-left hover:bg-gray-600 transition-colors">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </button>
              <button className="w-full bg-gray-700 p-4 rounded-lg text-left hover:bg-gray-600 transition-colors">
                <h3 className="font-medium">Active Sessions</h3>
                <p className="text-sm text-gray-400">Manage your active sessions</p>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}