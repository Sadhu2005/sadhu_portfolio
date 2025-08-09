// app/certifications/page.tsx
import Image from 'next/image';

export default function CertificationsPage() {
  // Array of your certificate data for easier management later
  const certificates = [
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

  return (
    <main>
      <section id="certifications-page" style={{ paddingTop: '100px' }}>
        <h2>My Certifications</h2>
        <div className="certifications-grid">
          {certificates.map((cert, index) => (
            <div key={index} className="gallery">
              <a href={cert.src} target="_blank" rel="noopener noreferrer">
                <Image src={cert.src} alt={cert.alt} width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: 'auto' }} />
              </a>
              <div className="desc">{cert.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}