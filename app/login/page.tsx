'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiKey, FiUser, FiAlertCircle, FiPhone } from 'react-icons/fi';

export default function StudentLoginPage() {
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
            const res = await fetch('/api/auth/code-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    name,
                    phone,
                    parentPhone,
                    deviceId: getDeviceId()
                }),
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
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">STUDENT LOGIN</h1>
                    <p className="text-gray-400">Enter your access code to start learning</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg flex items-center mb-6">
                        <FiAlertCircle className="mr-2" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">Your Full Name</label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-dark/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2 font-medium font-cairo text-right">رقم الهاتف الخاص بك (للتواصل)</label>
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
                        <label className="block text-gray-300 mb-2 font-medium font-cairo text-right">رقم هاتف ولي الأمر (للطوارئ)</label>
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

                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">Access Code</label>
                        <div className="relative">
                            <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-dark/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors tracking-widest font-mono"
                                placeholder="XXXX-XXXX"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent py-4 rounded-xl text-dark font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(235,53,101,0.3)]"
                    >
                        {loading ? 'Validating...' : 'ACCESS PLATFORM'}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Don't have a code? Contact your instructor.
                </p>
            </motion.div>
        </div>
    );
}
