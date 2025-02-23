"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

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
        theme: theme,
        language: 'English'
      };
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('profileSettings', JSON.stringify(profileData));
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  }, [profileData, theme]);

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

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', newTheme);
      setProfileData(prev => ({ ...prev, theme: newTheme }));
    }
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
          onSubmit={handleProfileUpdate}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
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
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
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
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
            />
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
          <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium">Change Password</h3>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              />
            </div>
            <button className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Update Password
            </button>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
            <button className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Enable 2FA
            </button>
          </div>
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
                onClick={() => toggleTheme('dark')}
                className={`px-4 py-2 rounded ${
                  theme === 'dark'
                    ? 'bg-purple-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => toggleTheme('light')}
                className={`px-4 py-2 rounded ${
                  theme === 'light'
                    ? 'bg-purple-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Light
              </button>
            </div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Language</h3>
            <select
              value={profileData.language}
              onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  );
}