# Deployment Guide — indlish

## VPS Deployment with PM2

### Prerequisites
- Ubuntu 22.04+ VPS
- Node.js 20+ installed
- Nginx installed
- Domain pointed to VPS IP

### Steps

1. **Clone and install:**
```bash
cd /var/www
git clone https://github.com/Int2Root/indlish.git
cd indlish
npm install --production
```

2. **Configure environment:**
```bash
cp .env.example .env
nano .env
# Fill in all environment variables
```

3. **Set up database:**
```bash
npx prisma db push
```

4. **Build and start:**
```bash
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

5. **Nginx reverse proxy:**
```nginx
server {
    listen 80;
    server_name indlish.com www.indlish.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **SSL with Certbot:**
```bash
sudo certbot --nginx -d indlish.com -d www.indlish.com
```

### PM2 Commands
- `pm2 status` — Check status
- `pm2 logs indlish` — View logs
- `pm2 restart indlish` — Restart
- `pm2 reload indlish` — Zero-downtime reload

### Updates
```bash
cd /var/www/indlish
git pull
npm install
npm run build
pm2 reload indlish
```