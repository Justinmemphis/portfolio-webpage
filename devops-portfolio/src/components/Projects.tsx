import React, { JSX } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaCode } from 'react-icons/fa';
import { SiTerraform, SiAwslambda } from 'react-icons/si';
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
      title: 'Memphis BBQ Ranking Platform — Serverless AWS, Terraform & CI/CD Project',
      description: 'Crowdsourced restaurant ranking app built on a fully serverless AWS stack: Lambda + API Gateway, DynamoDB, Cognito, and CloudFront. Multi-environment Terraform infrastructure deployed through a security-hardened CI/CD pipeline with no static credentials.',
      tags: ['Lambda', 'API Gateway', 'DynamoDB', 'Cognito', 'CloudFront', 'Terraform', 'Python', 'GitHub Actions', 'OIDC', 'Checkov', 'S3', 'SSM'],
      icon: <SiAwslambda />,
      status: 'live',
      github: 'https://github.com/justinmemphis/memphis-bbq-ranking-platform',
      demo: 'https://d10tdoprvg920w.cloudfront.net',
      highlights: [
        'Serverless backend: Lambda + API Gateway (HTTP), Python, DynamoDB with Bayesian ranking algorithm',
        'Auth: Cognito User Pools with JWT; ratings require login, leaderboard is publicly viewable',
        'Multi-environment Terraform (dev/prod) with OIDC GitHub Actions — zero static AWS credentials',
        'Security pipeline: Checkov IaC scanning, Ruff + pip-audit, 69 pytest tests gate every deploy',
        'Append-only audit log, per-user rating enforcement via composite keys, CloudWatch alarms'
      ]
    },
    {
      title: 'Production-Style AWS EC2 Environment — Terraform, OIDC CI/CD & Linux Hardening',
      description: 'Production-style AWS environment provisioned entirely with Infrastructure as Code: VPC networking, a single EC2 managed by Auto Scaling for self-healing recovery, least-privilege IAM, secretless CI/CD via GitHub Actions (OIDC), CloudWatch observability, and Linux hardening.',
      tags: ['Terraform', 'AWS', 'VPC', 'Auto Scaling', 'GitHub Actions', 'OIDC', 'SSM', 'CloudWatch', 'Route 53', 'Nginx', 'SSL/TLS'],
      icon: <SiTerraform />,
      status: 'live',
      github: 'https://github.com/Justinmemphis/claude-portfolio-webpage',
      demo: 'https://justinmemphis.com',
      highlights: [
        'Modular Terraform: VPC, compute, DNS, monitoring — each a reusable module',
        'CI/CD: GitHub Actions with OIDC auth; auto-deploys on merge via S3 artifacts + SSM Run Command (no SSH)',
        'CloudWatch alarms + SNS alerting (CPU, disk, status checks, ASG health)',
        'Server hardening: unattended-upgrades, SSH lockdown, fail2ban, UFW',
        'Remote state with S3 backend + DynamoDB locking'
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
          <h2>Cloud & Automation Projects</h2>
          <p className="section-subtitle">
            Hands-on projects exploring AWS, Terraform, CI/CD, and security-minded automation
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
                  {project.highlights.slice(0, 5).map((highlight, idx) => (
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
          <a href="https://github.com/Justinmemphis" className="btn" target="_blank" rel="noopener noreferrer">
            <FaGithub /> View GitHub Profile
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
