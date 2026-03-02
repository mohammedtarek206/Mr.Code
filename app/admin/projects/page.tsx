'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiImage, FiX, FiExternalLink, FiUser } from 'react-icons/fi';

interface Project {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    studentName: string;
    demoUrl?: string;
    projectLink?: string;
}

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        studentName: '',
        demoUrl: '',
        projectLink: ''
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData({ ...formData, imageUrl: base64String });
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects');
            const data = await res.json();
            if (Array.isArray(data)) setProjects(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                summary: formData.description.substring(0, 100) + '...'
            };

            const res = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                fetchProjects();
                setShowModal(false);
                setFormData({ title: '', description: '', imageUrl: '', studentName: '', demoUrl: '', projectLink: '' });
                setImagePreview(null);
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.details || errData.error}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/projects?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Student Projects</h1>
                    <p className="text-gray-400">Showcase best work from your students.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary hover:bg-primary/80 text-white font-black px-6 py-3 rounded-xl flex items-center transition-all shadow-lg"
                >
                    <FiPlus className="mr-2" /> Add Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div key={project._id} className="glass rounded-[2rem] border border-white/5 overflow-hidden group hover:border-primary/50 transition-all flex flex-col">
                        <div className="relative aspect-video">
                            <img src={project.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={project.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <button
                                onClick={() => handleDelete(project._id)}
                                className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                        <div className="p-8 space-y-4 flex-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-primary font-black uppercase tracking-widest">
                                    <FiUser className="mr-2" /> {project.studentName}
                                </div>
                                {project.projectLink && (
                                    <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                                        <FiExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight">{project.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{project.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-dark-light w-full max-w-2xl rounded-[2.5rem] p-6 md:p-10 border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black text-white tracking-tighter">Add Student Work</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Project Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="e.g. E-Commerce Dashboard"
                                            dir="auto"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Student Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="e.g. Ahmed Ali"
                                            dir="auto"
                                            value={formData.studentName}
                                            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Project Link (URL)</label>
                                        <div className="relative group">
                                            <FiExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="url"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                                placeholder="https://..."
                                                value={formData.projectLink}
                                                onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Project Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="project-image"
                                            required={!formData.imageUrl}
                                        />
                                        <label
                                            htmlFor="project-image"
                                            className="w-full bg-white/5 border border-dashed border-white/10 rounded-2xl py-3 px-6 text-gray-400 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all truncate"
                                        >
                                            <FiImage className="mr-2" /> {imagePreview ? 'Change Image' : 'Upload local image'}
                                        </label>
                                    </div>
                                </div>

                                {imagePreview && (
                                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                                        <img src={imagePreview} className="w-full h-full object-contain" alt="Preview" />
                                        <button
                                            type="button"
                                            onClick={() => { setImagePreview(null); setFormData({ ...formData, imageUrl: '' }); }}
                                            className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg text-white"
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-primary/50 outline-none h-32 resize-none"
                                        placeholder="Explain what makes this project special..."
                                        dir="auto"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:shadow-2xl hover:shadow-primary/20 text-white font-black py-5 rounded-2xl text-lg transition-all"
                                >
                                    {loading ? 'Publishing...' : 'PUBLISH PROJECT'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
