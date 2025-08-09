import Image from 'next/image';
import Link from 'next/link';
// --- IMPORT ALL NEW ICONS ---
import { FaLinkedin, FaEnvelope, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Home() {
  return (
    <main>
      {/* ... (Your header, about, education, etc. sections are all the same) ... */}
      
      <header style={{ position: 'relative', paddingTop: '32px', paddingBottom: '32px' }}>
        <Image
          src="/certificates/sadu.jpg"
          alt="Sadhu J"
          className="profile-photo"
          width={180}
          height={180}
          style={{
            objectFit: 'cover',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        />
        <video
          className="profile-video"
          controls
          width="320"
          poster="/video/VID_20250326_191540.mp4"
          style={{
            position: 'absolute',
            top: '150px',
            right: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <source src="/video/VID_20250326_191540.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1 style={{ textAlign: 'center' }}>Sadhu{'\u00A0'}J</h1>
        <p style={{ textAlign: 'center' }}>Dynamic and Motivated B.E Student Majoring in Artificial Intelligence and Machine Learning.</p>
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
                <strong>Aspiring AI & ML Engineer | Data Scientist | AI Tool Builder</strong><br /><br />
                I am a passionate B.E. student specializing in <strong>Artificial Intelligence and Machine Learning</strong>, with a strong focus on
                <strong> developing intelligent systems and fine-tuning AI models</strong> for real-world applications. Skilled in frameworks like
                <strong> TensorFlow, OpenCV, Scikit-learn, and Flask</strong>, I’ve successfully built AI models that integrate computer vision,
                speech recognition, and natural language processing.
            </p>
            <ul style={{ fontSize: '18px', lineHeight: 1.8, marginTop: '20px', paddingLeft: '20px' }}>
                <li> Developed <strong>“Anu AI”</strong> with vision and voice capabilities for PC and Android.</li>
                <li> Built <strong>“Choti Anu AI”</strong> for ESP32-CAM with offline face recognition and intelligent conversations.</li>
                <li> Experienced in supervised, unsupervised, and reinforcement learning models.</li>
            </ul>
            <p style={{ fontSize: '18px', lineHeight: 1.8, marginTop: '20px' }}>
                <strong>Goal:</strong> To enhance my expertise in <strong>neural networks, reinforcement learning, and AI-driven solutions</strong> while contributing to the evolution of AI technologies.
            </p>
        </div>
      </section>

      <section id="education">
        <h2>Education Background</h2>
        <div className="timeline">
          <div className="timeline-item">
            <h3>B.E. in Artificial Intelligence and Machine Learning (Present 7<sup>th</sup> Sem)</h3>
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
          
          {/* --- NEWLY UPDATED ROLE --- */}
          <div className="timeline-item">
            <h3>Software Intern, Sitero. <span style={{ color: 'orange' }}> <b> On-site</b></span></h3>
            <p>4<sup>th</sup> August 2025 - Present</p>
            <ul>
              <li>Engaging in a comprehensive onboarding process within a dynamic and supportive team environment.</li>
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
        <p><strong>Programming Languages:</strong> Python, C, Java, HTML, CSS, JavaScript.</p>
        <p><strong> Databases:</strong> MongoDB, SQL</p>
        <p><strong> Data Visualization:</strong> Power BI, Tableau</p>
        <p><strong>Software:</strong> MS Excel, Fusion 360, Linux, PyCharm, VSCode, GoogleColab, Jupyter Notebook.</p>
        <p><strong>Frameworks:</strong> Pandas, NumPy, Matplotlib, OpenCV, TensorFlow, Scikit-learn, TTS, NLP, PyTorch.</p>
        <p><strong>Hardware & Embedded Systems</strong> Raspberry Pi 5 | Arduino Uno | ESP32 | ESP32-CAM</p>
        <p><strong>Languages:</strong> English (Fluent), Kannada (Fluent), Hindi (Fluent), Adivasi (Fluent), Tamil (Basic Understanding).</p>
      </section>

      <section id="tools">
        <h2>My Tools</h2>
        <p style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem auto'}}>
          I enjoy building small utilities and tools to solve problems and improve workflows. Check out the full list of tools I've developed.
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

      {/* --- NEW AND IMPROVED CONTACT SECTION --- */}
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