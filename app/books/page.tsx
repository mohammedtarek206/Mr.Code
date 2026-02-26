'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiDownload, FiSearch } from 'react-icons/fi';

interface Book {
    _id: string;
    title: string;
    description: string;
    driveLink: string;
    category: string;
}

export default function PublicBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/books')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setBooks(data);
            });
    }, []);

    const filtered = books.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-dark pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-white mb-6">Educational <span className="text-primary">Resources</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-10">Access our curated collection of books and learning materials.</p>

                    <div className="max-w-md mx-auto relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search books..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white outline-none focus:border-primary transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((book, idx) => (
                        <motion.div
                            key={book._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass p-8 rounded-3xl group hover:border-primary/30 transition-all flex flex-col"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                <FiBook size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{book.title}</h3>
                            <p className="text-gray-400 text-sm mb-8 flex-1">{book.description}</p>

                            <a
                                href={book.driveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-white/5 hover:bg-primary text-white font-bold rounded-2xl text-center transition-all flex items-center justify-center space-x-2"
                            >
                                <FiDownload />
                                <span>Download PDF</span>
                            </a>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No books found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
