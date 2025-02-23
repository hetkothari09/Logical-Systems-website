"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ComputerIcon, ServerIcon, ShieldIcon, WrenchIcon } from './icons';

const services = [
  {
    title: 'IT Consultation',
    description: 'Expert guidance for your IT infrastructure needs',
    icon: ComputerIcon,
  },
  {
    title: 'Server Maintenance',
    description: '24/7 server monitoring and maintenance services',
    icon: ServerIcon,
  },
  {
    title: 'Security Solutions',
    description: 'Comprehensive security systems and CCTV installation',
    icon: ShieldIcon,
  },
  {
    title: 'Hardware Repair',
    description: 'Professional repair services for all your devices',
    icon: WrenchIcon,
  },
];

const Services = () => {
  return (
    <section id="services" className="py-16 px-4 bg-black/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-6 bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm hover:bg-gray-800/50 transition-colors duration-200"
            >
              <service.icon className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services; 