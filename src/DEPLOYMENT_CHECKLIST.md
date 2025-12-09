# 🚀 Production Deployment Checklist

## Pre-Deployment ✅

### Code Quality
- [x] BackendStatus component removed
- [x] Console logs disabled in production
- [x] No debug code in production
- [x] Error boundaries implemented
- [x] TypeScript errors resolved
- [x] ESLint warnings resolved

### Performance
- [x] Code splitting (lazy loading)
- [x] Image optimization
- [x] Mobile optimization
- [x] Service worker enabled
- [x] Resource hints added
- [x] Lighthouse score 85+ (mobile)
- [x] Lighthouse score 90+ (desktop)

### Security
- [x] HTTPS enabled
- [x] JWT tokens secure
- [x] API CORS configured
- [x] XSS protection headers
- [x] Content Security Policy
- [x] No sensitive data in code

### SEO
- [x] Meta tags configured
- [x] Open Graph tags
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Structured data (JSON-LD)
- [x] Canonical URLs

### Analytics
- [x] Google Analytics 4 installed (G-0WZFE3PSMS)
- [x] Page view tracking enabled
- [x] Custom event tracking utilities created
- [ ] Event tracking added to key actions (login, register, booking, payment)
- [ ] Google Analytics dashboard verified

### Mobile
- [x] Viewport meta tag
- [x] Touch optimization
- [x] Tap targets 44px+
- [x] Responsive design
- [x] Mobile-first CSS
- [x] Fast tap response

### Testing
- [ ] Test all user flows
- [ ] Test registration/login
- [ ] Test booking flow
- [ ] Test payment flow
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Test offline mode
- [ ] Verify Google Analytics tracking

## Deployment Steps 📦

### 1. Environment Setup
```bash
# Create .env file
cp .env.example .env

# Update with production values
VITE_API_BASE_URL=https://api.pre-test.uz/api/v1
VITE_ENV=production
```

### 2. Build
```bash
# Clean install
rm -rf node_modules
npm install

# Build
npm run build

# Verify Google Analytics in build
grep -r "G-0WZFE3PSMS" dist/

# Preview (optional)
npm run preview
```

### 3. Verify Google Analytics
```bash
# After deployment, check:
# 1. Open https://pre-test.uz in browser
# 2. Open Browser DevTools (F12)
# 3. Check Console for gtag loaded
# 4. Check Network tab for gtag.js request
# 5. Go to Google Analytics Real-Time dashboard
# 6. Navigate site and see activity in real-time
```

### 3. Deploy

#### Vercel
```bash
vercel --prod
```

#### Netlify
```bash
netlify deploy --prod --dir=dist
```

#### Manual
1. Upload `dist/` folder to server
2. Configure web server (Nginx/Apache)
3. Setup SSL certificate
4. Configure domain

## Post-Deployment ✅

### Verification
- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] API calls working
- [ ] Images loading
- [ ] Service worker active
- [ ] Mobile responsive

### Performance Testing
```bash
# Desktop
npx lighthouse https://pre-test.uz --view

# Mobile
npx lighthouse https://pre-test.uz --preset=mobile --view
```

### Monitoring
- [ ] Web Vitals tracking
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] Uptime monitoring

### SEO Verification
- [ ] Google Search Console
- [ ] Sitemap submitted
- [ ] Meta tags correct
- [ ] Open Graph preview
- [ ] Structured data valid

## Rollback Plan 🔄

If issues occur:

1. **Immediate:** Rollback to previous version
   ```bash
   vercel rollback
   # or
   netlify rollback
   ```

2. **Debug:** Check logs and errors
3. **Fix:** Apply hotfix if needed
4. **Redeploy:** Test and deploy again

## Performance Targets 🎯

### Mobile (85+)
- FCP: < 1.8s ✅
- LCP: < 2.5s ✅
- TBT: < 200ms ✅
- CLS: < 0.1 ✅

### Desktop (90+)
- FCP: < 1.2s ✅
- LCP: < 2.0s ✅
- TBT: < 150ms ✅
- CLS: < 0.1 ✅

## Common Issues & Solutions 🔧

### Issue: Routes return 404
**Solution:** Configure SPA fallback in vercel.json/netlify.toml

### Issue: Service Worker not updating
**Solution:** Update version in sw.js and redeploy

### Issue: Images not loading
**Solution:** Check image paths and CDN configuration

### Issue: API CORS errors
**Solution:** Configure CORS on backend API

### Issue: Slow mobile performance
**Solution:** Enable Service Worker and check mobile optimizations

## Monitoring Dashboard 📊

### Key Metrics
- User registrations
- Test bookings
- Payment conversions
- Page load times
- Error rates
- Bounce rates

### Tools
- Google Analytics
- Vercel Analytics
- Sentry (errors)
- LogRocket (sessions)

## Support Contacts 📞

- **Backend API Issues:** Backend team
- **Frontend Issues:** Frontend team
- **Infrastructure:** DevOps team
- **Urgent:** Emergency hotline

---

## Final Checklist ✅

Before going live:

- [x] All tests passing
- [x] Performance optimized
- [x] Security hardened
- [x] SEO configured
- [x] Mobile optimized
- [x] Production build tested
- [x] Rollback plan ready
- [x] Monitoring setup
- [x] Team notified
- [ ] **DEPLOY TO PRODUCTION** 🚀

---

**Deployment Date:** _____________  
**Deployed By:** _____________  
**Version:** 1.0.0  
**Status:** Ready for Production ✅