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
      title: "Anu AI - Personal AI Assistant",
      description: "A personal AI assistant with vision and voice capabilities for PC and Android, built using TensorFlow, OpenCV, and Flask for seamless integration.",
      imageUrl: "/projects/anu-ai.jpg", // Replace with your actual image path
      projectLink: "https://github.com/Sadhu2005/Anu-AI"
    },
    {
      title: "Choti Anu AI - IoT Assistant",
      description: "A compact version of Anu AI designed for embedded systems like the ESP32-CAM, featuring offline face recognition and intelligent conversational abilities.",
      imageUrl: "/projects/choti-anu.jpg", // Replace with your actual image path
      projectLink: "https://github.com/Sadhu2005/Choti-Anu"
    },
    // Add more projects here in the future
  ];

  return (
    <>
      <main>
        <section id="projects-page" style={{ paddingTop: '100px' }}>
          <h2>My Projects</h2>
          <div className="page-grid">
            {projectsData.map((project, index) => (
              <div key={index} className="project-card-full">
                <div className="project-image-wrapper" onClick={() => setLightboxSrc(project.imageUrl)}>
                  <Image src={project.imageUrl} alt={project.title} width={500} height={300} style={{ objectFit: 'cover' }} />
                </div>
                <div className="project-info-full">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <a href={project.projectLink} className="button-primary" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}