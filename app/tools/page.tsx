// app/tools/page.tsx
'use client';

import { FaWhatsapp, FaChartLine, FaShieldAlt, FaHeartbeat } from "react-icons/fa";

export default function ToolsPage() {
  const toolsData = [
    {
      title: "WhatsApp Resume Processor",
      description: "Automated WhatsApp bot for processing resumes and streamlining recruitment workflows. Built with Node.js, Puppeteer, and Twilio API.",
      icon: FaWhatsapp,
      toolLink: "https://github.com/Sadhu2005/whatsapp_auto",
      type: "WhatsApp Bot",
      color: "#25D366"
    },
    {
      title: "FlowMind Analytics Dashboard",
      description: "Real-time marketing analytics dashboard with AI-powered insights, predictive analytics, and multi-platform integration (YouTube, Instagram, Facebook, Twitter, GSC).",
      icon: FaChartLine,
      toolLink: "https://github.com/Sadhu2005/Team_FlowMind_AI_project",
      type: "AI Analytics Tool",
      color: "#6366F1"
    },
    {
      title: "Fraud Detection API",
      description: "RESTful API for real-time fraud detection using machine learning models. Provides instant risk assessment and anomaly detection.",
      icon: FaShieldAlt,
      toolLink: "https://github.com/Sadhu2005/AI-Powered-Fraud-Detection-System",
      type: "ML API",
      color: "#EF4444"
    },
    {
      title: "HealthCheckr - Website Monitoring Tool",
      description: "Website uptime and performance monitoring application with real-time status dashboard, email alerts, dynamic website management, and automated CI/CD pipeline using Jenkins. Built with Python, Flask, PostgreSQL, Docker, and Docker Compose.",
      icon: FaHeartbeat,
      toolLink: "https://github.com/Sadhu2005/HealthCheckr",
      type: "DevOps Tool",
      color: "#EC4899"
    }
  ];

  return (
    <main>
      <section id="tools-page" style={{ paddingTop: '100px' }}>
        <h2>My Tools</h2>
        <div className="page-grid">
          {toolsData.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <div key={index} className="tool-card-full">
                <div className="tool-image-wrapper" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(189, 24, 204, 0.1)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <IconComponent style={{ 
                    fontSize: '60px', 
                    color: tool.color,
                    width: '100px',
                    height: '100px'
                  }} />
                </div>
                <div className="tool-info-full">
                  <h3>{tool.title}</h3>
                  <span className="tool-type">{tool.type}</span>
                  <p>{tool.description}</p>
                  <a href={tool.toolLink} className="button-primary" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}