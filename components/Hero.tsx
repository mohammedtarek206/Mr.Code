'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiCode, FiShield, FiCpu } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const BinaryBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <div className="flex justify-around text-primary/20 font-mono text-[10px] leading-none whitespace-nowrap select-none w-full h-full">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100 }}
            animate={{ y: '100vh' }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="flex flex-col"
          >
            {Array.from({ length: 50 }).map((_, j) => (
              <span key={j} className="my-1">{Math.random() > 0.5 ? '1' : '0'}</span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/team/mohammed.svg',
    '/team/fatima.svg',
    '/team/sara.svg',
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark via-dark-light to-dark pt-20">
      {/* Binary Background */}
      <BinaryBackground />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative mb-12">
            {/* Image Carousel */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary via-accent to-cyber p-1 shadow-[0_0_50px_rgba(0,163,255,0.3)]">
              <div className="w-full h-full rounded-full bg-dark overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={images[currentImage]}
                    alt="Mr.Code - Mohamed Tarek"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>
              {/* Decorative Rings */}
              <div className="absolute -inset-4 border border-primary/20 rounded-full animate-spin-slow"></div>
              <div className="absolute -inset-8 border border-accent/10 rounded-full animate-reverse-spin-slow"></div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-cyber bg-clip-text text-transparent font-cairo"
            >
              Mohammed Tarek
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Empowering the Next Generation of Tech Leaders
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent rounded-full text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/50 text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/tracks"
              className="px-8 py-4 border-2 border-primary/50 text-white rounded-full font-bold hover:bg-primary/10 transition-all text-lg"
            >
              Explore Tracks
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
