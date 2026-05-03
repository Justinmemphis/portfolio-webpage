# DevOps Portfolio - Justin Carter

A modern, cyberpunk-themed portfolio website built with React and TypeScript, showcasing DevOps expertise and cloud infrastructure skills.

## 🚀 Features

- **Terminal-Animated Hero Section** - Eye-catching terminal simulation showing deployment status
- **DevOps Project Showcase** - Highlighting infrastructure automation and cloud deployments
- **Interactive Skills Matrix** - Visual representation of technical capabilities
- **Certifications Timeline** - Displaying AWS, Security+, CCNA, and upcoming Terraform certification
- **Responsive Design** - Optimized for all devices
- **Modern Tech Stack** - React, TypeScript, Framer Motion animations

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Styling**: Custom CSS with CSS Variables
- **Build Tool**: Create React App

## 📦 Installation & Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The development server runs on `http://localhost:3000`

## Deployment

Deployment is fully automated via GitHub Actions. Push to `main` and the pipeline handles everything.

### What happens on push to `main`

1. React app is built (`npm run build`)
2. Build output is synced to S3
3. AWS Systems Manager (SSM) Run Command pulls the new build from S3 to `/var/www/portfolio/` on the EC2 instance

No SSH key required. No port 22 open. Authentication uses OIDC federation — GitHub requests a short-lived AWS token at runtime; no credentials are stored in the repo.

The workflow is at `.github/workflows/pr-checks.yml` in the repository root.

### Infrastructure

Infrastructure is managed with Terraform in `terraform/`. The EC2 instance user data bootstraps Nginx, Certbot (TLS), fail2ban, and UFW automatically on first launch — no manual server configuration needed.

## 📁 Project Structure

```
devops-portfolio/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navigation.tsx/css
│   │   ├── Hero.tsx/css
│   │   ├── Projects.tsx/css
│   │   ├── Skills.tsx/css
│   │   ├── Contact.tsx/css
│   │   └── Footer.tsx/css
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
└── README.md
```

## 🎨 Customization

Update personal information in the component files:
- Hero.tsx - name, title, certifications
- Projects.tsx - project details and links
- Skills.tsx - technical skills and certifications
- Contact.tsx - email, phone, social links

## 📧 Contact

Justin Carter
- Email: jcarter82@gmail.com
- LinkedIn: [justin-carter-memphis](https://www.linkedin.com/in/justin-carter-memphis/)
- GitHub: [Justinmemphis](https://github.com/Justinmemphis)

---

Built with ❤️ in Memphis, TN
