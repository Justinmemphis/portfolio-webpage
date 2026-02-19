import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, this will just create a mailto link
    const mailtoLink = `mailto:jcarter82@gmail.com?subject=Portfolio Contact from ${formData.name}&body=${formData.message}%0D%0A%0D%0AFrom: ${formData.name} (${formData.email})`;
    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

        <div className="contact-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="contact-form-container"
          >
            <form onSubmit={handleSubmit} className="contact-form card">
              <h3>Send a Message</h3>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Your message..."
                />
              </div>
              <button type="submit" className="btn btn-submit">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
