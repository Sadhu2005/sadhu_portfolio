// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaLinkedin, FaEnvelope, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${p}`;

export default function Home() {
  return (
    <main>
      <header style={{ position: 'relative', paddingTop: '32px', paddingBottom: '32px' }}>
        <Image
          src={asset('/certificates/sadu.jpg')}
          alt="Sadhu J"
          className="profile-photo"
          width={180}
          height={180}
          style={{ objectFit: 'cover', borderRadius: '50%' }}
        />
        <h1>Sadhu{'\u00A0'}J</h1>
        <p>AI & ML engineering student and Android developer building cloud-powered mobile experiences.</p>
      </header>

      <section id="about">
        <div className="about-me-card" style={{
            fontFamily: 'Arial, sans-serif',
            background: 'linear-gradient(135deg, #1e3c72, #2a5298, #6a3093, #a044ff)',
            color: '#fff',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <h2 style={{ textAlign: 'center', color: '#fff', fontSize: '32px', marginBottom: '20px' }}>About Me</h2>
            <p style={{ fontSize: '18px', lineHeight: 1.8, textAlign: 'justify' }}>
                <strong>Aspiring AI & ML Engineer | Android Developer | Cloud Enthusiast</strong><br /><br />
                I am an 8<sup>th</sup> semester B.E. student in <strong>Artificial Intelligence and Machine Learning</strong>, currently working as an
                <strong> Android Developer Intern at ODEE</strong>, a fast-paced edtech startup. I enjoy building end-to-end products that combine
                <strong> machine learning, cloud services, and modern mobile development</strong> to solve real-world problems.
            </p>
            <ul style={{ fontSize: '18px', lineHeight: 1.8, marginTop: '20px', paddingLeft: '20px' }}>
                <li>Hands-on experience with <strong>Kotlin, Jetpack Compose, Flutter, Firebase, Supabase</strong> and app testing through <strong>Google Play Console</strong>.</li>
                <li>Comfortable working with <strong>TensorFlow, PyTorch, OpenCV</strong> and deploying ML-powered features backed by <strong>Azure</strong> and <strong>GCP</strong>.</li>
                <li>Thrives in startup-style environments with daily planning, fast iterations, and close collaboration with cross-functional teams.</li>
            </ul>
            <p style={{ fontSize: '18px', lineHeight: 1.8, marginTop: '20px' }}>
                <strong>Goal:</strong> To grow as an <strong>AI-driven Android engineer</strong>, building reliable, scalable products that blend
                <strong> machine learning, cloud, and mobile experiences</strong> for users at scale.
            </p>
        </div>
      </section>

      <section id="education">
        <h2>Education Background</h2>
        <div className="timeline">
          <div className="timeline-item">
            <h3>B.E. in Artificial Intelligence and Machine Learning (Present 8<sup>th</sup> Sem)</h3>
            <p>Coorg Institute of Technology, Ponnampete Kodagu</p>
            <p>Visvesvaraya Technological University, Belagavi (2022-2026)</p>
          </div>
          <div className="timeline-item">
            <h3>Senior Secondary (XII), Science (PCMB)</h3>
            <p>Viveka PRE University, Sarguru, Mysore (2020-2022)</p>
          </div>
          <div className="timeline-item">
            <h3>SSLC ( High School and Primary Education 5<sup>th</sup> to 10<sup>th</sup> std. )</h3>
            <p>Government high School Kantharajapura {'\u00A0'} (2014-2020)<br /> Channarayapatna Hassan Karnataka</p>
          </div>
        </div>
      </section>

      <section id="experience">
        <h2>Professional Experience</h2>
        <div className="timeline">
          <div className="timeline-item">
            <h3>Android Developer Intern, ODEE <span style={{ color: 'orange' }}> <b> Hybrid</b></span></h3>
            <p>Jan 2026 - Present · Bengaluru, Karnataka, India</p>
            <ul>
              <li>Interning at ODEE, a fast-paced edtech startup building an AI-driven student platform.</li>
              <li>Working in a startup culture with daily planning, rapid iterations, and close collaboration with US-based leadership.</li>
              <li>Developing Android applications using Kotlin and Jetpack Compose.</li>
              <li>Integrating backend services and authentication using Supabase.</li>
            </ul>
          </div>
          <div className="timeline-item">
            <h3>Software Intern, Sitero. <span style={{ color: 'orange' }}> <b> On-site</b></span></h3>
            <p>August 2025 - Present</p>
            <ul>
              <li>Engaged in a comprehensive onboarding process within a dynamic and supportive team environment.</li>
              <li>Focusing on CI/CD pipelines, utilizing technologies such as Docker, Jenkins, and Azure DevOps.</li>
              <li>Exploring and implementing AI-driven automation for real-world healthcare solutions.</li>
            </ul>
          </div>
          <div className="timeline-item">
            <h3>Machine Learning Intern, AiRobosoft. <span style={{ color: 'orange' }}> <b> On-site</b></span></h3>
            <p>April 2024 - May 2024</p>
            <ul>
              <li>Developed machine learning models using Python and OpenCV for OCR projects and conducted Python training sessions for new trainees.</li>
              <li>Collaborated on task-based projects and participated in career development sessions, enhancing both technical and soft skills.</li>
            </ul>
          </div>
          <div className="timeline-item">
            <h3>Internships</h3>
            <ul>
              <li>Artificial Intelligence And Machine Learning, Kodacy (Oct 2023 - Nov 2023). <span style={{ color: 'orange' }}> <b> Online</b></span></li>
              <li>Data Science And Machine Learning, YBI Foundation (Feb 2024). {'\u00A0'}<span style={{ color: 'orange' }}> <b> Online</b></span></li>
            </ul>
          </div>
        </div>
      </section>
      
      <section id="skills">
        <h2>Skills</h2>
        <p><strong>Programming Languages:</strong> Python, C, C++, Java, Kotlin, HTML, CSS, JavaScript</p>
        <p><strong>AI & ML Frameworks:</strong> TensorFlow, PyTorch, Scikit-Learn, OpenCV</p>
        <p><strong>Mobile Development:</strong> Kotlin, Jetpack Compose, Android SDK, Android Studio, Flutter</p>
        <p><strong>DevOps & Cloud:</strong> Docker, Jenkins, Azure DevOps, Microsoft Azure, Google Cloud Platform (GCP)</p>
        <p><strong>Web/API & Backend:</strong> Flask, FastAPI, Supabase, REST APIs, Postman, Firebase</p>
        <p><strong>Data Visualization:</strong> Tableau, Power BI</p>
        <p><strong>Databases:</strong> MySQL, MongoDB, SQL Server</p>
        <p><strong>Tools & App Testing:</strong> Git, VS Code, PyCharm, Jupyter, Colab, n8n, DockerHub, Hostinger Management, Android Studio, Firebase, Google Play Console (release & testing)</p>
        <p><strong>Hardware & Embedded Systems:</strong> Raspberry Pi 5 | Arduino Uno | ESP32 | ESP32-CAM</p>
        <p><strong>Languages:</strong> English (Fluent), Kannada (Fluent), Hindi (Fluent), Adivasi (Fluent), Tamil (Basic Understanding)</p>
      </section>

      <section id="tools">
        <h2>My Tools</h2>
        <p style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem auto'}}>
          I enjoy building small utilities and tools to solve problems and improve workflows. Check out the full list of tools I have developed.
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link href="/tools" className="button-primary">
            View All Tools
          </Link>
        </div>
      </section>

      <section id="projects">
        <h2>Projects</h2>
        <p style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem auto'}}>
          From AI assistants to IoT devices, I love bringing ideas to life. My projects section contains detailed case studies of my work.
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link href="/projects" className="button-primary">
            View All Projects
          </Link>
        </div>
      </section>

      <section id="achievements-preview">
        <h2>Achievements</h2>
        <p style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem auto'}}>
          I actively participate in hackathons and coding competitions to challenge myself and build innovative solutions. Click the button below to see a full list of my technical event participation and outcomes.
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link href="/achievements" className="button-primary">
            View All Competitions & Hackathons
          </Link>
        </div>
      </section>

      <section id="certifications">
        <h2>Certifications</h2>
        <p style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem auto'}}>
          I am committed to continuous learning and have earned numerous certifications across AI, Machine Learning, and software development to validate my skills.
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link href="/certifications" className="button-primary">
            View All Certifications
          </Link>
        </div>
      </section>

      <section id="contact">
        <h2>Contact Information</h2>
        <div className="contact-container">
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <a href="mailto:sadhuj2005@gmail.com">sadhuj2005@gmail.com</a>
          </div>
          <div className="contact-item">
            <FaLinkedin className="contact-icon" />
            <a href="https://www.linkedin.com/in/sadhu-j-3387b228a" target="_blank" rel="noopener noreferrer">Sadhu J on LinkedIn</a>
          </div>
          <div className="contact-item">
            <FaWhatsapp className="contact-icon" />
            <a href="https://wa.me/917022154730" target="_blank" rel="noopener noreferrer">+91 7022154730</a>
          </div>
          <div className="contact-item">
            <FaPhoneAlt className="contact-icon" />
            <span>+91 7760548830</span>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <span>Kadumane Estate, Hassan, Karnataka</span>
          </div>
        </div>
      </section>
    </main>
  );
}