// app/achievements/page.tsx

export default function AchievementsPage() {
  return (
    <main>
      <section id="achievements" style={{ paddingTop: '100px' }}>
        <h2>Competitions & Hackathons</h2>
        <div className="achievements-container">
          
          {/* --- Example Achievement Card (Copy this for each event) --- */}
          <div className="achievement-card">
            <div className="achievement-header">
              <h3>SYMBIOT-2025 National Level Hackathon</h3>
              <p className="achievement-date">August 2025</p>
            </div>
            <div className="achievement-body">
              <p className="achievement-outcome"><strong>Outcome:</strong> 2nd Runner Up</p>
              <p className="achievement-description">
                A 24-hour hackathon focused on developing AI-driven solutions for real-world problems. Our team developed a project for automated OCR processing.
              </p>
              <p className="achievement-tech">
                <strong>Tech Used:</strong> Python, OpenCV, TensorFlow, Flask
              </p>
              {/* Optional: Add a link to the certificate or project */}
              <a href="#" className="achievement-link" target="_blank" rel="noopener noreferrer">View Certificate</a>
            </div>
          </div>
          {/* --- End of Example Card --- */}

          {/* Add another achievement-card div here for your next event */}

        </div>
      </section>
    </main>
  );
}