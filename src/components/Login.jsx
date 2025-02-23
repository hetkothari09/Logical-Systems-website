"use client";
import React from 'react';
import { motion } from 'framer-motion';

const Login = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 p-8 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Login Portal
        </h2>
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/admin-login'}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Login as Admin
          </button>
          <button
            onClick={() => window.location.href = '/employee-login'}
            className="w-full border-2 border-purple-500 text-white py-3 rounded-lg hover:bg-purple-500/20 transition-colors"
          >
            Login as Employee
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 text-gray-400 hover:text-white transition-colors w-full text-center"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Login; 