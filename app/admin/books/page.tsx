'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiBook, FiLink, FiX, FiCheckCircle } from 'react-icons/fi';

interface Book {
    _id?: string;
    title: string;
    description: string;
    driveLink: string;
    category: string;
}

export default function AdminBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Book>({
        title: '',
        description: '',
        driveLink: '',
        category: 'General'
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await fetch('/api/books');
            const data = await res.json();
            if (Array.isArray(data)) setBooks(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/books/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchBooks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                fetchBooks();
                setShowModal(false);
                setFormData({ title: '', description: '', driveLink: '', category: 'General' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Manage Books</h1>
                    <p className="text-gray-400">Add or remove public resources and books.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl flex items-center transition-all shadow-lg"
                >
                    <FiPlus className="mr-2" /> Add New Book
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div key={book._id} className="glass p-6 rounded-2xl border border-white/5 relative group hover:border-primary/50 transition-all">
                        <button
                            onClick={() => book._id && handleDelete(book._id)}
                            className="absolute right-4 top-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FiTrash2 />
                        </button>
                        <FiBook className="text-primary w-10 h-10 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{book.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                            <span className="px-2 py-1 bg-white/5 rounded-full">{book.category}</span>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-dark-light w-full max-w-lg rounded-3xl p-8 border border-white/10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Add New Resource</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                    <FiX size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Book Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                                        dir="auto"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Drive Link</label>
                                    <input
                                        type="url"
                                        required
                                        className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                                        value={formData.driveLink}
                                        onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Description</label>
                                    <textarea
                                        className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none h-24 resize-none"
                                        dir="auto"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary py-4 rounded-xl text-white font-bold hover:scale-[1.02] transition-transform"
                                >
                                    {loading ? 'Creating...' : 'Save Book'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
