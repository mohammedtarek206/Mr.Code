'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-dark"
        >
          <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)]">
              <span className="text-white font-black text-6xl">MC</span>
            </div>
            
            <div className="absolute -inset-4 border border-primary/30 rounded-3xl animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute -inset-8 border border-accent/20 rounded-3xl animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 text-center"
          >
            <h1 className="text-4xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
              Mr Code
            </h1>
            <p className="text-primary font-medium tracking-widest uppercase text-sm">
              Mohammed Tarek
            </p>
          </motion.div>

          <div className="absolute bottom-20 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-accent to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
