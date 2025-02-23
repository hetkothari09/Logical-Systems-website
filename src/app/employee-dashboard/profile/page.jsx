"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEmployee } from '@/contexts/EmployeeContext';

export default function Profile() {
  const { currentEmployee, updateProfile } = useEmployee();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(currentEmployee);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        My Profile
      </h1>

      <div className="bg-gray-800/50 rounded-xl p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-400 mb-1">Name</h3>
                <p className="text-lg">{currentEmployee.name}</p>
              </div>
              <div>
                <h3 className="text-gray-400 mb-1">Role</h3>
                <p className="text-lg">{currentEmployee.role}</p>
              </div>
              <div>
                <h3 className="text-gray-400 mb-1">Email</h3>
                <p className="text-lg">{currentEmployee.email}</p>
              </div>
              <div>
                <h3 className="text-gray-400 mb-1">Phone</h3>
                <p className="text-lg">{currentEmployee.phone}</p>
              </div>
              <div>
                <h3 className="text-gray-400 mb-1">Join Date</h3>
                <p className="text-lg">{currentEmployee.joinDate}</p>
              </div>
              <div>
                <h3 className="text-gray-400 mb-1">Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  currentEmployee.status === 'Active' 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {currentEmployee.status}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}