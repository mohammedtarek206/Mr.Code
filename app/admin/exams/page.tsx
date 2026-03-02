'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiClock, FiX, FiCheckCircle, FiFileText, FiTarget } from 'react-icons/fi';

interface Exam {
    _id: string;
    title: string;
    description: string;
    trackId?: { _id: string, title: string };
    isGeneral: boolean;
    duration: number;
    passScore: number;
    questions: any[];
    startDate?: string;
    endDate?: string;
    oneTimeAttempt: boolean;
    isActive: boolean;
}

export default function AdminExams() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [tracks, setTracks] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        title: '',
        description: '',
        trackId: '',
        isGeneral: false,
        duration: 30,
        passScore: 50,
        questions: [] as any[],
        startDate: '',
        endDate: '',
        oneTimeAttempt: true,
        isActive: true
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchExams();
        fetchTracks();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await fetch('/api/admin/exams');
            const data = await res.json();
            if (Array.isArray(data)) setExams(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTracks = async () => {
        const res = await fetch('/api/tracks');
        const data = await res.json();
        setTracks(data);
    };

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { text: '', options: ['', '', '', ''], correctOption: 0 }]
        });
    };

    const updateQuestion = (qIdx: number, text: string) => {
        const qs = [...formData.questions];
        qs[qIdx].text = text;
        setFormData({ ...formData, questions: qs });
    };

    const updateOption = (qIdx: number, oIdx: number, text: string) => {
        const qs = [...formData.questions];
        qs[qIdx].options[oIdx] = text;
        setFormData({ ...formData, questions: qs });
    };

    const setCorrect = (qIdx: number, oIdx: number) => {
        const qs = [...formData.questions];
        qs[qIdx].correctOption = oIdx;
        setFormData({ ...formData, questions: qs });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = '/api/admin/exams';
            const method = editingId ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                _id: editingId,
                trackId: formData.isGeneral ? undefined : formData.trackId
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                fetchExams();
                setShowModal(false);
                resetForm();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            trackId: '',
            isGeneral: false,
            duration: 30,
            passScore: 50,
            questions: [],
            startDate: '',
            endDate: '',
            oneTimeAttempt: true,
            isActive: true
        });
        setEditingId(null);
    };

    const handleEdit = (exam: Exam) => {
        setFormData({
            title: exam.title,
            description: exam.description,
            trackId: exam.trackId?._id || '',
            isGeneral: exam.isGeneral || false,
            duration: exam.duration,
            passScore: exam.passScore,
            questions: exam.questions,
            startDate: exam.startDate ? new Date(exam.startDate).toISOString().slice(0, 16) : '',
            endDate: exam.endDate ? new Date(exam.endDate).toISOString().slice(0, 16) : '',
            oneTimeAttempt: exam.oneTimeAttempt,
            isActive: exam.isActive ?? true
        });
        setEditingId(exam._id);
        setShowModal(true);
    };

    const handleStatusToggle = async (id: string, newStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/exams', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ _id: id, isActive: newStatus }),
            });
            if (res.ok) fetchExams();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/exams?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchExams();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Exams & Assessments</h1>
                    <p className="text-gray-400">Create multiple choice exams for your tracks.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-accent hover:bg-accent/80 text-dark font-black px-6 py-3 rounded-xl flex items-center transition-all shadow-lg"
                >
                    <FiPlus className="mr-2" /> New Exam
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {exams.map((exam) => (
                    <div key={exam._id} className="glass p-8 rounded-[2rem] border border-white/5 relative group hover:border-accent/50 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <span className="text-xs font-black text-accent uppercase tracking-[0.2em]">{exam.trackId?.title}</span>
                                <h3 className="text-2xl font-bold text-white tracking-tight">{exam.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleStatusToggle(exam._id, !exam.isActive)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${exam.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                                >
                                    {exam.isActive ? 'Active' : 'Inactive'}
                                </button>
                                <button
                                    onClick={() => handleEdit(exam)}
                                    className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                                >
                                    <FiPlus style={{ transform: 'rotate(45deg)' }} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(exam._id)}
                                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>

                        {exam.isGeneral && (
                            <div className="mb-4 inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full uppercase tracking-widest">
                                General Exam
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 mb-6">
                            {(exam.startDate || exam.endDate) && (
                                <div className="flex items-center text-gray-400 text-xs w-full mb-2">
                                    <FiClock className="mr-2 text-accent" />
                                    {exam.startDate ? new Date(exam.startDate).toLocaleString() : 'Now'} - {exam.endDate ? new Date(exam.endDate).toLocaleString() : 'Forever'}
                                </div>
                            )}
                            <div className="flex items-center text-gray-400 text-sm">
                                <FiClock className="mr-2 text-accent" /> {exam.duration} Min
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                                <FiFileText className="mr-2 text-accent" /> {exam.questions.length} Questions
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                                <FiTarget className="mr-2 text-accent" /> {exam.passScore}% to Pass
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{exam.description}</p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-dark-light w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-10 border border-white/10"
                        >
                            <div className="flex justify-between items-center mb-10 sticky top-0 bg-dark-light z-10 py-2">
                                <h2 className="text-3xl font-black text-white tracking-tighter">Create Assessment</h2>
                                <button onClick={() => setShowModal(false)} className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Exam Title</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-accent/50"
                                                dir="auto"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="hidden peer"
                                                    checked={formData.isGeneral}
                                                    onChange={(e) => setFormData({ ...formData, isGeneral: e.target.checked, trackId: e.target.checked ? '' : formData.trackId })}
                                                />
                                                <div className="w-6 h-6 border-2 border-accent/50 rounded-md mr-3 flex items-center justify-center peer-checked:bg-accent peer-checked:border-accent transition-all">
                                                    {formData.isGeneral && <FiCheckCircle className="text-dark" />}
                                                </div>
                                                <span className="text-sm font-bold text-white">General Exam (No Track)</span>
                                            </label>
                                        </div>

                                        {!formData.isGeneral && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">For Track</label>
                                                <select
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-accent/50 appearance-none"
                                                    value={formData.trackId}
                                                    onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                                                    required={!formData.isGeneral}
                                                >
                                                    <option value="">Select a track...</option>
                                                    {tracks.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Start Date</label>
                                                <input
                                                    type="datetime-local"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-3 text-white outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">End Date</label>
                                                <input
                                                    type="datetime-local"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-3 text-white outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="flex flex-col space-y-4">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">One-Time Attempt</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, oneTimeAttempt: !formData.oneTimeAttempt })}
                                                    className={`p-4 rounded-2xl border font-bold transition-all flex items-center justify-between ${formData.oneTimeAttempt ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 bg-white/5 text-gray-500'}`}
                                                >
                                                    <span className="text-xs">Enabled</span>
                                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.oneTimeAttempt ? 'bg-accent' : 'bg-gray-700'}`}>
                                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.oneTimeAttempt ? 'right-1' : 'left-1'}`}></div>
                                                    </div>
                                                </button>
                                            </div>
                                            <div className="flex flex-col space-y-4">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Exam Visibility</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                                    className={`p-4 rounded-2xl border font-bold transition-all flex items-center justify-between ${formData.isActive ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-red-500 bg-red-500/10 text-red-500'}`}
                                                >
                                                    <span className="text-xs">{formData.isActive ? 'Active' : 'Hidden'}</span>
                                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isActive ? 'right-1' : 'left-1'}`}></div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Duration (Min)</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-accent/50"
                                                    value={formData.duration}
                                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Pass Score (%)</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-accent/50"
                                                    value={formData.passScore}
                                                    onChange={(e) => setFormData({ ...formData, passScore: parseInt(e.target.value) })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                            <textarea
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-accent/50 h-[108px] resize-none"
                                                dir="auto"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl">
                                        <h3 className="text-xl font-bold text-white">Questions Area</h3>
                                        <button
                                            type="button"
                                            onClick={addQuestion}
                                            className="bg-accent text-dark font-black px-6 py-3 rounded-xl flex items-center shadow-lg hover:scale-105 transition-transform"
                                        >
                                            <FiPlus className="mr-2" /> Add Question
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        {formData.questions.map((q: any, qIdx: number) => (
                                            <div key={qIdx} className="p-8 border border-white/10 rounded-[2rem] bg-white/[0.02] space-y-6 relative group/q">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, questions: formData.questions.filter((_: any, i: number) => i !== qIdx) })}
                                                    className="absolute top-6 right-6 text-gray-600 hover:text-red-500 transition-colors"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                                <div className="space-y-4">
                                                    <label className="text-xs font-bold text-accent uppercase tracking-widest">Question {qIdx + 1}</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter question text..."
                                                        className="w-full bg-white/5 border-b border-white/20 py-4 px-2 text-xl font-bold text-white outline-none focus:border-accent transition-colors"
                                                        dir="auto"
                                                        value={q.text}
                                                        onChange={(e) => updateQuestion(qIdx, e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {q.options.map((opt: string, oIdx: number) => (
                                                        <div key={oIdx} className={`relative flex items-center p-4 rounded-2xl border transition-all ${q.correctOption === oIdx ? 'border-accent bg-accent/5' : 'border-white/5 bg-white/5'
                                                            }`}>
                                                            <input
                                                                type="text"
                                                                placeholder={`Option ${oIdx + 1}`}
                                                                className="flex-1 bg-transparent text-white outline-none text-sm placeholder-gray-600"
                                                                dir="auto"
                                                                value={opt}
                                                                onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setCorrect(qIdx, oIdx)}
                                                                className={`ml-3 p-2 rounded-lg transition-all ${q.correctOption === oIdx ? 'bg-accent text-dark' : 'bg-white/5 text-gray-600 hover:text-white'
                                                                    }`}
                                                            >
                                                                <FiCheckCircle />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-accent text-dark py-6 rounded-3xl font-black text-xl shadow-2xl shadow-accent/20 hover:scale-[1.01] active:scale-100 transition-all uppercase tracking-tighter"
                                >
                                    {loading ? (editingId ? 'Updating...' : 'Publishing...') : (editingId ? 'Update Assessment' : 'Publish Assessment')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
