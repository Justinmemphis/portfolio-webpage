import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2>Get In Touch</h2>
          <p className="section-subtitle">
            Let's discuss DevOps opportunities, cloud infrastructure, or collaboration
          </p>
        </motion.div>

        <div className="contact-content contact-content--centered">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="contact-info"
          >
            <div className="info-card card">
              <h3>Contact Information</h3>
              <div className="info-items">
                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <div className="info-label">Location</div>
                    <div className="info-value">Memphis, TN</div>
                  </div>
                </div>
              </div>
              <p className="contact-note">Reach out to me on LinkedIn or GitHub</p>
            </div>

            <div className="social-links card">
              <h3>Connect With Me</h3>
              <div className="social-grid">
                <a
                  href="https://www.linkedin.com/in/justin-carter-memphis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaLinkedin />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://github.com/Justinmemphis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaGithub />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
