# Pretest - IELTS Mock Test Platform 🎓

Complete IELTS mock test platform built with React, TypeScript, and Tailwind CSS. Practice Reading, Listening, Writing, and Speaking with personalized video feedback from experienced IELTS examiners.

## 🚀 Features

### For Test Takers
- ✅ **Full Simulation Tests** - Complete IELTS experience ($89)
- ✅ **Daily Practice Tests** - Quick skill improvement ($29)
- ✅ **Video Feedback** - Personalized feedback from IELTS experts
- ✅ **Progress Tracking** - Monitor your improvement
- ✅ **Test Sessions** - Book invigilated test sessions

### Platform Features
- ✅ **JWT Authentication** - Secure login with phone verification
- ✅ **Payment Integration** - Click payment gateway (Uzbekistan)
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Performance Optimized** - 85+ Lighthouse score
- ✅ **SEO Ready** - Meta tags, sitemap, structured data
- ✅ **PWA Support** - Service worker, offline support

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)
- **Forms:** React Hook Form
- **Charts:** Recharts
- **API:** Axios
- **Build:** Vite

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/your-username/pretest-platform.git
cd pretest-platform

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Setup images for local development
# See LOCAL_SETUP.md for detailed instructions
# Add images to /public/images/ directory

# Start development server
npm run dev
```

### 🖼️ Local Image Setup

This project uses Figma assets that need to be manually added for local development:

1. Create `/public/images/` directory (if not exists)
2. Export and add these images from Figma:
   - `click-logo.png` - Click payment logo
   - `hero-image.png` - Landing hero background
   - `feedback-image.png` - Feedback section image
   - `westminster-bigben.png` - Pricing background

**See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for detailed instructions.**

> **Note:** Images work automatically on Figma Make platform via CDN. Local setup is only needed for development outside Figma Make.

## 🌐 Environment Variables

```bash
# .env
VITE_API_BASE_URL=https://api.pre-test.uz/api/v1
VITE_ENV=development
```

## 🏗️ Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 📁 Project Structure

```
pretest-platform/
├── public/
│   ├── images/            # Local development images
│   │   └── README.md     # Image setup guide
│   ├── sw.js              # Service worker
│   ├── manifest.json      # PWA manifest
│   ├── robots.txt         # SEO
│   └── sitemap.xml        # SEO
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Hero.tsx
│   │   ├── Products.tsx
│   │   ├── AdaptiveImage.tsx  # Smart image loader
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── ...
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── services/         # API services
│   ├── utils/            # Utilities
│   │   └── imageResolver.ts  # Image path resolver
│   ├── locales/          # i18n translations (uz, en, ru)
│   ├── styles/           # Global styles
│   └── App.tsx           # Main app
├── .env.example
├── LOCAL_SETUP.md        # Local development guide
├── vercel.json           # Vercel config
├── netlify.toml          # Netlify config
└── PRODUCTION_GUIDE.md   # Deployment guide
```

## 🎨 Components

### Landing Page
- Navigation (sticky header)
- Hero section with CTA
- Products showcase
- Test sessions calendar
- Video feedback section
- About & testimonials
- Partners section
- Footer

### Dashboard
- Profile management
- Test booking system
- Payment history
- Video feedback viewer
- Test results

## 🔐 Authentication Flow

1. User registers with passport details
2. Phone verification with OTP
3. JWT token stored in localStorage
4. Protected routes check authentication
5. Auto-redirect on auth state change

## 💳 Payment Flow

1. User selects product/test session
2. Booking creation (POST /bookings)
3. Payment creation (POST /payments)
4. Click payment gateway redirect
5. Payment confirmation webhook

## 📱 Mobile Optimization

- Touch event optimization
- Tap target size (44px minimum)
- Viewport meta tag
- Smooth scrolling
- Fast tap response
- Mobile-first CSS

## ⚡ Performance

### Metrics (Target)
- **Mobile:** 85+ Lighthouse score
- **Desktop:** 90+ Lighthouse score
- **FCP:** < 1.8s
- **LCP:** < 2.5s
- **CLS:** < 0.1

### Optimizations
- Code splitting (lazy loading)
- Image lazy loading
- Resource hints (preconnect)
- Service worker caching
- Throttled event handlers
- Reduced motion support

## 🔍 SEO

- Dynamic meta tags
- Open Graph tags
- Structured data (JSON-LD)
- Sitemap.xml
- Robots.txt
- Canonical URLs

## 🧪 Testing

```bash
# Lighthouse (local)
npm run build
npm run preview
npx lighthouse http://localhost:4173 --view

# Lighthouse (production)
npx lighthouse https://pre-test.uz --view

# Mobile performance
npx lighthouse https://pre-test.uz --preset=mobile --view
```

## 📝 API Endpoints

**Base URL:** `https://api.pre-test.uz/api/v1`

### Public
- `GET /test-packages` - Get test packages
- `GET /test-sessions` - Get test sessions
- `POST /register` - Register user
- `POST /login` - Login user
- `POST /verify-otp` - Verify OTP

### Protected
- `GET /user/bookings` - Get user bookings
- `POST /bookings` - Create booking
- `POST /payments` - Create payment
- `GET /user/feedbacks` - Get feedbacks
- `PATCH /user/profile` - Update profile

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

**Pretest Development Team**  
Uzbekistan's leading IELTS preparation platform

## 📞 Contact

- **Website:** https://pre-test.uz
- **API:** https://api.pre-test.uz
- **Support:** support@pre-test.uz

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] AI-powered feedback
- [ ] Speaking practice with AI
- [ ] Community forum
- [ ] Study materials library
- [ ] Progress analytics dashboard

---

**Made with ❤️ in Uzbekistan**