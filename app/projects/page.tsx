// app/projects/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaRobot, FaBrain, FaShieldAlt, FaWhatsapp, FaHeartbeat, FaTools, FaUsers } from "react-icons/fa";

function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  if (!src) return null;
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <span className="lightbox-close" onClick={onClose}>&times;</span>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt="Lightbox content" width={1200} height={800} style={{ objectFit: 'contain', maxWidth: '90vw', maxHeight: '80vh', width: 'auto', height: 'auto', borderRadius: '8px' }} />
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const projectsData = [
    {
      title: "FlowMind AI - Autonomous Marketing Assistant",
      description: "AI-driven autonomous marketing platform built for HackAbhigna 2025. Features predictive analytics (Prophet), NLP insights with Gemini API, CI/CD pipelines, Docker deployment, and integrations with YouTube, Twitter, Instagram, Facebook, and Google Search Console. Built with Python, Flask, React, and Langchain.",
      icon: FaRobot,
      projectLink: "https://github.com/Sadhu2005/Team_FlowMind_AI_project",
      color: "#6366F1"
    },
    {
      title: "ANU-Humanoid-AI",
      description: "Advanced humanoid AI system with vision, voice, and intelligent conversational capabilities. Built using TensorFlow, OpenCV, and advanced NLP models for PC and Android platforms.",
      icon: FaBrain,
      projectLink: "https://github.com/Sadhu2005/ANU-Humanoid-AI",
      color: "#8B5CF6"
    },
    {
      title: "AI-Powered Fraud Detection System",
      description: "Robust fraud detection system leveraging machine learning algorithms and AI to identify and prevent fraudulent activities in real-time. Built with Python, Scikit-learn, and advanced ML models.",
      icon: FaShieldAlt,
      projectLink: "https://github.com/Sadhu2005/AI-Powered-Fraud-Detection-System",
      color: "#EF4444"
    },
    {
      title: "WhatsApp Auto - Automation Tool",
      description: "Intelligent automation system for WhatsApp that processes resumes and streamlines communication workflows. Built with Node.js, Puppeteer, and automation frameworks.",
      icon: FaWhatsapp,
      projectLink: "https://github.com/Sadhu2005/whatsapp_auto",
      color: "#25D366"
    },
    {
      title: "HealthCheckr - Website Monitoring Tool",
      description: "Full-stack containerized application for monitoring website uptime and performance. Features real-time status dashboard, dynamic website management, email alerts on status changes, background Python worker, PostgreSQL database, and complete CI/CD pipeline with Jenkins. Built with Python, Flask, Docker, Docker Compose, and Jenkins for automated deployments.",
      icon: FaHeartbeat,
      projectLink: "https://github.com/Sadhu2005/HealthCheckr",
      color: "#EC4899"
    },
    {
      title: "GenZFlow - CI/CD Platform",
      description: "Modern CI/CD platform designed for Gen Z developers, featuring seamless workflow management, automated deployment pipelines, and GitHub Actions integration. Built with React, Node.js, and MongoDB.",
      icon: FaTools,
      projectLink: "https://github.com/Sadhu2005/GenZFlow",
      color: "#10B981"
    },
    {
      title: "GenZSpace - Collaborative Platform",
      description: "Cross-platform collaborative application providing virtual workspace for Gen Z users to collaborate, share ideas, and work on projects collectively. Built with Flutter, Firebase, and RESTful APIs.",
      icon: FaUsers,
      projectLink: "https://github.com/Sadhu2005/GenZSpace",
      color: "#F59E0B"
    }
  ];

  return (
    <>
      <main>
        <section id="projects-page" style={{ paddingTop: '100px' }}>
          <h2>My Projects</h2>
          <div className="page-grid">
            {projectsData.map((project, index) => {
              const IconComponent = project.icon;
              return (
                <div key={index} className="project-card-full">
                  <div className="project-image-wrapper" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(189, 24, 204, 0.1)',
                    borderRadius: '12px',
                    padding: '40px',
                    minHeight: '200px',
                    cursor: 'default'
                  }}>
                    <IconComponent style={{ 
                      fontSize: '80px', 
                      color: project.color,
                      width: '120px',
                      height: '120px'
                    }} />
                  </div>
                  <div className="project-info-full">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <a href={project.projectLink} className="button-primary" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}