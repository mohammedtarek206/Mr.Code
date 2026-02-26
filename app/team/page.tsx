'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiLinkedin, FiTwitter, FiGithub, FiMail } from 'react-icons/fi';

export default function TeamPage() {
  const team = [
    {
      id: 1,
      name: 'Mohammed Tarek',
      role: 'Founder & CEO',
      bio: 'Tech entrepreneur with 3+ years of experience in software development and education.',
      image: '/team/mohammed.svg',
      socials: {
        linkedin: 'https://linkedin.com/in/ahmed',
        twitter: 'https://twitter.com/ahmed',
        github: 'https://github.com/ahmed',
      },
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-dark via-dark-light to-dark">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-cyber bg-clip-text text-transparent">
            Our Team
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the passionate educators and industry experts who are dedicated to your success.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent p-1 overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={124}
                      height={124}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-dark-light flex items-center justify-center">
                      <span className="text-4xl text-white font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-accent mb-4">{member.role}</p>
                <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  <a href={member.socials.linkedin} className="text-gray-400 hover:text-primary transition-colors">
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                  <a href={member.socials.twitter} className="text-gray-400 hover:text-primary transition-colors">
                    <FiTwitter className="w-5 h-5" />
                  </a>
                  <a href={member.socials.github} className="text-gray-400 hover:text-primary transition-colors">
                    <FiGithub className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
