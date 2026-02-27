'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiKey, FiPlus, FiCopy, FiCheck, FiTrash2, FiClock, FiUser, FiPrinter, FiSquare, FiCheckSquare } from 'react-icons/fi';

interface AccessCode {
    _id: string;
    code: string;
    isUsed: boolean;
    studentId?: { name: string };
    trackId?: { title: string };
    createdAt: string;
}

export default function AdminCodes() {
    const [codes, setCodes] = useState<AccessCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(1);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (loading) {
                setLoading(false);
                setError('استغرق جلب البيانات وقتاً طويلاً. يرجى التأكد من اتصال قاعدة البيانات.');
            }
        }, 8000);
        fetchCodes();
        return () => clearTimeout(timeout);
    }, []);

    const fetchCodes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/codes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok) {
                if (Array.isArray(data)) {
                    setCodes(data);
                    setError(null);
                }
            } else {
                setError(data.error || 'فشل تحميل الأكواد من السيرفر');
                setCodes([]);
            }
        } catch (err: any) {
            console.error(err);
            setError('حدث خطأ في الاتصال: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/codes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ count }),
            });
            if (res.ok) {
                fetchCodes();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا الكود؟')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/codes?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchCodes();
                setSelectedIds(prev => prev.filter(i => i !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`هل أنت متأكد من حذف ${selectedIds.length} كود؟`)) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/codes?ids=${selectedIds.join(',')}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchCodes();
                setSelectedIds([]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePrint = () => {
        if (selectedIds.length === 0) {
            alert('يرجى تحديد الأكواد التي ترغب في طباعتها أولاً.');
            return;
        }
        window.print();
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === codes.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(codes.map(c => c._id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const selectedCodes = Array.isArray(codes) ? codes.filter(c => selectedIds.includes(c._id)) : [];

    if (loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
                <p className="text-gray-400 animate-pulse">جاري جلب البيانات...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-center font-bold">
                    {error}
                </div>
            )}
            <div className="flex justify-between items-center no-print">
                <div className="text-right">
                    <h1 className="text-3xl font-bold text-white mb-2">أكواد الدخول</h1>
                    <p className="text-gray-400">قم بتوليد أكواد للطلاب للوصول إلى المنصة.</p>
                </div>
                <div className="flex gap-4">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-3 rounded-xl transition-all font-bold border border-red-500/20"
                        >
                            <FiTrash2 /> حذف المحدد ({selectedIds.length})
                        </button>
                    )}
                    <button
                        onClick={handlePrint}
                        disabled={selectedIds.length === 0}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale"
                    >
                        <FiPrinter /> طباعة المحدد ({selectedIds.length})
                    </button>
                </div>
            </div>

            <div className="glass p-8 rounded-2xl flex flex-col md:flex-row items-end gap-6 border-accent/20 border-t-2 no-print">
                <div className="flex-1 w-full space-y-2">
                    <label className="text-gray-400 text-sm block text-right">عدد الأكواد المطلوب توليدها</label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none text-right"
                    />
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-accent hover:bg-accent/80 text-dark font-black px-8 py-3.5 rounded-xl flex items-center transition-all disabled:opacity-50"
                >
                    {loading ? 'توليد...' : 'توليد الأكواد'} <FiKey className="ml-2" />
                </button>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/5 no-print">
                <div className="overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-gray-400 font-medium w-16">
                                    <button onClick={toggleSelectAll} className="p-2 hover:bg-white/10 rounded-lg transition-all text-accent">
                                        {selectedIds.length === codes.length && codes.length > 0 ? <FiCheckSquare size={20} /> : <FiSquare size={20} />}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-gray-400 font-medium">الكود</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">الحالة</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">الطالب</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">تاريخ الإنشاء</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {Array.isArray(codes) && codes.map((code) => (
                                <tr key={code._id} className={`hover:bg-white/5 transition-colors ${selectedIds.includes(code._id) ? 'bg-primary/5' : ''}`}>
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleSelect(code._id)} className={`p-2 rounded-lg transition-all ${selectedIds.includes(code._id) ? 'text-accent' : 'text-gray-600'}`}>
                                            {selectedIds.includes(code._id) ? <FiCheckSquare size={20} /> : <FiSquare size={20} />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-white text-lg font-bold">{code.code}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {code.isUsed ? (
                                            <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs border border-red-500/20">
                                                مستخدم
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs border border-green-500/20">
                                                متاح
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {code.studentId ? (
                                            <div className="flex items-center text-gray-300">
                                                <FiUser className="ml-2 text-accent" /> {code.studentId.name}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {code.createdAt ? new Date(code.createdAt).toLocaleDateString('ar-EG') : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => copyToClipboard(code.code, code._id)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-all hover:text-white"
                                                title="نسخ الكود"
                                            >
                                                {copiedId === code._id ? <FiCheck className="text-green-500" /> : <FiCopy />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(code._id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-600 hover:text-red-500 transition-all"
                                                title="حذف الكود"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Print Section - Exactly 6 cards per page (3x2) */}
            <div className="hidden print-container">
                {selectedCodes.map((code) => (
                    <div key={code._id} className="print-card" style={{ direction: 'ltr' }}>
                        {/* Header Section */}
                        <div className="flex justify-center items-center mb-4 text-center">
                            <div>
                                <h2 className="text-[18pt] font-black text-white leading-tight mb-2 uppercase">
                                    Eng. Mohamed Tarek
                                </h2>
                                <span className="bg-accent text-dark px-6 py-1.5 rounded-full text-[13pt] font-black shadow-md inline-block">
                                    01284621015
                                </span>
                            </div>
                        </div>

                        {/* Middle Section (Access Code) */}
                        <div className="flex-1 flex flex-col items-center justify-center bg-white/5 rounded-[8mm] border border-white/10 shadow-inner px-4 my-2">
                            <span className="text-[9pt] uppercase tracking-[0.5em] font-black text-white opacity-40 mb-2">Unique Code</span>
                            <h1 className="text-[34pt] font-black font-mono tracking-[0.1em] text-white leading-none">
                                {code.code}
                            </h1>
                        </div>

                        {/* Footer Section */}
                        <div className="mt-4 flex items-center justify-center gap-4 text-[10pt] font-black uppercase tracking-[0.5em] text-primary-light opacity-50">
                            <div className="h-[0.5mm] w-12 bg-current"></div>
                            MR CODE
                            <div className="h-[0.5mm] w-12 bg-current"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
