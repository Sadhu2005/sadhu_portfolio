export default function Home() {
  return (
    <main>
      <header style={{ position: 'relative', paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Profile photo centered and circular */}
        <img
          src="/certificates/sadu.jpg"
          alt="Sadhu J"
          className="profile-photo"
          style={{
            display: 'block',
            margin: '0 auto 16px auto',
            width: '180px',
            height: '180px',
            objectFit: 'cover',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        />
        {/* Video in top-right corner */}
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
        {/* Name and summary centered */}
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
                <li> Developed <strong>"Anu AI"</strong> with vision and voice capabilities for PC and Android.</li>
                <li> Built <strong>"Choti Anu AI"</strong> for ESP32-CAM with offline face recognition and intelligent conversations.</li>
                <li> Experienced in supervised, unsupervised, and reinforcement learning models.</li>
            </ul>
            <p style={{ fontSize: '18px', lineHeight: 1.8, marginTop: '20px' }}>
                <strong>Goal:</strong> To enhance my expertise in <strong>neural networks, reinforcement learning, and AI-driven solutions</strong> while contributing to the evolution of AI technologies.
            </p>
        </div>
      </section>

      {/* --- EDITED SECTION --- */}
      <section id="education">
        <h2>Education Background</h2>
        <div className="timeline">
          <div className="timeline-item">
            <h3>B.E. in Artificial Intelligence and Machine Learning (Present 6<sup>th</sup>Sem)</h3>
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

      {/* --- EDITED SECTION --- */}
      <section id="experience">
        <h2>Professional Experience</h2>
        <div className="timeline">
          <div className="timeline-item">
            <h3>Machine Learning Intern, AiRobosoft. <span style={{ color: 'orange' }}> <b> Onsite</b></span></h3>
            <p>April 22, 2024 - May 18, 2024</p>
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
        <div id="tools-container">
            <div className="tool-card">
                <img src="/tools/sample_tool.png" alt="Tool Icon" className="tool-icon" />
                <div className="tool-info">
                    <h3 className="tool-title">Sample Tool Name</h3>
                    <span className="tool-type">Chrome Extension</span>
                    <p className="tool-description">
                        A brief description of your tool, what it does, and why it’s useful. Replace this with your real tool info.
                    </p>
                    <a href="https://yourtoollink.com" target="_blank" rel="noopener noreferrer" className="tool-link-btn">Use Tool</a>
                </div>
            </div>
        </div>
      </section>

      <section id="projects">
        <h2>Projects</h2>
        <div id="projects-container">
            <div className="project-card">
                <img src="/projects/sample_project.jpg" alt="Sample Project Screenshot" className="project-image" />
                <h3 className="project-title">Sample Project Title</h3>
                <p className="project-description">
                    This is a brief description of your project. Explain what it does, key features, and any highlights you want to mention. Replace this text with your actual project details.
                </p>
                <a href="https://yourprojectwebsite.com" target="_blank" rel="noopener noreferrer" className="project-link-btn">View Project</a>
            </div>
        </div>
        <center><h3> My Projects are in GitHub</h3></center>
        <a href="https://github.com/Sadhu2005">
            <button>GitHub</button>
        </a>
      </section>

      <section id="certifications">
        <h2>Certifications</h2>
        <div id="certificates-container">
            {/* Certificate items will be dynamically added here later */}
        </div>
      </section>

      <section id="contact">
        <h2>Contact Information</h2>
        <p><span className="contact-label">📧 Email:</span> <a href="mailto:sadhuj2005@gmail.com">sadhuj2005@gmail.com</a></p>
        <p>
            <span className="contact-label">LinkedIn:</span>
            <a href="https://www.linkedin.com/in/sadhu-j-3387b228a" target="_blank" rel="noopener noreferrer"> Sadhu J</a>
        </p>
        <p><a href="https://wa.me/qr/NCW64E5ZG2JQJ1"><span className="contact-label">📱 WhatsApp:</span> +91 7022154730</a></p>
        <p><span className="contact-label">📞 Phone:</span> +91 7760548830</p>
        <p><a href="https://maps.app.goo.gl/bfpjpbQDLgHDbr6L6"><span className="contact-label">📍 Location:</span> Kadumane Estate Kadumane, Hassan, Karnataka</a></p>
      </section>
    </main>
  );
}