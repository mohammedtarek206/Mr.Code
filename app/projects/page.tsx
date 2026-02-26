'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiUser, FiCode, FiArrowRight } from 'react-icons/fi';

interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  studentName: string;
  projectLink?: string;
}

export default function PublicProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/projects') // Reusing admin GET for public view
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary"
          >
            <FiCode size={40} />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">STUDENT <span className="text-primary">PROJECTS</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed italic">Witness the innovation and creativity of our future developers. These project were built from scratch during our training programs.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass rounded-[2.5rem] overflow-hidden group hover:border-primary/40 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full shadow-2xl shadow-black/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                  {project.projectLink && (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:border-primary"
                    >
                      <FiExternalLink size={20} />
                    </a>
                  )}
                </div>

                <div className="p-10 flex flex-col flex-1 space-y-5">
                  <div className="flex items-center space-x-3 text-primary">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <FiUser size={14} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">{project.studentName}</span>
                  </div>

                  <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 italic flex-1">{project.description}</p>

                  <div className="pt-4 mt-auto">
                    {project.projectLink ? (
                      <a
                        href={project.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between group/btn text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all underline underline-offset-8 decoration-primary/30 hover:decoration-primary"
                      >
                        Visit Development <FiArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Internal Deployment Only</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-40 glass rounded-[3rem] border border-dashed border-white/5">
            <p className="text-gray-600 font-black uppercase tracking-widest">New projects are being curated. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
