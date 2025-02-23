"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const products = [
  {
    name: 'CCTV Systems',
    description: 'Advanced surveillance solutions for maximum security',
    image: '/images/cctv.jpg',
    bgColor: 'from-blue-500 to-blue-700'
  },
  {
    name: 'Laptops',
    description: 'High-performance laptops for professionals',
    image: '/images/laptop.jpg',
    bgColor: 'from-purple-500 to-purple-700'
  },
  {
    name: 'Servers',
    description: 'Enterprise-grade servers for your business needs',
    image: '/images/server.jpg',
    bgColor: 'from-indigo-500 to-indigo-700'
  },
  {
    name: 'Desktop PCs',
    description: 'Custom-built computers for every requirement',
    image: '/images/desktop.jpg',
    bgColor: 'from-blue-600 to-blue-800'
  },
  {
    name: 'Networking Equipment',
    description: 'Professional networking solutions for businesses',
    image: '/images/network.jpg',
    bgColor: 'from-purple-600 to-purple-800'
  },
  {
    name: 'Security Systems',
    description: 'Complete security solutions for your premises',
    image: '/images/security.jpg',
    bgColor: 'from-indigo-600 to-indigo-800'
  }
];

const Products = () => {
  return (
    <section id="products" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Our Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/30 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 group"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${product.bgColor} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-2xl font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-200 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {product.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;