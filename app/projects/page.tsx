// app/projects/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

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
      title: "ANU 6.0 - AI-Powered Humanoid Robot",
      description: "Revolutionary AI-powered humanoid robot for rural education. Features 17 DOF, bilingual communication (Kannada & English), offline-first design, and personalized learning paths. Built with Raspberry Pi 5, TensorFlow, OpenCV, and custom AI models.",
      imageUrl: "/projects/anu-6.0.jpg",
      projectLink: "https://github.com/Sadhu2005/ANU-Humanoid-AI",
      websiteLink: "https://anuai.sadhujdeveloper.com/",
      technologies: ["Python", "TensorFlow", "OpenCV", "Raspberry Pi", "Computer Vision", "AI/ML"],
      status: "In Progress",
      stage: "Hardware Integration",
      progress: 75,
      category: "AI Robotics",
      impact: "Educational Revolution",
      team: "3 Members",
      icon: "🤖"
    },
    {
      title: "AI-Powered Fraud Detection System",
      description: "Advanced machine learning system for detecting fraudulent transactions in real-time. Features anomaly detection, behavioral analysis, and high-accuracy prediction models using state-of-the-art ML algorithms.",
      imageUrl: "/projects/fraud-detection.jpg",
      projectLink: "https://github.com/Sadhu2005/AI-Powered-Fraud-Detection-System",
      websiteLink: "https://sadhu2005.github.io/AI-Powered-Fraud-Detection-System/",
      technologies: ["Python", "Machine Learning", "Data Science", "Anomaly Detection", "Real-time Processing"],
      status: "Completed",
      stage: "Production Ready",
      progress: 100,
      category: "AI Security",
      impact: "Financial Protection",
      team: "Solo Project",
      icon: "🔒"
    },
    {
      title: "GenZSpace - Social Platform",
      description: "Modern social networking platform designed for Gen Z users. Features real-time messaging, content sharing, community building, and advanced user engagement tools with a sleek, responsive design.",
      imageUrl: "/projects/genzspace.jpg",
      projectLink: "https://github.com/Sadhu2005/GenZSpace",
      websiteLink: "https://genzspace.in/",
      technologies: ["React", "Node.js", "MongoDB", "Real-time Chat", "Social Media", "Web Development"],
      status: "Adding Features",
      stage: "Feature Enhancement",
      progress: 85,
      category: "Social Platform",
      impact: "Generation Z Connectivity",
      team: "2 Members",
      icon: "🌟"
    },
    {
      title: "Anu AI - Personal AI Assistant",
      description: "A personal AI assistant with vision and voice capabilities for PC and Android, built using TensorFlow, OpenCV, and Flask for seamless integration.",
      imageUrl: "/projects/anu-ai.jpg",
      projectLink: "https://github.com/Sadhu2005/Anu-AI",
      technologies: ["Python", "TensorFlow", "OpenCV", "Flask", "Computer Vision", "AI Assistant"],
      status: "Completed",
      stage: "Stable Release",
      progress: 100,
      category: "AI Assistant",
      impact: "Daily Productivity",
      team: "Solo Project",
      icon: "👁️"
    },
    {
      title: "Choti Anu AI - IoT Assistant",
      description: "A compact version of Anu AI designed for embedded systems like the ESP32-CAM, featuring offline face recognition and intelligent conversational abilities.",
      imageUrl: "/projects/choti-anu.jpg",
      projectLink: "https://github.com/Sadhu2005/Choti-Anu",
      technologies: ["Python", "ESP32", "IoT", "Face Recognition", "Embedded Systems", "AI"],
      status: "Adding Features",
      stage: "IoT Enhancement",
      progress: 90,
      category: "IoT AI",
      impact: "Smart Home Integration",
      team: "Solo Project",
      icon: "🏠"
    },
    {
      title: "FlowMind AI - Autonomous Marketing Assistant",
      description: "AI-driven autonomous marketing platform built for HackAbhigna 2025. Features predictive analytics (Prophet), NLP insights with Gemini API, CI/CD pipelines, Docker deployment, and integrations with YouTube, Twitter, Instagram, Facebook, and Google Search Console. Built with Python, Flask, React, and Langchain.",
      projectLink: "https://github.com/Sadhu2005/Team_FlowMind_AI_project",
      technologies: ["Python", "Flask", "React", "Langchain", "Prophet", "Gemini API"],
      status: "Completed",
      stage: "Hackathon Finalist",
      progress: 100,
      category: "AI Analytics",
      impact: "Marketing Automation",
      team: "Hackathon Team",
      icon: "🤖"
    },
    {
      title: "WhatsApp Auto - Automation Tool",
      description: "Intelligent automation system for WhatsApp that processes resumes and streamlines communication workflows. Built with Node.js, Puppeteer, and automation frameworks.",
      projectLink: "https://github.com/Sadhu2005/whatsapp_auto",
      technologies: ["Node.js", "Puppeteer", "Automation", "Twilio API"],
      status: "In Progress",
      stage: "Automation Features",
      progress: 80,
      category: "Automation Tool",
      impact: "Recruitment Efficiency",
      team: "Solo Project",
      icon: "💬"
    },
    {
      title: "HealthCheckr - Website Monitoring Tool",
      description: "Full-stack containerized application for monitoring website uptime and performance. Features real-time status dashboard, dynamic website management, email alerts on status changes, background Python worker, PostgreSQL database, and complete CI/CD pipeline with Jenkins.",
      projectLink: "https://github.com/Sadhu2005/HealthCheckr",
      technologies: ["Python", "Flask", "PostgreSQL", "Docker", "Jenkins"],
      status: "Completed",
      stage: "Stable Release",
      progress: 100,
      category: "DevOps & Monitoring",
      impact: "Site Reliability",
      team: "Solo Project",
      icon: "❤️"
    },
    {
      title: "GenZFlow - CI/CD Platform",
      description: "Modern CI/CD platform designed for Gen Z developers, featuring seamless workflow management, automated deployment pipelines, and GitHub Actions integration.",
      projectLink: "https://github.com/Sadhu2005/GenZFlow",
      technologies: ["React", "Node.js", "MongoDB", "GitHub Actions"],
      status: "In Progress",
      stage: "CI/CD Enhancements",
      progress: 70,
      category: "DevOps Platform",
      impact: "Developer Productivity",
      team: "2 Members",
      icon: "🛠️"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'In Progress': return '#f59e0b';
      case 'Adding Features': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return '✅';
      case 'In Progress': return '🚧';
      case 'Adding Features': return '🔧';
      default: return '⏳';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return '#10b981';
    if (progress >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <>
      <main>
        <section id="projects-page" style={{ paddingTop: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Featured Projects
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#e5e7eb', maxWidth: '700px', margin: '0 auto' }}>
              Explore my portfolio of innovative AI, robotics, and web development projects. Each project represents a unique solution to real-world challenges.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '2.5rem',
            padding: '0 1rem'
          }}>
            {projectsData.map((project, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                border: '1px solid #374151',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
              }}>
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(17, 24, 39, 0.95)',
                  padding: '0.5rem 1rem',
                  borderRadius: '25px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: getStatusColor(project.status),
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <span>{getStatusIcon(project.status)}</span>
                  {project.status}
                </div>

                {/* Project Icon */}
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  {project.icon}
                </div>

                {/* Project Title */}
                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: '700',
                  marginBottom: '0.8rem',
                  color: '#e5e7eb',
                  textAlign: 'center',
                  lineHeight: '1.3'
                }}>
                  {project.title}
                </h3>

                {/* Category and Impact */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  gap: '1rem'
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                    color: 'white',
                    padding: '0.4rem 1rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {project.category}
                  </span>
                  <span style={{
                    background: 'rgba(37, 99, 235, 0.2)',
                    color: '#60a5fa',
                    padding: '0.4rem 1rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: '1px solid rgba(37, 99, 235, 0.3)'
                  }}>
                    {project.impact}
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>
                      {project.stage}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: getProgressColor(project.progress) }}>
                      {project.progress}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(37, 99, 235, 0.1)',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${project.progress}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${getProgressColor(project.progress)} 0%, ${getProgressColor(project.progress)}CC 100%)`,
                      borderRadius: '10px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  color: '#d1d5db',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  {project.description}
                </p>

                {/* Team Info */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}>
                  👥 {project.team}
                </div>

                {/* Technologies */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    justifyContent: 'center'
                  }}>
                    {project.technologies?.map((tech, techIndex) => (
                      <span key={techIndex} style={{
                        background: 'rgba(37, 99, 235, 0.1)',
                        color: '#60a5fa',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        border: '1px solid rgba(37, 99, 235, 0.3)'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center'
                }}>
                  <a href={project.projectLink} style={{
                    flex: '1',
                    background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                    color: 'white',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
                  }}>
                    📁 GitHub
                  </a>
                  {project.websiteLink && (
                    <a href={project.websiteLink} style={{
                      flex: '1',
                      background: 'transparent',
                      color: '#60a5fa',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontWeight: '600',
                      border: '2px solid #60a5fa',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#2563eb';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#60a5fa';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                      🌐 Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div style={{
            textAlign: 'center',
            marginTop: '4rem',
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
            borderRadius: '20px',
            color: 'white'
          }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
              Interested in Collaborating?
            </h3>
            <p style={{ marginBottom: '2rem', opacity: '0.9', fontSize: '1.1rem' }}>
              I&apos;m always excited to work on innovative projects and solve complex problems. Let&apos;s create something amazing together!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:sadhuj2005@gmail.com" style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                border: '2px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                💬 Let&apos;s Connect
              </a>
              <a href="https://www.linkedin.com/in/sadhu-j-3387b228a" target="_blank" rel="noopener noreferrer" style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                border: '2px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                📱 LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}