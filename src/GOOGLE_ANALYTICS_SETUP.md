# Google Analytics 4 Setup ✅

## Nima qilindi?

Google Analytics 4 (GA4) muvaffaqiyatli loyihaga qo'shildi va barcha sahifalar avtomatik kuzatiladi.

## O'rnatilgan Componentlar

### 1. **index.html** - Google Tag Script
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-0WZFE3PSMS"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  gtag('config', 'G-0WZFE3PSMS', {
    send_page_view: true
  });
</script>
```

### 2. **App.tsx** - Page View Tracking
Har bir route o'zgarishi avtomatik Google Analytics'ga yuboriladi:
```typescript
function GoogleAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-0WZFE3PSMS', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}
```

### 3. **utils/analytics.ts** - Custom Event Tracking
Maxsus eventlarni kuzatish uchun utility funksiyalar:

```typescript
// Login tracking (allaqachon LoginPage.tsx da qo'shilgan)
trackLogin('phone_number');

// Registration tracking
trackSignUp('phone_number');

// Test booking
trackBookTest('Daily Practice Test', 29);

// Payment
trackPurchase('TXN123456', 'Pretest Pro', 89);

// Video feedback submission
trackFeedbackSubmission('Task 2');

// Test result view
trackViewTestResult('RES000001', 7.5);
```

## Qo'shimcha Event Tracking Qo'shish

### RegisterPage.tsx
```typescript
import { trackSignUp } from "../utils/analytics";

// Register muvaffaqiyatli bo'lgandan keyin:
trackSignUp('phone_number');
```

### DashboardPage.tsx (Test booking)
```typescript
import { trackBookTest, trackBeginCheckout } from "../utils/analytics";

// Test booking boshlanganda:
trackBeginCheckout('Daily Practice Test', 29);

// Test booking muvaffaqiyatli bo'lganda:
trackBookTest('Daily Practice Test', 29);
```

### Payment integration (Click to'lov)
```typescript
import { trackPurchase } from "../utils/analytics";

// To'lov muvaffaqiyatli bo'lgandan keyin:
trackPurchase(transactionId, 'Pretest Pro', 89);
```

### FeedbackPage.tsx
```typescript
import { trackFeedbackSubmission } from "../utils/analytics";

// Feedback yuborilgandan keyin:
trackFeedbackSubmission(essayType);
```

### TestResultDetailPage.tsx
```typescript
import { trackViewTestResult } from "../utils/analytics";

// Test natijasi ko'rilganda:
trackViewTestResult(resultId, overallScore);
```

## Google Analytics Dashboard

### Ko'rish uchun:
1. **URL**: https://analytics.google.com/
2. **Property ID**: `G-0WZFE3PSMS`
3. **Domain**: `pre-test.uz`

### Ma'lumotlar paydo bo'lishi:
- **Real-time data**: 1-2 daqiqada
- **To'liq hisobotlar**: 24-48 soat

## Qanday Ma'lumotlar Kuzatiladi?

### Avtomatik Kuzatish:
- ✅ Page views (barcha sahifalar)
- ✅ User sessions
- ✅ Traffic sources (Google, direct, social, etc.)
- ✅ Device categories (desktop, mobile, tablet)
- ✅ Geographic location (country, city)
- ✅ User demographics
- ✅ Bounce rate
- ✅ Session duration

### Maxsus Eventlar (qo'shimcha sozlash kerak):
- 🔄 User login (`trackLogin`)
- 🔄 User registration (`trackSignUp`)
- 🔄 Test booking (`trackBookTest`)
- 🔄 Payment (`trackPurchase`)
- 🔄 Feedback submission (`trackFeedbackSubmission`)
- 🔄 Test result views (`trackViewTestResult`)
- 🔄 Button clicks (`trackButtonClick`)
- 🔄 Form submissions (`trackFormSubmit`)
- 🔄 Errors (`trackError`)

## Deploy Qilish

### 1. Build
```bash
npm run build
```

### 2. Test (Local)
```bash
npm run preview
```

### 3. Deploy
```bash
# Netlify, Vercel, yoki boshqa hosting
git push origin main
```

### 4. Tekshirish
1. Saytni ochish: https://pre-test.uz
2. Browser console ochish: `F12`
3. Console'da tekshirish:
```javascript
// Google Analytics yuklangan mi?
console.log(window.gtag);
console.log(window.dataLayer);
```

4. Google Analytics Real-Time dashboardini ochish
5. Saytda turli sahifalarga o'tish
6. Real-Time dashboardda faoliyat ko'rinishi kerak

## Muammolarni Hal Qilish

### Agar Google Analytics ishlamasa:

**1. Tag yuklangan mi?**
```javascript
// Browser console'da:
console.log(window.gtag);
// Function qaytarishi kerak
```

**2. AdBlocker yoqilganmi?**
- AdBlocker ni o'chirib ko'ring
- Incognito/Private mode'da sinab ko'ring

**3. index.html to'g'ri build qilinganmi?**
```bash
npm run build
# dist/index.html faylini tekshiring
# Google tag script <head> da bo'lishi kerak
```

**4. CORS yoki CSP muammosi?**
- Browser console'da error'lar bormi tekshiring
- Network tab'da gtag.js yuklanganmi tekshiring

**5. Domain to'g'ri sozlanganmi?**
- Google Analytics dashoboridga kiring
- Admin → Data Streams → Web
- Domain `pre-test.uz` bo'lishi kerak

## Keyingi Qadamlar

1. ✅ Google Analytics o'rnatilgan
2. ⏳ Barcha sahifalarga event tracking qo'shish
3. ⏳ E-commerce tracking (to'lovlar)
4. ⏳ Conversion goals sozlash
5. ⏳ Custom reports yaratish

## Foydali Linklar

- [Google Analytics Dashboard](https://analytics.google.com/)
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)

---

**Tag ID**: `G-0WZFE3PSMS`
**Status**: ✅ Active
**Last Updated**: 2025-01-09
