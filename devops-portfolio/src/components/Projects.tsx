import React, { JSX } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaCode } from 'react-icons/fa';
import { SiTerraform } from 'react-icons/si';
import './Projects.css';

interface Project {
  title: string;
  description: string;
  tags: string[];
  icon: JSX.Element;
  status: 'live' | 'in-progress' | 'completed';
  github?: string;
  demo?: string;
  highlights: string[];
}

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      title: 'This Portfolio - Infrastructure as Code',
      description: 'Complete AWS deployment pipeline built with Terraform, featuring automated CI/CD, security hardening, and monitoring.',
      tags: ['Terraform', 'AWS EC2', 'GitHub Actions', 'Nginx', 'SSL/TLS'],
      icon: <SiTerraform />,
      status: 'live',
      github: '#',
      demo: 'https://justinmemphis.com',
      highlights: [
        'Terraform modules for reproducible infrastructure',
        'Automated deployment pipeline with GitHub Actions',
        'Security hardening (fail2ban, UFW, security groups)',
        'SSL/TLS with Let\'s Encrypt auto-renewal',
        'CloudWatch monitoring and alerting'
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      live: { text: '● LIVE', class: 'status-live' },
      'in-progress': { text: '⏳ IN PROGRESS', class: 'status-progress' },
      completed: { text: '✓ COMPLETED', class: 'status-completed' }
    };
    return badges[status as keyof typeof badges];
  };

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2>DevOps Projects</h2>
          <p className="section-subtitle">
            Infrastructure automation, cloud deployments, and security implementations
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="projects-grid"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="project-card card"
            >
              <div className="project-header">
                <div className="project-icon">{project.icon}</div>
                <span className={`status-badge ${getStatusBadge(project.status).class}`}>
                  {getStatusBadge(project.status).text}
                </span>
              </div>

              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>

              <div className="project-highlights">
                <strong>Key Features:</strong>
                <ul>
                  {project.highlights.slice(0, 3).map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              </div>

              <div className="project-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>

              <div className="project-links">
                {project.github && (
                  <a href={project.github} className="project-link">
                    <FaGithub /> View Code
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo} className="project-link">
                    <FaCode /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="projects-footer"
        >
          <p>More projects coming soon as I continue my DevOps journey</p>
          <a href="https://github.com/Justinmemphis" className="btn" target="_blank" rel="noopener noreferrer">
            <FaGithub /> View GitHub Profile
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
