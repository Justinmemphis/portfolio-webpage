import React, { JSX } from 'react';
import { motion } from 'framer-motion';
import {
  FaAws,
  FaGitAlt,
  FaPython,
  FaLinux,
  FaNode
} from 'react-icons/fa';
import {
  SiTerraform,
  SiNginx,
  SiJavascript,
  SiReact,
  SiGithubactions
} from 'react-icons/si';
import './Skills.css';

interface Skill {
  name: string;
  icon: JSX.Element;
  level: number; // 1-5
  category: string;
}

const Skills: React.FC = () => {
  const skills: Skill[] = [
    // Cloud & Infrastructure
    { name: 'AWS', icon: <FaAws />, level: 4, category: 'Cloud & Infrastructure' },
    { name: 'Terraform', icon: <SiTerraform />, level: 4, category: 'Cloud & Infrastructure' },
    { name: 'Linux', icon: <FaLinux />, level: 4, category: 'Cloud & Infrastructure' },
    { name: 'Nginx', icon: <SiNginx />, level: 4, category: 'Cloud & Infrastructure' },

    // DevOps & CI/CD
    { name: 'GitHub Actions', icon: <SiGithubactions />, level: 4, category: 'DevOps & CI/CD' },
    { name: 'Git', icon: <FaGitAlt />, level: 5, category: 'DevOps & CI/CD' },

    // Development
    { name: 'JavaScript', icon: <SiJavascript />, level: 5, category: 'Development' },
    { name: 'Node.js', icon: <FaNode />, level: 4, category: 'Development' },
    { name: 'React', icon: <SiReact />, level: 4, category: 'Development' },
    { name: 'Python', icon: <FaPython />, level: 3, category: 'Development' },
  ];

  const certifications = [
    {
      name: 'AWS Solutions Architect Associate',
      issuer: 'Amazon Web Services',
      date: '2025',
      status: 'active'
    },
    {
      name: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2024',
      status: 'active'
    },
    {
      name: 'CompTIA Security+',
      issuer: 'CompTIA',
      date: '2025',
      status: 'active'
    },
    {
      name: 'Cisco CCNA',
      issuer: 'Cisco',
      date: '2025',
      status: 'active'
    },
    {
      name: 'HashiCorp Terraform Associate',
      issuer: 'HashiCorp',
      date: 'In Progress',
      status: 'in-progress'
    }
  ];

  const categories = Array.from(new Set(skills.map(s => s.category)));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2>Technical Skills</h2>
          <p className="section-subtitle">
            Cloud infrastructure, automation, and development expertise
          </p>
        </motion.div>

        <div className="skills-content">
          {categories.map((category, catIndex) => (
            <div key={catIndex} className="skill-category">
              <h3 className="category-title">{category}</h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="skills-grid"
              >
                {skills
                  .filter(skill => skill.category === category)
                  .map((skill, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="skill-item"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="skill-icon">{skill.icon}</div>
                      <div className="skill-info">
                        <div className="skill-name">{skill.name}</div>
                        <div className="skill-level">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`level-dot ${i < skill.level ? 'active' : ''}`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="certifications-section"
        >
          <h3 className="certs-title">Certifications & Training</h3>
          <div className="certs-timeline">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`cert-item ${cert.status === 'in-progress' ? 'in-progress' : ''}`}
              >
                <div className="cert-indicator">
                  {cert.status === 'in-progress' ? '⏳' : '✓'}
                </div>
                <div className="cert-content">
                  <div className="cert-name">{cert.name}</div>
                  <div className="cert-details">
                    <span className="cert-issuer">{cert.issuer}</span>
                    <span className="cert-date">{cert.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
