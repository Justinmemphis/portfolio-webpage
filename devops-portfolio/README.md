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

## 🌐 Deployment to AWS EC2

### Prerequisites

- AWS Account
- EC2 instance (Ubuntu 20.04 or later)
- Domain name (optional but recommended)

### Step 1: Build the Application

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Step 2: Prepare EC2 Instance

SSH into your EC2 instance:

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

Install Nginx:

```bash
sudo apt update
sudo apt install nginx -y
```

### Step 3: Upload Build Files

From your local machine, copy the build folder to EC2:

```bash
scp -i your-key.pem -r build/* ubuntu@your-ec2-ip:/tmp/portfolio-build/
```

On EC2, move files to Nginx directory:

```bash
sudo mkdir -p /var/www/portfolio
sudo mv /tmp/portfolio-build/* /var/www/portfolio/
sudo chown -R www-data:www-data /var/www/portfolio
```

### Step 4: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name justinmemphis.com www.justinmemphis.com;

    root /var/www/portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL/TLS with Let's Encrypt (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d justinmemphis.com -d www.justinmemphis.com
```

### Step 6: Security Hardening

Configure UFW firewall:

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

Install fail2ban:

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 🔄 CI/CD with GitHub Actions (Coming Soon)

Create `.github/workflows/deploy.yml` for automated deployments.

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
