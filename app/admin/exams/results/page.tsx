'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiFileText, FiCheck, FiX, FiEye, FiRotateCcw, FiSearch } from 'react-icons/fi';

interface ExamResult {
    _id: string;
    studentId: { name: string; email: string; grade: string };
    examId: { title: string; questions: any[] };
    score: number;
    answers: number[];
    status: 'Pass' | 'Fail';
    isAllowedRetake: boolean;
    completedAt: string;
}

export default function AdminResults() {
    const [results, setResults] = useState<ExamResult[]>([]);
    const [search, setSearch] = useState('');
    const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/exams/results', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setResults(data);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleRetake = async (resultId: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/exams/results', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ resultId, isAllowedRetake: !currentStatus }),
            });
            if (res.ok) fetchResults();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredResults = results.filter(r =>
        r.studentId?.name.toLowerCase().includes(search.toLowerCase()) ||
        r.examId?.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Exam Results</h1>
                    <p className="text-gray-400">Monitor student performance and manage retakes.</p>
                </div>
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search student or exam..."
                        className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-white outline-none focus:ring-2 focus:ring-accent/50 w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <th className="px-8 py-6">Student</th>
                            <th className="px-8 py-6">Exam</th>
                            <th className="px-8 py-6">Score</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6">Date</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredResults.map((result) => (
                            <tr key={result._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mr-3">
                                            <FiUser />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">{result.studentId?.name}</div>
                                            <div className="text-gray-500 text-xs">{result.studentId?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-gray-300 font-medium">{result.examId?.title}</td>
                                <td className="px-8 py-6">
                                    <span className={`text-lg font-black ${result.score >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.score}%
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${result.status === 'Pass' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {result.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-gray-500 text-sm">
                                    {new Date(result.completedAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setSelectedResult(result)}
                                            className="p-3 bg-white/5 text-gray-400 rounded-xl hover:bg-accent hover:text-dark transition-all"
                                            title="View Details"
                                        >
                                            <FiEye />
                                        </button>
                                        <button
                                            onClick={() => toggleRetake(result._id, result.isAllowedRetake)}
                                            className={`p-3 rounded-xl transition-all ${result.isAllowedRetake
                                                    ? 'bg-accent text-dark'
                                                    : 'bg-white/5 text-gray-400 hover:bg-blue-500 hover:text-white'
                                                }`}
                                            title={result.isAllowedRetake ? "Revoke Retake" : "Allow Retake"}
                                        >
                                            <FiRotateCcw />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedResult && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-dark-light w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-10 border border-white/10"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-white">{selectedResult.studentId?.name}'s Answers</h2>
                                    <p className="text-accent text-sm font-bold uppercase tracking-widest">{selectedResult.examId?.title}</p>
                                </div>
                                <button onClick={() => setSelectedResult(null)} className="p-3 bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {selectedResult.examId?.questions.map((q: any, i: number) => {
                                    const isCorrect = selectedResult.answers[i] === q.correctOption;
                                    return (
                                        <div key={i} className={`p-6 rounded-2xl border ${isCorrect ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                                            <div className="flex justify-between mb-4">
                                                <h4 className="text-white font-bold">Q{i + 1}: {q.text}</h4>
                                                {isCorrect ? <FiCheck className="text-green-500" /> : <FiX className="text-red-500" />}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {q.options.map((opt: string, oIdx: number) => (
                                                    <div key={oIdx} className={`p-3 rounded-xl text-sm ${oIdx === q.correctOption
                                                            ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                                                            : oIdx === selectedResult.answers[i]
                                                                ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                                                                : 'bg-white/5 text-gray-500 border border-white/5'
                                                        }`}>
                                                        {opt}
                                                        {oIdx === q.correctOption && <span className="ml-2 text-[10px] font-black uppercase">(Correct)</span>}
                                                        {oIdx === selectedResult.answers[i] && !isCorrect && <span className="ml-2 text-[10px] font-black uppercase">(Student Choice)</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
