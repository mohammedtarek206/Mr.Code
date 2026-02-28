'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiFileText, FiAward, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function ExamsPage() {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await fetch('/api/admin/exams');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Filter by schedule
                    const now = new Date();
                    const filtered = data.filter(exam => {
                        if (exam.isActive === false) return false;
                        const start = exam.startDate ? new Date(exam.startDate) : null;
                        const end = exam.endDate ? new Date(exam.endDate) : null;
                        if (start && now < start) return false;
                        if (end && now > end) return false;
                        return true;
                    });
                    setExams(filtered);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4 text-right" dir="rtl">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-16">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 italic text-primary uppercase">الاختبارات <span className="text-white not-italic">والتقييمات</span></h1>
                    <p className="text-gray-500 text-xl font-medium">قيم مهاراتك واحصل على درجاتك فوراً بعد الانتهاء</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exams.map((exam, i) => (
                        <motion.div
                            key={exam._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-10 rounded-[3rem] border border-white/5 bg-gradient-to-bl from-white/5 to-transparent flex flex-col group hover:border-primary/50 transition-all"
                        >
                            <div className="mb-8">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                        {exam.isGeneral ? 'اختبار عام' : exam.trackId?.title}
                                    </span>
                                    {exam.oneTimeAttempt && (
                                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                                            محاولة واحدة
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-3xl font-bold text-white mt-4 tracking-tighter">{exam.title}</h3>
                            </div>

                            <div className="space-y-4 mb-10 text-gray-400 font-bold">
                                <div className="flex items-center justify-end">
                                    <span className="mr-2 italic">{exam.duration} دقيقة</span>
                                    <FiClock className="text-primary ml-3" />
                                </div>
                                <div className="flex items-center justify-end">
                                    <span className="mr-2 italic">{exam.questions?.length} سؤال</span>
                                    <FiFileText className="text-primary ml-3" />
                                </div>
                                <div className="flex items-center justify-end">
                                    <span className="mr-2 italic">درجة النجاح {exam.passScore}%</span>
                                    <FiAward className="text-primary ml-3" />
                                </div>
                            </div>

                            <div className="mt-auto">
                                <Link
                                    href={`/exams/${exam._id}`}
                                    className="w-full bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/10 flex items-center justify-center border border-white/10"
                                >
                                    ابدأ الاختبار الآن <FiArrowRight className="mr-2 rotate-180" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {loading && <div className="text-center py-20 animate-pulse text-primary font-black text-2xl tracking-tighter">جاري تحميل الاختبارات...</div>}
                {!loading && exams.length === 0 && <div className="text-center py-20 text-gray-500 font-black text-2xl tracking-tighter">لا توجد اختبارات متاحة حالياً.</div>}
            </div>
        </div>
    );
}
