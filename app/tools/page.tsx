'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ReelCard from '@/components/ReelCard';
import { tools, contact } from '@/lib/data';
import { getStatusColor, getStatusIcon } from '@/lib/utils';
import { staggerContainer } from '@/lib/motion';

export default function ToolsPage() {
  return (
    <PageTransition>
      <main>
        <div className="page-hero">
          <motion.h1 className="text-gradient" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Development Tools</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Practical utilities built to streamline workflows and solve real problems.
          </motion.p>
        </div>

        <motion.div className="tools-grid" variants={staggerContainer} initial="hidden" animate="visible">
          {tools.map((tool, i) => (
            <ReelCard key={tool.title} delay={i * 0.1} style={{ padding: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.8rem', fontWeight: 600, color: getStatusColor(tool.status) }}>
                {getStatusIcon(tool.status)} {tool.status}
              </div>
              <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.75rem' }}>{tool.icon}</div>
              <h3 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{tool.title}</h3>
              <span className="tag-aura" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}>{tool.category}</span>
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.25rem', lineHeight: 1.6 }}>{tool.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {tool.features.map((f) => (
                  <span key={f} className="tag-aura tag-aura--sm">{f}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a href={tool.demoLink} target="_blank" rel="noopener noreferrer" className="button-aura" style={{ flex: 1, justifyContent: 'center', fontSize: '0.9rem' }}>Demo</a>
                <a href={tool.githubLink} target="_blank" rel="noopener noreferrer" className="button-aura button-aura--outline" style={{ flex: 1, justifyContent: 'center', fontSize: '0.9rem' }}>Source</a>
              </div>
            </ReelCard>
          ))}
        </motion.div>

        <div className="glass-card" style={{ margin: '2rem 5% 4rem', padding: '2rem', textAlign: 'center', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h3 className="text-gradient" style={{ marginBottom: '0.75rem' }}>Need a Custom Tool?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Let me know what you need!</p>
          <a href={`mailto:${contact.email}`} className="button-aura">Request a Tool</a>
        </div>
      </main>
    </PageTransition>
  );
}
