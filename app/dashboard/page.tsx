'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiAward, FiBookOpen, FiTarget, FiCheck, FiArrowRight, FiPlayCircle, FiLoader, FiPhone, FiBook } from 'react-icons/fi';
import Link from 'next/link';

export default function StudentDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/student/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                if (res.ok) setData(json);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <FiLoader className="text-primary animate-spin" size={40} />
        </div>
    );

    if (!data) return null;

    const { user, stats, recentResults } = data;

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-6xl space-y-12">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-5xl font-black tracking-tighter mb-2"
                        >
                            WELCOME BACK, <span className="text-primary">{(user.name || 'STUDENT').toUpperCase()}</span>
                        </motion.h1>
                        <div className="flex flex-wrap gap-4 text-gray-500 font-medium tracking-wide">
                            <span className="flex items-center"><FiPhone className="mr-2 text-primary/50" /> {user.phone || 'No Phone'}</span>
                            <span className="flex items-center"><FiUser className="mr-2 text-primary/50" /> Parent: {user.parentPhone || 'N/A'}</span>
                        </div>
                    </div>
                    <Link
                        href="/tracks"
                        className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/10"
                    >
                        Continue Learning
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Exams Passed', value: stats.completedExams, icon: FiAward, color: 'text-primary' },
                        { label: 'Average Score', value: `${stats.avgScore}%`, icon: FiTarget, color: 'text-accent' },
                        { label: 'Enrolled Tracks', value: data.totalTracks, icon: FiBookOpen, color: 'text-cyber' },
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all rotate-12">
                                <s.icon size={80} />
                            </div>
                            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">{s.label}</p>
                            <h3 className={`text-4xl font-black ${s.color || 'text-white'}`}>{s.value}</h3>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Courses / Tracks Section */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-2xl font-black tracking-tighter">RECOMMENDED TRACKS</h3>
                            <Link href="/tracks" className="text-xs font-bold text-gray-500 hover:text-white transition-all uppercase tracking-widest">View All</Link>
                        </div>
                        <div className="space-y-4">
                            <Link href="/tracks" className="glass p-6 rounded-3xl border border-white/5 flex items-center group cursor-pointer hover:border-primary/30 transition-all">
                                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mr-6 text-primary group-hover:scale-110 transition-transform">
                                    <FiPlayCircle size={32} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white mb-1">Explore Tracks</h4>
                                    <p className="text-xs text-gray-500 font-bold">START YOUR JOURNEY</p>
                                </div>
                                <FiArrowRight className="ml-4 text-gray-700 group-hover:text-primary transition-colors" />
                            </Link>

                            <Link href="/books" className="glass p-6 rounded-3xl border border-white/5 flex items-center group cursor-pointer hover:border-accent/30 transition-all">
                                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mr-6 text-accent group-hover:scale-110 transition-transform">
                                    <FiBook size={32} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white mb-1">Electronic Books</h4>
                                    <p className="text-xs text-gray-500 font-bold">RESOURCES & MATERIALS</p>
                                </div>
                                <FiArrowRight className="ml-4 text-gray-700 group-hover:text-accent transition-colors" />
                            </Link>
                        </div>
                    </div>

                    {/* Exams Section */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-2xl font-black tracking-tighter">RECENT ASSESSMENTS</h3>
                            <Link href="/exams" className="text-xs font-bold text-gray-500 hover:text-white transition-all uppercase tracking-widest">Take Exam</Link>
                        </div>
                        <div className="space-y-4">
                            {recentResults && recentResults.length > 0 ? recentResults.map((ex: any, i: number) => (
                                <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${ex.status === 'Pass' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            <FiCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{ex.examId?.title}</h4>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">{new Date(ex.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-white">{ex.score}%</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${ex.status === 'Pass' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{ex.status}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-white/5 p-12 rounded-[2rem] text-center border border-dashed border-white/10">
                                    <FiAward className="mx-auto mb-4 text-gray-600" size={32} />
                                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">No results yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
