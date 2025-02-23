import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black/80 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Logical Systems
          </h3>
          <p className="text-gray-400">
            Your trusted partner in IT solutions and services.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#home" className="hover:text-white">Home</a></li>
            <li><a href="#products" className="hover:text-white">Products</a></li>
            <li><a href="#services" className="hover:text-white">Services</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
          <ul className="space-y-2 text-gray-400">
            <li> Shop No.1, Shree Krishna Building, Kamla Vihar Sports Club Lane</li>
            <li> Mahavir Nagar, Kandivali West, Mumbai, India</li>
            <li>Phone: +91 9820139143</li>
            <li>Email: info@logicalsystems.com</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            {/* Add your social media icons/links here */}
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>© {new Date().getFullYear()} Logical Systems. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 