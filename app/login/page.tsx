'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiKey, FiUser, FiAlertCircle, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function StudentLoginPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [parentPhone, setParentPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Generate or retrieve persistent device ID
    const getDeviceId = () => {
        let id = localStorage.getItem('deviceId');
        if (!id) {
            id = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
            localStorage.setItem('deviceId', id);
        }
        return id;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const body = mode === 'register'
                ? { code, name, phone, parentPhone, deviceId: getDeviceId() }
                : { code, deviceId: getDeviceId() };

            const res = await fetch('/api/auth/code-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('studentCode', code); // For persistence
                router.push('/dashboard'); // Direct to dashboard instead of tracks for better experience
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-2xl w-full max-w-md border-t-4 border-accent"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">
                        {mode === 'login' ? 'Student Login' : 'Registration'}
                    </h1>
                    <p className="text-gray-400">
                        {mode === 'login'
                            ? 'Enter your code for quick access'
                            : 'Enter your details to register your code'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg flex items-center mb-6">
                        <FiAlertCircle className="mr-2" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    {mode === 'register' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-6 overflow-hidden"
                        >
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium font-cairo text-right">الاسم بالكامل</label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-dark/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors text-right"
                                        placeholder="ادخل اسمك بالكامل"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-medium font-cairo text-right">رقم الهاتف الخاص بك</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-dark/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
                                        placeholder="01xxxxxxxxx"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-medium font-cairo text-right">رقم هاتف ولي الأمر</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="tel"
                                        value={parentPhone}
                                        onChange={(e) => setParentPhone(e.target.value)}
                                        className="w-full bg-dark/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
                                        placeholder="01xxxxxxxxx"
                                        required
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-gray-300 mb-2 font-medium font-cairo text-right">كود الدخول</label>
                        <div className="relative">
                            <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-dark/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors tracking-widest font-mono text-center"
                                placeholder="XXXXXXX"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent py-4 rounded-xl text-dark font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(235,53,101,0.3)] uppercase"
                    >
                        {loading ? 'Validating...' : mode === 'login' ? 'Login Now' : 'Register & Enter'}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-primary hover:text-primary/80 font-bold transition-colors text-sm underline underline-offset-4"
                        >
                            {mode === 'login' ? 'إنشاء حساب جديد (لأول مرة)' : 'لديك حساب بالفعل؟ دخول سريع'}
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-gray-500 text-sm font-cairo mb-4">
                        ليست لديك كود؟ تواصل مع المهندس محمد طارق عبر الواتساب
                    </p>
                    <a
                        href="https://wa.me/201284621015"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 px-6 py-3 rounded-full transition-all font-bold border border-green-500/20"
                    >
                        <FaWhatsapp className="text-xl" /> 01284621015
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
