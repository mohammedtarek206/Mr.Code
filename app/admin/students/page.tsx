'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMail, FiCalendar, FiShield, FiTrash2 } from 'react-icons/fi';

interface Student {
    _id: string;
    name: string;
    email?: string;
    role: string;
    studentType: 'platform' | 'online' | 'unassigned';
    accessibleTracks: string[];
    accessibleBooks: string[];
    accessibleExams: string[];
    phone?: string;
    parentPhone?: string;
    isActive: boolean;
    isBanned: boolean;
    lastLogin?: string;
    createdAt: string;
}

interface ContentItem {
    _id: string;
    title: string;
}

export default function AdminStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [tracks, setTracks] = useState<ContentItem[]>([]);
    const [books, setBooks] = useState<ContentItem[]>([]);
    const [exams, setExams] = useState<ContentItem[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchContent();
    }, []);

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

    const fetchContent = async () => {
        try {
            const token = localStorage.getItem('token');
            const [tRes, bRes, eRes] = await Promise.all([
                fetch('/api/tracks', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/books', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/admin/exams', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            if (tRes.ok) setTracks(await tRes.json());
            if (bRes.ok) setBooks(await bRes.json());
            if (eRes.ok) setExams(await eRes.json());
        } catch (err) {
            console.error(err);
        }
    };

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
                fetchStudents();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent) return;
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/students/${selectedStudent._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    action: 'updateDetails',
                    studentType: selectedStudent.studentType,
                    accessibleTracks: selectedStudent.accessibleTracks,
                    accessibleBooks: selectedStudent.accessibleBooks,
                    accessibleExams: selectedStudent.accessibleExams
                })
            });

            if (res.ok) {
                setShowModal(false);
                fetchStudents();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
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
                                <th className="px-6 py-4 text-gray-400 font-medium">الرتبة / النوع</th>
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
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${student.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {student.role === 'admin' ? 'مشرف' : 'طالب'}
                                            </span>
                                            {student.role === 'student' && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit ${student.studentType === 'platform' ? 'bg-orange-500/10 text-orange-400' :
                                                    student.studentType === 'online' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-gray-500/10 text-gray-400'
                                                    }`}>
                                                    {student.studentType === 'platform' ? 'طالب منصة' :
                                                        student.studentType === 'online' ? 'طالب أونلاين' : 'غير محدد'}
                                                </span>
                                            )}
                                        </div>
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
                                            {student.role === 'student' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedStudent({
                                                            ...student,
                                                            accessibleTracks: student.accessibleTracks || [],
                                                            accessibleBooks: student.accessibleBooks || [],
                                                            accessibleExams: student.accessibleExams || []
                                                        });
                                                        setShowModal(true);
                                                    }}
                                                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded hover:bg-primary/80 transition-all"
                                                >
                                                    تخصيص
                                                </button>
                                            )}
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

            {/* Customization Modal */}
            {showModal && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-light w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 border border-white/10"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 text-right">تخصيص بيانات الطالب: {selectedStudent.name}</h2>

                        <form onSubmit={handleUpdateStudent} className="space-y-6 text-right">
                            <div>
                                <label className="text-gray-400 block mb-2">نوع الطالب</label>
                                <select
                                    className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                                    value={selectedStudent.studentType}
                                    onChange={(e) => setSelectedStudent({ ...selectedStudent, studentType: e.target.value as any })}
                                >
                                    <option value="unassigned">غير محدد</option>
                                    <option value="platform">طالب منصة</option>
                                    <option value="online">طالب أونلاين</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-gray-400 block mb-2">التراكات المتاحة</label>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-dark/30 rounded-xl">
                                    {tracks.map(t => (
                                        <label key={t._id} className="flex items-center gap-2 text-sm text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudent.accessibleTracks?.includes(t._id)}
                                                onChange={(e) => {
                                                    const updated = e.target.checked
                                                        ? [...(selectedStudent.accessibleTracks || []), t._id]
                                                        : selectedStudent.accessibleTracks.filter(id => id !== t._id);
                                                    setSelectedStudent({ ...selectedStudent, accessibleTracks: updated });
                                                }}
                                            />
                                            {t.title}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-400 block mb-2">الكتب المتاحة</label>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-dark/30 rounded-xl">
                                    {books.map(b => (
                                        <label key={b._id} className="flex items-center gap-2 text-sm text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudent.accessibleBooks?.includes(b._id)}
                                                onChange={(e) => {
                                                    const updated = e.target.checked
                                                        ? [...(selectedStudent.accessibleBooks || []), b._id]
                                                        : selectedStudent.accessibleBooks.filter(id => id !== b._id);
                                                    setSelectedStudent({ ...selectedStudent, accessibleBooks: updated });
                                                }}
                                            />
                                            {b.title}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-400 block mb-2">الامتحانات المتاحة</label>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-dark/30 rounded-xl">
                                    {exams.map(e => (
                                        <label key={e._id} className="flex items-center gap-2 text-sm text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudent.accessibleExams?.includes(e._id)}
                                                onChange={(evt) => {
                                                    const updated = evt.target.checked
                                                        ? [...(selectedStudent.accessibleExams || []), e._id]
                                                        : selectedStudent.accessibleExams.filter(id => id !== e._id);
                                                    setSelectedStudent({ ...selectedStudent, accessibleExams: updated });
                                                }}
                                            />
                                            {e.title}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-primary py-3 rounded-xl text-white font-bold hover:bg-primary/80 transition-all"
                                >
                                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-white/5 py-3 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
