'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ReelCard from '@/components/ReelCard';
import { projects, contact } from '@/lib/data';
import { getStatusColor, getStatusIcon, getProgressColor } from '@/lib/utils';
import { staggerContainer } from '@/lib/motion';

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  return (
    <ReelCard delay={index * 0.08} className="project-card" style={{ padding: '2rem' }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: getStatusColor(project.status) }}>
        <span>{getStatusIcon(project.status)}</span>
        {project.status}
      </div>
      <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>{project.icon}</div>
      <h3 style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '0.75rem' }}>{project.title}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span className="tag-aura">{project.category}</span>
        <span className="tag-aura tag-aura--outline">{project.impact}</span>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
          <span>{project.stage}</span>
          <span style={{ color: getProgressColor(project.progress) }}>{project.progress}%</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
          <div style={{ width: `${project.progress}%`, height: '100%', background: getProgressColor(project.progress), borderRadius: 8, transition: 'width 0.3s' }} />
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem', textAlign: 'center', fontSize: '0.95rem' }}>{project.description}</p>
      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>👥 {project.team}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {project.technologies.map((tech) => (
          <span key={tech} className="tag-aura tag-aura--sm">{tech}</span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="button-aura" style={{ flex: 1, justifyContent: 'center', fontSize: '0.9rem' }}>GitHub</a>
        {project.websiteLink && (
          <a href={project.websiteLink} target="_blank" rel="noopener noreferrer" className="button-aura button-aura--outline" style={{ flex: 1, justifyContent: 'center', fontSize: '0.9rem' }}>Live</a>
        )}
      </div>
    </ReelCard>
  );
}

export default function ProjectsPage() {
  return (
    <PageTransition>
      <main>
        <div className="page-hero">
          <motion.h1 className="text-gradient" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Featured Projects</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Innovative AI, robotics, and web development projects solving real-world challenges.
          </motion.p>
        </div>

        <motion.div className="projects-grid" variants={staggerContainer} initial="hidden" animate="visible">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </motion.div>

        <div className="projects-carousel">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        <div className="glass-card" style={{ margin: '2rem 5% 4rem', padding: '2.5rem', textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h3 className="text-gradient" style={{ marginBottom: '1rem' }}>Interested in Collaborating?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Let&apos;s build something amazing together.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`mailto:${contact.email}`} className="button-aura">Let&apos;s Connect</a>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="button-aura button-aura--outline">LinkedIn</a>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
