# Production Deployment Guide - Pretest IELTS Platform

## 🚀 Production Checklist

### 1. Environment Setup
```bash
# Copy environment variables
cp .env.example .env

# Update .env with production values
VITE_API_BASE_URL=https://api.pre-test.uz/api/v1
VITE_ENV=production
```

### 2. Build for Production
```bash
# Install dependencies
npm install

# Run production build
npm run build

# Preview production build locally (optional)
npm run preview
```

### 3. Pre-deployment Checks
- ✅ BackendStatus component removed
- ✅ Console logs disabled in production
- ✅ Service Worker enabled
- ✅ Web Vitals monitoring (analytics ready)
- ✅ Mobile optimizations active
- ✅ SEO meta tags configured
- ✅ Viewport meta tag added
- ✅ Resource hints (preconnect, dns-prefetch)

### 4. Performance Optimizations
- ✅ Code splitting (lazy loading for pages)
- ✅ Image lazy loading
- ✅ Throttled scroll handlers
- ✅ Touch event optimizations
- ✅ Reduced motion support
- ✅ Mobile tap target optimization

### 5. Security Checks
- ✅ JWT tokens stored in localStorage
- ✅ API calls use HTTPS
- ✅ CORS configured on backend
- ✅ Content Security Policy headers (configure on server)

## 📦 Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Main bundle
│   ├── index-[hash].css     # Styles
│   └── [component]-[hash].js # Lazy chunks
├── sw.js                     # Service worker
├── manifest.json             # PWA manifest
├── robots.txt
├── sitemap.xml
└── _headers                  # Netlify/Vercel headers
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: Manual Deployment
1. Build: `npm run build`
2. Upload `dist/` folder to your server
3. Configure server (see Server Configuration below)

## ⚙️ Server Configuration

### Nginx
```nginx
server {
    listen 80;
    server_name pre-test.uz www.pre-test.uz;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pre-test.uz www.pre-test.uz;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/pretest/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker (no cache)
    location = /sw.js {
        add_header Cache-Control "no-cache";
        expires 0;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional)
    location /api/ {
        proxy_pass https://api.pre-test.uz/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

## 📊 Performance Targets

### Mobile (Target: 85+)
- FCP: < 1.8s
- LCP: < 2.5s
- TBT: < 200ms
- CLS: < 0.1

### Desktop (Target: 90+)
- FCP: < 1.2s
- LCP: < 2.0s
- TBT: < 150ms
- CLS: < 0.1

## 🧪 Testing

### Before Deployment
```bash
# 1. Build
npm run build

# 2. Preview locally
npm run preview

# 3. Test in browser
# Open http://localhost:4173

# 4. Run Lighthouse
npx lighthouse http://localhost:4173 --view

# 5. Test mobile
# Use Chrome DevTools device emulation
```

### After Deployment
```bash
# Test production site
npx lighthouse https://pre-test.uz --view

# Test mobile performance
npx lighthouse https://pre-test.uz --preset=mobile --view
```

## 🔍 Monitoring

### Web Vitals
- Console logging disabled in production
- Ready for analytics integration (Google Analytics, Vercel Analytics, etc.)

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior

## 🔄 CI/CD (Optional)

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🐛 Troubleshooting

### Issue: Service Worker not updating
**Solution:** Clear cache or bump version in `/public/sw.js`

### Issue: Routes not working (404)
**Solution:** Configure SPA fallback on server (see Server Configuration)

### Issue: API CORS errors
**Solution:** Configure CORS headers on backend API

### Issue: Images not loading
**Solution:** Check image paths and optimize images (WebP/AVIF)

## 📞 Support

**Backend API:** https://api.pre-test.uz/api/v1  
**Documentation:** /PRODUCTION_GUIDE.md  
**Team:** Pretest Development Team

---

**Last Updated:** December 2, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
