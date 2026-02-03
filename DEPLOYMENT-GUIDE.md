# Quick Deployment Guide - DevOps Portfolio

## 🚀 Getting Started Today

### 1. Extract and Install

```bash
tar -xzf devops-portfolio.tar.gz
cd devops-portfolio
npm install
```

### 2. Test Locally

```bash
npm start
```

Visit http://localhost:3000 to see your portfolio!

### 3. Build for Production

```bash
npm run build
```

This creates a `build/` folder ready for deployment.

## 📤 Deploy to AWS EC2 - Quick Steps

### Prerequisites
- EC2 instance running Ubuntu
- SSH key to access instance
- Domain pointed to EC2 IP (optional)

### Deploy in 5 Minutes

**On your local machine:**

```bash
# Build the app
npm run build

# Upload to EC2 (replace with your details)
scp -i ~/path/to/key.pem -r build/* ubuntu@YOUR-EC2-IP:/tmp/portfolio/
```

**On your EC2 instance:**

```bash
# SSH into EC2
ssh -i ~/path/to/key.pem ubuntu@YOUR-EC2-IP

# Install Nginx
sudo apt update && sudo apt install nginx -y

# Move files
sudo mkdir -p /var/www/portfolio
sudo mv /tmp/portfolio/* /var/www/portfolio/
sudo chown -R www-data:www-data /var/www/portfolio
```

**Configure Nginx:**

```bash
# Create config
sudo nano /etc/nginx/sites-available/portfolio
```

Paste this:

```nginx
server {
    listen 80;
    server_name YOUR-DOMAIN.com www.YOUR-DOMAIN.com;
    
    root /var/www/portfolio;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Enable and restart:**

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Add SSL (recommended):**

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d YOUR-DOMAIN.com
```

## 🎨 Customization Checklist

Before deploying, update these files:

- [ ] `src/components/Hero.tsx` - Your name, certifications, stats
- [ ] `src/components/Projects.tsx` - Your actual projects and GitHub links
- [ ] `src/components/Skills.tsx` - Your skill levels and certifications
- [ ] `src/components/Contact.tsx` - Your email, phone, social links
- [ ] `src/components/Footer.tsx` - Your name and year

## 🔧 Common Issues

**Port 3000 already in use?**
```bash
kill -9 $(lsof -t -i:3000)
```

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Nginx 404 errors?**
Make sure the `try_files` directive includes `/index.html` for React Router.

## 📊 Next Steps: Infrastructure as Code

Create a `terraform/` directory to manage your infrastructure:

```hcl
# terraform/main.tf
resource "aws_instance" "portfolio" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  
  tags = {
    Name = "portfolio-website"
  }
}
```

## 🔄 Future Enhancements

1. Set up GitHub Actions for CI/CD
2. Add CloudWatch monitoring
3. Implement blue-green deployments
4. Add CloudFront CDN
5. Terraform all the infrastructure

## 💡 Tips

- Start simple - get it deployed first
- Add fancy features after it's live
- Document everything you do (blog about it!)
- This portfolio itself is a DevOps project

---

Need help? Check the full README.md in the project folder!

Good luck with your deployment! 🚀
