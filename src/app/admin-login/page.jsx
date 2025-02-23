"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { authenticateAdmin } from '@/utils/auth';
import { useRouter } from 'next/navigation';

const AdminLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authenticateAdmin(formData.email, formData.password)) {
      router.push('/admin-dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link href="/" className="inline-block">
            <Image
              src="/images/og-image.jpg"
              alt="Logo"
              width={200}
              height={60}
              className="mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Admin Login
          </h2>
        </motion.div>
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-gray-300">Email</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-700 bg-gray-900 text-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-gray-300">Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-700 bg-gray-900 text-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </motion.form>

        {/* Added navigation options */}
        <div className="space-y-4">
          <div className="text-center">
            <Link 
              href="/employee-login"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              Switch to Employee Login
            </Link>
          </div>
          
          <div className="text-center">
            <Link 
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;