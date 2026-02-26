'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiYoutube, FiVideo } from 'react-icons/fi';

interface Video {
    _id: string;
    title: string;
    description: string;
    youtubeId: string;
}

export default function FreeVideos() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch('/api/free-videos');
                const data = await res.json();
                setVideos(data);
            } catch (err) {
                console.error('Error fetching free videos:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    if (loading) {
        return (
            <div className="py-24 bg-dark text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            </div>
        );
    }

    if (videos.length === 0) return null;

    return (
        <section className="py-24 bg-dark relative overflow-hidden">
            {/* Background elements would go here if needed */}
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full mb-4"
                    >
                        <FiYoutube className="mr-2" />
                        <span className="text-sm font-bold tracking-widest uppercase">Free Content</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Watch & <span className="text-accent">Learn</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto"
                    >
                        Explore our collection of free educational videos on YouTube.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group glass rounded-2xl overflow-hidden"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors text-right">
                                    {video.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed text-right">
                                    {video.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <motion.a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-full font-bold shadow-lg shadow-red-600/20"
                    >
                        <FiYoutube className="mr-2" size={20} /> Subscribe for More
                    </motion.a>
                </div>
            </div>
        </section>
    );
}
