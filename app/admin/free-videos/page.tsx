'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiYoutube, FiPlus, FiTrash2, FiExternalLink, FiVideo } from 'react-icons/fi';

interface FreeVideo {
    _id: string;
    title: string;
    description: string;
    youtubeId: string;
    createdAt: string;
}

export default function AdminFreeVideos() {
    const [videos, setVideos] = useState<FreeVideo[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtubeId: ''
    });

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await fetch('/api/free-videos');
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setVideos(data);
            } else {
                console.error('Failed to fetch videos:', data.error);
                setVideos([]);
            }
        } catch (err) {
            console.error(err);
            setVideos([]);
        }
    };

    const extractYouTubeId = (url: string) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.youtubeId) {
            alert('يرجى ملء جميع الحقول');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const videoId = extractYouTubeId(formData.youtubeId);

            const res = await fetch('/api/admin/free-videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    youtubeId: videoId
                }),
            });

            if (res.ok) {
                setFormData({ title: '', description: '', youtubeId: '' });
                fetchVideos();
                alert('تمت إضافة الفيديو بنجاح');
            } else {
                const data = await res.json();
                alert(data.error || 'فشل في إضافة الفيديو');
            }
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء الاتصال بالسيرفر');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/free-videos?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                fetchVideos();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="text-right">
                    <h1 className="text-3xl font-bold text-white mb-2">إدارة الفيديوهات المجانية</h1>
                    <p className="text-gray-400">أضف فيديوهات من اليوتيوب لتظهر في الصفحة الرئيسية.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6 border-accent/20 border-t-2">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm block text-right">عنوان الفيديو</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none text-right"
                            placeholder="مثال: مقدمة في البرمجة"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm block text-right">رابط الفيديو أو الـ ID</label>
                        <input
                            required
                            type="text"
                            value={formData.youtubeId}
                            onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                            className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none text-right"
                            placeholder="ضع الرابط هنا: https://youtu.be/..."
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm block text-right">وصف الفيديو</label>
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-dark/50 border border-white/10 rounded-xl p-3 text-white focus:border-accent outline-none text-right h-24"
                        placeholder="اكتب وصفاً قصيراً للفيديو..."
                    />
                </div>
                <button
                    disabled={loading}
                    className="bg-accent hover:bg-accent/80 text-dark font-black px-8 py-3.5 rounded-xl flex items-center transition-all disabled:opacity-50 mr-auto"
                >
                    {loading ? 'جاري الإضافة...' : 'إضافة الفيديو'} <FiPlus className="ml-2" />
                </button>
            </form>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <div key={video._id} className="glass rounded-2xl overflow-hidden border border-white/5 relative group">
                        <div className="aspect-video relative">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                title={video.title}
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-2 text-right">{video.title}</h3>
                            <p className="text-gray-400 text-xs text-right mb-4 line-clamp-2">{video.description}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <button
                                    onClick={() => handleDelete(video._id)}
                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                    title="حذف الفيديو"
                                >
                                    <FiTrash2 />
                                </button>
                                <a
                                    href={`https://youtube.com/watch?v=${video.youtubeId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-accent transition-all flex items-center gap-1 text-sm"
                                >
                                    View on YouTube <FiExternalLink />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {videos.length === 0 && (
                <div className="text-center py-20 glass rounded-2xl border border-dashed border-white/10">
                    <FiVideo className="mx-auto text-4xl text-gray-600 mb-4" />
                    <p className="text-gray-400">لا توجد فيديوهات مضافة بعد.</p>
                </div>
            )}
        </div>
    );
}
