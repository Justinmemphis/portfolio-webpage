import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const terminalLines = [
  { text: '$ whoami', delay: 0 },
  { text: '> Justin Carter - Business Solutions Developer', delay: 800 },
  { text: '$ cat certifications.txt', delay: 1600 },
  { text: '✓ AWS Solutions Architect Associate', delay: 2200 },
  { text: '✓ AWS Cloud Practitioner', delay: 2600 },
  { text: '✓ CompTIA Security+', delay: 3000 },
  { text: '✓ Cisco CCNA', delay: 3400 },
  { text: '⏳ HashiCorp Terraform Associate (In Progress)', delay: 3800 },
  { text: '$ echo $MISSION', delay: 4600 },
  { text: '> Connecting systems. Automating workflows. Building in the cloud.', delay: 5200 },
  { text: '$ deployment --status', delay: 6000 },
  { text: '✓ Infrastructure provisioned', delay: 6400 },
  { text: '✓ Security scans passed', delay: 6800 },
  { text: '✓ CI/CD pipeline active', delay: 7200 },
  { text: '✓ Ready for production', delay: 7600 }
];

const Hero: React.FC = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState<string[]>([]);

  useEffect(() => {
    const timers = terminalLines.map((line, index) => {
      return setTimeout(() => {
        setDisplayedText(prev => [...prev, line.text]);
        setCurrentLine(index);
      }, line.delay);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text"
        >
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="btn-close"></span>
                <span className="btn-minimize"></span>
                <span className="btn-maximize"></span>
              </div>
              <div className="terminal-title">justin@justinmemphis:~</div>
            </div>
            <div className="terminal-body">
              {displayedText.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`terminal-line ${line.startsWith('$') ? 'command' : line.startsWith('>') ? 'output' : line.startsWith('✓') ? 'success' : line.startsWith('⏳') ? 'pending' : ''}`}
                >
                  {line}
                </motion.div>
              ))}
              {currentLine < terminalLines.length - 1 && <span className="cursor"></span>}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hero-cta"
        >
          <h1>Justin Carter</h1>
          <p className="hero-subtitle">
            Business Solutions Developer II | Systems Integration, Power BI, HubSpot & Cloud Automation
          </p>
          <div className="hero-location">
            <span>📍 Memphis, TN</span>
            <span className="separator">|</span>
            <span>🚀 Building reliable, secure systems</span>
          </div>
          <div className="hero-buttons">
            <a href="#projects" className="btn">View Projects</a>
            <a href="#contact" className="btn btn-secondary">Get In Touch</a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">2</div>
              <div className="stat-label">Live AWS Projects</div>
            </div>
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">Infrastructure as Code</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">System Reliability</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div className="arrow-down"></div>
      </div>
    </section>
  );
};

export default Hero;
