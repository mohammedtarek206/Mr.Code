'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShare } from 'react-icons/fi';

export default function IOSInstallGuide() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    const isStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;

    if (isIOS && isSafari && !isStandalone) {
      if (!localStorage.getItem('ios-pwa-dismissed')) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('ios-pwa-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-dark/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-2xl pb-safe"
        >
          <button onClick={handleDismiss} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <FiX size={20} />
          </button>
          
          <div className="flex flex-col items-center text-center space-y-4 pt-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              <span className="text-white font-bold text-3xl">MC</span>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-xl mb-2">أضف Mr Code للشاشة الرئيسية</h3>
              <p className="text-gray-300 text-sm mb-4">
                لتثبيت التطبيق على جهازك:
              </p>
              
              <ol className="text-right text-gray-200 text-sm space-y-3 bg-white/5 p-4 rounded-xl w-full">
                <li className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                  <span>اضغط على زر المشاركة</span>
                  <FiShare className="text-accent" />
                  <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center font-bold">1</span>
                </li>
                <li className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                  <span>اختر "Add to Home Screen"</span>
                  <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center font-bold">2</span>
                </li>
                <li className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                  <span>اضغط على "Add"</span>
                  <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center font-bold">3</span>
                </li>
              </ol>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
