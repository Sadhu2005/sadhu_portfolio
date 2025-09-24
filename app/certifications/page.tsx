// app/certifications/page.tsx
'use client'; // This makes the page interactive

import { useEffect, useState } from 'react';
import Image from 'next/image';

// This is the Lightbox pop-up component
const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${p}`;

function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  if (!src) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <span className="lightbox-close" onClick={onClose}>&times;</span>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <Image src={asset(src)} alt="Certificate Preview" width={1200} height={800} style={{ objectFit: 'contain', maxWidth: '90vw', maxHeight: '80vh', width: 'auto', height: 'auto', borderRadius: '8px' }} />
      </div>
    </div>
  );
}


type Cert = { src: string; alt: string; desc: string; caption?: string };

export default function CertificationsPage() {
  // This state keeps track of which certificate is currently open in the lightbox
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Fallback array (used if JSON manifest missing)
  const fallback: Cert[] = [
    { src: "/certificates/cr35.jpg", alt: "LLM, Agentic Ai & More: Career Guidance", desc: "LLM, Agentic Ai & More: Career Guidance" },
    { src: "/certificates/cr34.jpg", alt: "CoachEd AI Bootcamp", desc: "CoachEd AI Bootcamp" },
    { src: "/event-media/hackthehive-2025/hackthehive10.jpg", alt: "HackTheHive Hackathon", desc: "HackTheHive Hackathon 1st Runner up" },
    { src: "/event-media/hackthehive-2025/hackthehive11.jpg", alt: "HackTheHive Hackathon", desc: "HackTheHive Hackathon" },
    { src: "/certificates/cr33.jpg", alt: "SYMBIOT-2025 2nd Runner up", desc: "SYMBIOT-2025 2nd Runner up" },
    { src: "/certificates/cr32.jpg", alt: "SYMBIOT-2025 Participation", desc: "SYMBIOT-2025 Participation" },
    { src: "/certificates/cr31.jpg", alt: "Project OMEGA 2025 Hackathon", desc: "Project OMEGA 2025 - 24h National-Level Hackathon" },
    { src: "/certificates/cr30.jpg", alt: "CODE IGNITER 2025", desc: "CODE IGNITER 2025 8th National Level Coding Competition" },
    { src: "/certificates/cr29.jpg", alt: "TCS TechBytes", desc: "TCS TechBytes (An inter-College Quiz On IT)" },
    { src: "/certificates/cr28.jpg", alt: "Weekly Coding Challenge 20", desc: "Weekly Coding Challenge 20 (Unstop)" },
    { src: "/certificates/cr27.jpg", alt: "Unstop Talent Park 2025", desc: "Unstop Talent Park 2025 (Round 1)" },
    { src: "/certificates/cr26.jpg", alt: "Infosys Springboard", desc: "Advanced solutions in Go- Testing and Distributed Systems" },
    { src: "/certificates/cr25.jpg", alt: "E- Minds Hackathon", desc: "E- Minds Hackathon (28h) GSSS" },
    { src: "/certificates/cr24.jpg", alt: "Mini Project Expo", desc: "Mini Project Expo (3rd Place) GSSS" },
    { src: "/certificates/cr23.jpg", alt: "Kaggle", desc: "Python Coder (Kaggle)" },
    { src: "/certificates/cr22.jpg", alt: "HP Power Lab", desc: "HP Power Lab by HP (Round 1)" },
    { src: "/certificates/cr21.png", alt: "Software Engineering Fundamentals", desc: "Software Engineering Fundamentals" },
    { src: "/certificates/cr20.jpg", alt: "Flipkart GRiD 6.0", desc: "E-Commerce & Tech Quiz (Flipkart GRiD 6.0)" },
    { src: "/certificates/cr19.jpg", alt: "Code IGNITER 2023", desc: "Code IGNITER 2023 (GSSS)" },
    { src: "/certificates/cr18.jpg", alt: "Great Learning", desc: "Speech Recognition in AI (Great Learning)" },
    { src: "/certificates/cr17.jpg", alt: "MongoDB", desc: "Introduction To MongoDB" },
    { src: "/certificates/cr16.jpg", alt: "Python Debugging", desc: "Programming Debugging Competition (Python)" },
    { src: "/certificates/cr15.jpg", alt: "CoachEd", desc: "Programming, Soft Skill & Power Skill (CoachEd)" },
    { src: "/certificates/cr14.jpg", alt: "AWS Summit India 2024", desc: "AWS Summit India 2024" },
    { src: "/certificates/cr13.jpg", alt: "AiROBOSOFT", desc: "AI&ML Internship @AiROBOSOFT (Onsite)" },
    { src: "/certificates/cr12.jpg", alt: "Great Learning", desc: "Introduction to Neural Networks and Deep Learning" },
    { src: "/certificates/cr11.jpg", alt: "YBI Foundation", desc: "Fundamentals in Big data and Cloud Computing" },
    { src: "/certificates/cr10.jpg", alt: "YBI Foundation", desc: "Fashion Clothing Classification Modelling" },
    { src: "/certificates/cr9.jpg", alt: "YBI Foundation", desc: "Data Science and Machine Learning Internship (2 Weeks)" },
    { src: "/certificates/cr8.jpg", alt: "Great Learning", desc: "Arduino vs Raspberry Pi (Great Learning)" },
    { src: "/certificates/cr7.jpg", alt: "Great Learning", desc: "Machine Learning Algorithms (Great Learning)" },
    { src: "/certificates/cr6.jpg", alt: "Great Learning", desc: "Generative AI for Beginners (Great Learning)" },
    { src: "/certificates/cr5.jpg", alt: "Crion Versity", desc: "Data skills 3 Days Challenge (Crion Versity)" },
    { src: "/certificates/cr4.jpg", alt: "Codedamn", desc: "Linear Algebra for Machine Learning (Codedamn)" },
    { src: "/certificates/cr3.jpg", alt: "be10X", desc: "be10X 1 Day AI Tools Workshop" },
    { src: "/certificates/cr2.jpg", alt: "Udemy", desc: "Applied Ethical Hacking and Rules of Engagement (Udemy)" },
    { src: "/certificates/cr1.jpg", alt: "Kodacy", desc: "30 Day Virtual Internship Kodacy (AI &ML)" },
  ];

  const [certificates, setCertificates] = useState<Cert[]>(fallback);
  const [dynamicCertificates, setDynamicCertificates] = useState<Cert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';
        
        // Load dynamic certificates from MySQL API
        const apiUrl = `${prefix}/api/certificates.php`;
        console.log('Trying to fetch from:', apiUrl);
        const apiRes = await fetch(apiUrl, { signal: controller.signal, cache: 'no-store' });
        if (apiRes.ok) {
          const data: Cert[] = await apiRes.json();
          if (Array.isArray(data) && data.length > 0) {
            setDynamicCertificates(data);
            console.log('Loaded dynamic certificates:', data);
            return; // Success, don't try JSON fallback
          }
        } else {
          console.log('API response not ok:', apiRes.status, apiRes.statusText);
          console.log('API URL was:', apiUrl);
        }
        
        // Fallback to JSON for dynamic data
        const res = await fetch(`${prefix}/data/certificates.json`, { signal: controller.signal, cache: 'no-store' });
        if (res.ok) {
          const data: Cert[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setDynamicCertificates(data);
          }
        }
      } catch (error) {
        console.log('Error loading dynamic certificates:', error);
        // Keep dynamic certificates empty, static fallback will still work
      } finally {
        setIsLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  // Combine static fallback + dynamic certificates
  const allCertificates = [...fallback, ...dynamicCertificates];
  
  // Debug logging
  console.log('Static certificates (fallback):', fallback.length);
  console.log('Dynamic certificates:', dynamicCertificates.length);
  console.log('Total certificates:', allCertificates.length);
  console.log('All certificates data:', allCertificates);

  return (
    <>
      <main>
        <section id="certifications-page" style={{ paddingTop: '100px' }}>
          <h2>My Certifications</h2>
          {isLoading && <p>Loading certificates...</p>}
          <div className="certifications-grid">
            {allCertificates.map((cert, index) => {
              const isDynamic = index >= fallback.length;
              return (
                <div 
                  key={index} 
                  className="gallery" 
                  onClick={() => setLightboxSrc(cert.src)} 
                  style={{ 
                    cursor: 'pointer',
                    border: isDynamic ? '2px solid #4f46e5' : '1px solid #ccc',
                    position: 'relative'
                  }}
                >
                  {isDynamic && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#4f46e5',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      zIndex: 10
                    }}>
                      NEW
                    </div>
                  )}
                <Image 
                  src={asset(cert.src)} 
                  alt={cert.alt} 
                  width={400} 
                  height={300} 
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }} 
                />
                <div className="desc">
                  {cert.caption ? (
                    <>
                      <div style={{ fontWeight: 'bold', color: '#4f46e5', marginBottom: '4px' }}>
                        {cert.caption}
                      </div>
                      <div style={{ fontSize: '0.9em', color: '#9ca3af' }}>
                        {cert.desc}
                      </div>
                    </>
                  ) : (
                    cert.desc
                  )}
                </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      
      {/* This renders the lightbox when a certificate is clicked */}
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}