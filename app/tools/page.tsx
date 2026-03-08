// app/tools/page.tsx
'use client';

import RevealSection from '@/components/RevealSection';

export default function ToolsPage() {
  const toolsData = [
    {
      title: "Code Optimizer Pro",
      description: "A lightweight utility that analyzes and optimizes Python code performance. Automatically identifies bottlenecks, suggests improvements, and provides detailed performance metrics.",
      features: ["Code Analysis", "Performance Metrics", "Optimization Suggestions", "Lightweight"],
      status: "Completed",
      category: "Development Utility",
      icon: "⚡",
      demoLink: "#",
      githubLink: "#"
    },
    {
      title: "API Response Validator",
      description: "Quick testing tool for validating API responses. Checks JSON structure, status codes, and response times. Perfect for developers working with multiple APIs.",
      features: ["JSON Validation", "Status Code Check", "Response Time", "Batch Testing"],
      status: "Completed",
      category: "Testing Tool",
      icon: "🔍",
      demoLink: "#",
      githubLink: "#"
    },
    {
      title: "Database Query Builder",
      description: "Visual query builder for complex database operations. Supports multiple database types and generates optimized SQL queries with syntax highlighting.",
      features: ["Visual Builder", "Multi-DB Support", "Query Optimization", "Syntax Highlighting"],
      status: "In Progress",
      category: "Database Tool",
      icon: "🗄️",
      demoLink: "#",
      githubLink: "#"
    },
    {
      title: "Text Summarizer AI",
      description: "AI-powered text summarization tool that extracts key points from long documents. Uses advanced NLP algorithms for accurate and concise summaries.",
      features: ["AI Summarization", "Multiple Languages", "Custom Length", "Export Options"],
      status: "Adding Features",
      category: "AI Utility",
      icon: "📝",
      demoLink: "#",
      githubLink: "#"
    },
    {
      title: "Image Format Converter",
      description: "Batch image converter supporting 20+ formats. Features compression optimization, watermarking, and metadata preservation.",
      features: ["20+ Formats", "Batch Processing", "Compression", "Watermarking"],
      status: "Completed",
      category: "Media Tool",
      icon: "🖼️",
      demoLink: "#",
      githubLink: "#"
    },
    {
      title: "Password Generator Pro",
      description: "Secure password generator with customizable complexity rules. Includes strength checker, memorable password options, and secure storage.",
      features: ["Custom Rules", "Strength Checker", "Memorable Options", "Secure Storage"],
      status: "Completed",
      category: "Security Tool",
      icon: "🔐",
      demoLink: "#",
      githubLink: "#"
    },
    {
      title: "WhatsApp Resume Processor",
      description: "Automated WhatsApp bot for processing resumes and streamlining recruitment workflows. Built with Node.js, Puppeteer, and Twilio API.",
      features: ["Resume Processing", "WhatsApp Integration", "Automation", "Twilio API"],
      status: "Completed",
      category: "Automation Tool",
      icon: "💬",
      demoLink: "https://github.com/Sadhu2005/whatsapp_auto",
      githubLink: "https://github.com/Sadhu2005/whatsapp_auto"
    },
    {
      title: "FlowMind Analytics Dashboard",
      description: "Real-time marketing analytics dashboard with AI-powered insights, predictive analytics, and multi-platform integration (YouTube, Instagram, Facebook, Twitter, GSC).",
      features: ["Real-time Analytics", "Predictive Insights", "Multi-platform Integration", "AI-powered Dashboards"],
      status: "Completed",
      category: "AI Analytics Tool",
      icon: "📊",
      demoLink: "https://github.com/Sadhu2005/Team_FlowMind_AI_project",
      githubLink: "https://github.com/Sadhu2005/Team_FlowMind_AI_project"
    },
    {
      title: "Fraud Detection API",
      description: "RESTful API for real-time fraud detection using machine learning models. Provides instant risk assessment and anomaly detection.",
      features: ["Real-time Detection", "Risk Scoring", "RESTful API", "Anomaly Detection"],
      status: "Completed",
      category: "ML API",
      icon: "🛡️",
      demoLink: "https://github.com/Sadhu2005/AI-Powered-Fraud-Detection-System",
      githubLink: "https://github.com/Sadhu2005/AI-Powered-Fraud-Detection-System"
    },
    {
      title: "HealthCheckr - Website Monitoring Tool",
      description: "Website uptime and performance monitoring application with real-time status dashboard, email alerts, dynamic website management, and automated CI/CD pipeline using Jenkins. Built with Python, Flask, PostgreSQL, Docker, and Docker Compose.",
      features: ["Uptime Monitoring", "Email Alerts", "CI/CD Pipeline", "Dockerized Deployment"],
      status: "Completed",
      category: "DevOps Tool",
      icon: "❤️",
      demoLink: "https://github.com/Sadhu2005/HealthCheckr",
      githubLink: "https://github.com/Sadhu2005/HealthCheckr"
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

  return (
    <main>
      <section id="tools-page" style={{ paddingTop: '100px' }}>
        <RevealSection>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Development Tools & Utilities
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#e5e7eb', maxWidth: '600px', margin: '0 auto' }}>
            Collection of practical tools and utilities I&apos;ve built to streamline development workflows and solve common problems.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem',
          padding: '0 1rem'
        }}>
          {toolsData.map((tool, index) => (
            <div key={index} className="reveal-card" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              border: '1px solid #374151',
              transition: 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease',
              transitionDelay: `${index * 0.08}s`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
            }}>
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(17, 24, 39, 0.9)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: getStatusColor(tool.status)
              }}>
                <span>{getStatusIcon(tool.status)}</span>
                {tool.status}
              </div>

              {/* Tool Icon */}
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {tool.icon}
              </div>

              {/* Tool Title */}
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                color: '#e5e7eb',
                textAlign: 'center'
              }}>
                {tool.title}
              </h3>

              {/* Category Badge */}
              <div style={{
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                  color: 'white',
                  padding: '0.3rem 1rem',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {tool.category}
                </span>
              </div>

              {/* Description */}
              <p style={{
                color: '#d1d5db',
                lineHeight: '1.6',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                {tool.description}
              </p>

              {/* Features */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#e5e7eb',
                  marginBottom: '0.8rem',
                  textAlign: 'center'
                }}>
                  Key Features:
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}>
                  {tool.features.map((feature, featureIndex) => (
                    <span key={featureIndex} style={{
                      background: 'rgba(37, 99, 235, 0.2)',
                      color: '#60a5fa',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      border: '1px solid rgba(37, 99, 235, 0.3)'
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '0.8rem',
                justifyContent: 'center'
              }}>
                <a href={tool.demoLink} style={{
                  flex: '1',
                  background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                  color: 'white',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}>
                  🚀 Try Demo
                </a>
                <a href={tool.githubLink} style={{
                  flex: '1',
                  background: 'transparent',
                  color: '#60a5fa',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '10px',
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
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#60a5fa';
                }}>
                  📁 Source Code
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
          borderRadius: '16px',
          color: 'white'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Need a Custom Tool?
          </h3>
          <p style={{ marginBottom: '1.5rem', opacity: '0.9' }}>
            I&apos;m always building new utilities to solve development challenges. Let me know what tool you need!
          </p>
          <a href="mailto:sadhuj2005@gmail.com" style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '0.8rem 2rem',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            border: '2px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          }}>
            💬 Request a Tool
          </a>
        </div>
        </RevealSection>
      </section>
    </main>
  );
}
