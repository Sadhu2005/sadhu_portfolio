// app/achievements/page.tsx
'use client'; 

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// --- UPGRADED LIGHTBOX COMPONENT ---
// It now includes logic to automatically pause videos when closed.
function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // This effect runs when the lightbox is closed.
  useEffect(() => {
    return () => {
      // If there was a video playing, pause it.
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [src]); // It re-runs if the source changes.

  if (!src) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <span className="lightbox-close" onClick={onClose}>&times;</span>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {src.endsWith('.mp4') ? (
          <video ref={videoRef} src={src} controls autoPlay muted loop style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '8px' }} />
        ) : (
          <Image src={src} alt="Lightbox content" width={1200} height={800} style={{ objectFit: 'contain', maxWidth: '90vw', maxHeight: '80vh', width: 'auto', height: 'auto', borderRadius: '8px' }} />
        )}
      </div>
    </div>
  );
}


export default function AchievementsPage() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Your achievements data with corrected file paths.
  const achievementsData = [
    {
      eventName: "HackTheHive Hackathon",
      date: "May 2025",
      outcome: "1st Runner-Up & Internship Opportunity",
      description: "Our team, “EvoBot Crew”, secured 1st Runner-Up. We also earned an internship opportunity and a chance to launch our project with expert mentorship and potential investment.",
      techUsed: "AI, Machine Learning, Product Launch Strategy",
      certificateUrl: "/certificates/placeholder.png",
      media: [
        "/event-media/hackthehive-2025/hackthehive1.jpg",
        "/event-media/hackthehive-2025/hackthehive2.jpg",
        "/event-media/hackthehive-2025/hackthehive3.jpg",
        "/event-media/hackthehive-2025/hackthehive4.jpg",
        "/event-media/hackthehive-2025/hackthehive5.jpg",
        "/event-media/hackthehive-2025/hackthehive6.jpg",
        "/event-media/hackthehive-2025/hackthehive7.jpg",
        "/event-media/hackthehive-2025/hackthehive8.jpg",
        "/event-media/hackthehive-2025/hackthehive9.jpg",
      ]
    },
    {
      eventName: "SYMBIOT 2025 - National Level Hackathon",
      date: "May 2025",
      outcome: "2nd Runner-Up",
      description: "Thrilled to announce that our team secured 2nd Runner-Up. As the Team Leader of the D.A.A 5.2 Humanoid Robot project, this was the second time we showcased our robot outside—and both times, I got placed!",
      techUsed: "Raspberry Pi 5, Robotics, Hardware, Team Leadership",
      certificateUrl: "/certificates/cr33.jpg",
      media: [
        "/event-media/symbiot-2025/symbiot1.jpg",
        "/event-media/symbiot-2025/symbiot2.jpg",
        "/event-media/symbiot-2025/symbiot3.jpg",
        "/event-media/symbiot-2025/symbiot1.mp4",
        "/event-media/symbiot-2025/symbiot4.jpg",
        "/event-media/symbiot-2025/symbiot5.jpg",
        "/event-media/symbiot-2025/symbiot6.jpg",
        "/event-media/symbiot-2025/symbiot7.jpg",
      ]
    },
    {
      eventName: "Project Omega 2025 - Code for Enlightenment",
      date: "April 2025",
      outcome: "Shortlisted Participant",
      description: "Proud to have led Team “CITians”. Within the time limit, we built VisionGuard: AI-based Density & Movement Detection — “Prevent the Panic, Protect the People.”",
      techUsed: "AI, Density Detection, Movement Detection",
      certificateUrl: "/certificates/cr31.jpg",
      media: [
        "/event-media/project-omega/project-omega1.jpg",
        "/event-media/project-omega/project-omega2.jpg",
        "/event-media/project-omega/project-omega1.mp4",
        "/event-media/project-omega/project-omega3.jpg",
        "/event-media/project-omega/project-omega2.mp4",
        "/event-media/project-omega/project-omega3.mp4",
      ]
    },
    {
      eventName: "CODE IGNITER 2025",
      date: "April 2025",
      outcome: "Participant",
      description: "Participated in the 8th National Level Coding Competition. The “CODE HUNT” event was fun, exciting, and a great learning experience.",
      techUsed: "Competitive Programming, Problem Solving",
      certificateUrl: "/certificates/cr30.jpg",
      media: [
        "/event-media/Code-Igniter-2025/code-igniter1.jpg",
        "/event-media/Code-Igniter-2025/code-igniter2.jpg",
        "/event-media/Code-Igniter-2025/code-igniter3.jpg",
        "/event-media/Code-Igniter-2025/code-igniter4.jpg",
      ]
    },
    {
      eventName: "TCS TechBytes 2025",
      date: "March 2025",
      outcome: "Participant",
      description: "Participated in an inter-college IT quiz. Though out of my comfort zone, it was a great learning experience.",
      techUsed: "IT General Knowledge",
      certificateUrl: "/certificates/cr29.jpg",
      media: [
        "/event-media/tcs-techbytes-2025/tcs1.jpg",
      ]
    },
    {
      eventName: "E-MINDS Hackathon",
      date: "December 2024",
      outcome: "Participant",
      description: "Had an incredible experience participating in this 28-hour National Level Hackathon. We learned so much from this challenge, from teamwork to innovation.",
      techUsed: "Teamwork, Innovation, Project Development",
      certificateUrl: "/certificates/cr25.jpg",
      media: [
        "/event-media/e-minds-2024/e-minds1.jpg",
        "/event-media/e-minds-2024/e-minds2.jpg",
        "/event-media/e-minds-2024/e-minds3.jpg",
      ]
    },
    {
      eventName: "Micro-Vision - Big Ideas in Small Projects",
      date: "December 2024",
      outcome: "Third Place",
      description: "Thrilled to share that we secured Third place in the state-level event. This was a proud moment as we showcased our D.A.A 5.2 Robot for the first time.",
      techUsed: "Robotics, Project Presentation, CSE/IEEE",
      certificateUrl: "/certificates/cr24.jpg",
      media: [
        "/event-media/micro-vision-2024/micro-vision1.jpg",
        "/event-media/micro-vision-2024/micro-vision2.jpg",
      ]
    },
    {
      eventName: "UTKARSH 2.0: Mini-project Exhibition",
      date: "July 2024",
      outcome: "First Place",
      description: "Awarded First Place for our outstanding project on Robot 5.2 at the mini-project exhibition organized by the Department of Artificial Intelligence and Machine Learning at Coorg Institute of Technology.",
      techUsed: "Robotics, Hardware Integration",
      certificateUrl: "/certificates/placeholder.png",
      media: [
        "/event-media/utkarsh-2024/photo1.jpg",
        "/event-media/utkarsh-2024/photo2.jpg",
      ]
    },
  ];

  return (
    <>
      <main>
        <section id="achievements" style={{ paddingTop: '100px' }}>
          <h2>Competitions & Hackathons</h2>
          <div className="achievements-container">
            {achievementsData.map((event, index) => (
              <div key={index} className="achievement-card">
                <div className="achievement-header">
                  <h3>{event.eventName}</h3>
                  <p className="achievement-date">{event.date}</p>
                </div>
                <div className="achievement-body">
                  <p className="achievement-outcome"><strong>Outcome:</strong> {event.outcome}</p>
                  <p className="achievement-description">{event.description}</p>
                  <p className="achievement-tech"><strong>Key Skills:</strong> {event.techUsed}</p>
                  
                  <span onClick={() => setLightboxSrc(event.certificateUrl)} className="achievement-link" style={{ cursor: 'pointer' }}>
                    View Certificate
                  </span>
                  
                  {event.media.length > 0 && (
                    <div className="achievement-media">
                      <h4>Event Gallery</h4>
                      <div className="media-scroller">
                        {event.media.map((mediaUrl, mediaIndex) => (
                          <div key={mediaIndex} className="media-item" onClick={() => setLightboxSrc(mediaUrl)} style={{ cursor: 'pointer' }}>
                            {mediaUrl.endsWith('.mp4') ? (
                              <div className="video-thumbnail-wrapper">
                                <video src={mediaUrl} muted loop playsInline title={`Video from ${event.eventName}`} />
                                <div className="play-icon">▶</div>
                              </div>
                            ) : (
                              <Image src={mediaUrl} alt={`${event.eventName} media ${mediaIndex + 1}`} width={200} height={150} style={{ objectFit: 'cover' }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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