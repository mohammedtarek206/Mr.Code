'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiX } from 'react-icons/fi';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!localStorage.getItem('pwa-prompt-dismissed')) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-96 z-[100] glass premium-card neon-border"
        >
          <button onClick={handleDismiss} className="absolute top-3 right-3 text-gray-400 hover:text-white">
            <FiX size={20} />
          </button>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">MC</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">أضف تطبيق Mr Code</h3>
              <p className="text-gray-300 text-sm">استمتع بتجربة أسرع وأكثر احترافية!</p>
            </div>
          </div>
          
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              onClick={handleInstall}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all"
            >
              <FiDownload />
              <span>تثبيت التطبيق</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
            >
              لاحقًا
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
