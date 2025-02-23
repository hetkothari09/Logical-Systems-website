"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MenuIcon, CloseIcon } from './icons';
import Image from 'next/image';
import Login from './Login';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <div className="relative h-12 w-64 hover:opacity-90 transition-opacity">
                <Image
                  src="/images/og-image.jpg"
                  alt="Logical Systems Logo"
                  fill
                  priority
                  className="object-contain"
                  style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                />
              </div>
              <div className="hidden sm:block text-sm text-gray-400 ml-2">
                Computer Hardware, Networking & Security Solutions
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-baseline space-x-8">
                <NavLink href="#home">Home</NavLink>
                <NavLink href="#products">Products</NavLink>
                <NavLink href="#services">Services</NavLink>
                <NavLink href="#contact">Contact</NavLink>
              </div>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Login
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {isOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900/50 backdrop-blur-sm"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <MobileNavLink href="#home" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                <MobileNavLink href="#products" onClick={() => setIsOpen(false)}>Products</MobileNavLink>
                <MobileNavLink href="#services" onClick={() => setIsOpen(false)}>Services</MobileNavLink>
                <MobileNavLink href="#contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
                >
                  Login
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-700"
  >
    {children}
  </a>
);

const MobileNavLink = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
  >
    {children}
  </a>
);

export default Navbar; 