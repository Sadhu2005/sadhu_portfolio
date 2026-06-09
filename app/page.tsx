'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaLinkedin,
  FaEnvelope,
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFileDownload,
  FaGithub,
} from 'react-icons/fa';
import SectionShell from '@/components/SectionShell';
import ScrollIndicator from '@/components/ScrollIndicator';
import { profile, contact, education, experience, skills } from '@/lib/data';
import { asset } from '@/lib/utils';
import { fadeUp, transitionAura } from '@/lib/motion';

export default function Home() {
  return (
    <main className="snap-container">
      <ScrollIndicator />

      <SectionShell id="hero" className="hero-section">
        <div style={{ textAlign: 'center' }}>
          <motion.div
            className="profile-aura-ring"
            style={{ display: 'inline-block', marginBottom: '2rem' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...transitionAura, duration: 0.8 }}
          >
            <Image
              src={asset(profile.photo)}
              alt={profile.name}
              width={180}
              height={180}
              className="profile-photo-inner"
              style={{ objectFit: 'cover' }}
            />
          </motion.div>
          <motion.h1
            className="text-gradient"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1rem' }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...transitionAura, delay: 0.2 }}
          >
            {profile.name}
          </motion.h1>
          <motion.p
            style={{ fontSize: '1.15rem', maxWidth: '720px', margin: '0 auto 2rem', color: 'var(--text-muted)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionAura, delay: 0.4 }}
          >
            {profile.tagline}
          </motion.p>
          <motion.a
            href={asset(contact.resume)}
            download={contact.resumeFilename}
            className="button-aura"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <FaFileDownload /> Download Resume
          </motion.a>
          <div className="hero-scroll-cue" aria-hidden>
            <span>Scroll</span>
            <span className="hero-scroll-cue-chevron">&#9660;</span>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="about">
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>About Me</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            <strong>{profile.about.headline}</strong>
          </p>
          {profile.about.paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1rem', color: 'var(--text-muted)' }}>{p}</p>
          ))}
          <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.9 }}>
            {profile.about.highlights.map((h, i) => (
              <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--text-light)' }}>{h}</li>
            ))}
          </ul>
          <p style={{ marginTop: '1.5rem', fontSize: '1.05rem' }}>
            <strong>Goal:</strong> {profile.about.goal}
          </p>
        </div>
      </SectionShell>

      <SectionShell id="education">
        <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Education</h2>
        <div className="timeline">
          {education.map((item, i) => (
            <div key={i} className="timeline-item glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--aura-primary)', marginBottom: '0.5rem' }}>{item.degree}</h3>
              <p>{item.institution}</p>
              {item.university && <p style={{ color: 'var(--text-muted)' }}>{item.university}</p>}
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="experience">
        <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Experience</h2>
        <div className="timeline">
          {experience.map((item, i) => (
            <div key={i} className="timeline-item glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--aura-primary)' }}>
                {item.title}
                {item.mode && <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}> · {item.mode}</span>}
              </h3>
              {item.period && <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{item.period}</p>}
              <ul style={{ paddingLeft: '1.25rem' }}>
                {item.bullets.map((b, j) => (
                  <li key={j} style={{ marginBottom: '0.4rem', lineHeight: 1.6 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="skills">
        <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          {skills.map((skill, i) => (
            <motion.span
              key={skill.category}
              className="glass-card"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <strong style={{ color: 'var(--aura-secondary)' }}>{skill.category}:</strong>{' '}
              <span style={{ color: 'var(--text-muted)' }}>{skill.items}</span>
            </motion.span>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="links">
        <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Explore</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {[
            { href: '/projects', label: 'Projects', desc: '9 innovative builds' },
            { href: '/tools', label: 'Tools', desc: 'Dev utilities' },
            { href: '/achievements', label: 'Achievements', desc: 'Hackathons & events' },
            { href: '/certifications', label: 'Certifications', desc: '37 credentials' },
          ].map((link) => (
            <motion.div key={link.href} whileHover={{ y: -4 }}>
              <Link href={link.href} className="glass-card" style={{ display: 'block', padding: '1.5rem', textDecoration: 'none', textAlign: 'center' }}>
                <h3 className="text-gradient" style={{ marginBottom: '0.5rem' }}>{link.label}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{link.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="contact">
        <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Contact</h2>
        <div className="contact-container glass-card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          <div className="contact-item">
            <FaLinkedin className="contact-icon" />
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">{contact.linkedinLabel}</a>
          </div>
          <div className="contact-item">
            <FaGithub className="contact-icon" />
            <a href={contact.github} target="_blank" rel="noopener noreferrer">{contact.githubLabel}</a>
          </div>
          <div className="contact-item">
            <FaWhatsapp className="contact-icon" />
            <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">{contact.whatsappDisplay}</a>
          </div>
          <div className="contact-item">
            <FaPhoneAlt className="contact-icon" />
            <span>{contact.phone}</span>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <span>{contact.location}</span>
          </div>
          <div className="contact-item" style={{ marginTop: '1rem' }}>
            <FaFileDownload className="contact-icon" />
            <a href={asset(contact.resume)} download={contact.resumeFilename} className="text-gradient" style={{ fontWeight: 'bold' }}>
              Download Resume
            </a>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
