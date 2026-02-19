import React from 'react';
import { FaLinkedin, FaGithub, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Justin Carter</h4>
          <p>DevOps Engineer building secure, scalable cloud infrastructure</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
            <a href="/justin-carter-resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <div className="footer-social">
            <a href="https://www.linkedin.com/in/justin-carter-memphis/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://github.com/Justinmemphis" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-tech">
          <span className="tech-badge">Built with React + TypeScript</span>
          <span className="tech-badge">Deployed on AWS EC2</span>
          <span className="tech-badge">Infrastructure as Code</span>
        </div>
        <p className="copyright">
          © {currentYear} Justin Carter. Made with <FaHeart className="heart-icon" /> in Memphis, TN
        </p>
      </div>
    </footer>
  );
};

export default Footer;
