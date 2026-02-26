'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMail, FiCalendar, FiShield, FiTrash2 } from 'react-icons/fi';

interface Student {
    _id: string;
    name: string;
    email?: string;
    role: string;
    phone?: string;
    parentPhone?: string;
    isActive: boolean;
    isBanned: boolean;
    lastLogin?: string;
    createdAt: string;
}

export default function AdminStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/admin/students', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setStudents(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const toggleStatus = async (id: string, action: 'activate' | 'deactivate' | 'unban') => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/students/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action })
            });
            if (res.ok) {
                // Refresh list
                const updated = students.map(s => {
                    if (s._id === id) {
                        if (action === 'activate') return { ...s, isActive: true };
                        if (action === 'deactivate') return { ...s, isActive: false };
                        if (action === 'unban') return { ...s, isBanned: false };
                    }
                    return s;
                });
                setStudents(updated);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف الطالب ${name} نهائياً؟`)) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/students/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setStudents(students.filter(s => s._id !== id));
            } else {
                const data = await res.json();
                alert(data.error || 'فشل في حذف الطالب');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8" dir="rtl">
            <div className="text-right">
                <h1 className="text-3xl font-bold text-white mb-2">طلاب المنصة</h1>
                <p className="text-gray-400">إدارة وعرض جميع الطلاب والمشرفين المسجلين.</p>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-gray-400 font-medium">الاسم</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">الرتبة</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">معلومات التواصل</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">الحالة</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">آخر ظهور</th>
                                <th className="px-6 py-4 text-gray-400 font-medium">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.map((student) => (
                                <tr key={student._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary ml-3">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-white font-medium">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {student.role === 'admin' ? 'مشرف' : 'طالب'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-sm">
                                            <span className="text-white font-mono">{student.phone || 'N/A'}</span>
                                            <span className="text-gray-400 text-xs">ولي الأمر: {student.parentPhone || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {student.isBanned ? (
                                                <span className="text-red-500 text-xs font-bold uppercase tracking-tighter bg-red-500/10 px-2 py-0.5 rounded w-fit">محظور</span>
                                            ) : student.isActive ? (
                                                <span className="text-green-500 text-xs font-bold uppercase tracking-tighter bg-green-500/10 px-2 py-0.5 rounded w-fit">نشط</span>
                                            ) : (
                                                <span className="text-yellow-500 text-xs font-bold uppercase tracking-tighter bg-yellow-500/10 px-2 py-0.5 rounded w-fit">غير نشط</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-xs text-left" dir="ltr">
                                        {student.lastLogin ? new Date(student.lastLogin).toLocaleString('ar-EG') : 'لم يظهر أبداً'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {student.isBanned ? (
                                                <button
                                                    onClick={() => toggleStatus(student._id, 'unban')}
                                                    className="px-3 py-1.5 bg-green-500/10 text-green-500 text-xs font-bold rounded hover:bg-green-500 hover:text-white transition-all"
                                                >
                                                    إلغاء الحظر
                                                </button>
                                            ) : student.isActive ? (
                                                <button
                                                    onClick={() => toggleStatus(student._id, 'deactivate')}
                                                    className="px-3 py-1.5 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded hover:bg-yellow-500 hover:text-white transition-all"
                                                >
                                                    تعطيل
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => toggleStatus(student._id, 'activate')}
                                                    className="px-3 py-1.5 bg-blue-500/10 text-blue-500 text-xs font-bold rounded hover:bg-blue-500 hover:text-white transition-all"
                                                >
                                                    تفعيل
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(student._id, student.name)}
                                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                title="حذف الطالب"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {students.length === 0 && !loading && (
                        <div className="text-center py-12 text-gray-500">
                            No users found in the database.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
