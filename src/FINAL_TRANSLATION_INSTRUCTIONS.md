# FINAL Translation Instructions

## ✅ TAYYOR:
1. **Translation files** - `/locales/uz.ts`, `/locales/en.ts`, `/locales/ru.ts` (100% to'liq)
2. **Navigation** - Landing va Dashboard (language switcher bilan)
3. **Hero** - To'liq tarjima qilingan
4. **About** - To'liq tarjima qilingan
5. **DashboardLayout** - Language switcher qo'shilgan

## 📝 QO'SHIMCHA QILISH KERAK (Har bir fayl uchun):

### Pattern:
```typescript
// 1. Import qo'shing:
import { useLanguage } from "../contexts/LanguageContext";

// 2. Component ichida:
const { t } = useLanguage();

// 3. Textlarni almashtiring:
"Some Text" → {t.section.key}
```

---

## LANDING PAGE COMPONENTS:

### 1. `/components/Products.tsx`
```typescript
import { useLanguage } from "../contexts/LanguageContext";
const { t } = useLanguage();

// Line ~96-97 o'zgartiring:
<h2 className="mb-4 text-[#182966]">{t.products.choosePackage}</h2>
<p className="max-w-2xl mx-auto text-[#182966]/70">{t.common.loading}</p>

// Line ~107-108:
<h2 className="mb-4 text-[#182966]">{t.products.choosePackage}</h2>
<p className="max-w-2xl mx-auto text-[#182966]/70 mb-12">{t.products.selectPackageDesc}</p>

// Line ~122: (Most Popular badge)
<span>{t.products.mostPopular}</span>

// Line ~159: (Book Session button)
<Button>{t.products.bookSession}</Button>

// Line ~155: (seats available)
{session.available_seats} {t.common.of} {session.total_seats} {t.products.seatsAvailable}
```

### 2. `/components/TestSessions.tsx`
```typescript
import { useLanguage } from "../contexts/LanguageContext";
const { t } = useLanguage();

// Title va subtitle:
<h2>{t.testSessions.availableSessions}</h2>
<p>{t.testSessions.availableDesc}</p>

// Features:
<p>{t.testSessions.feature1}</p>
<p>{t.testSessions.feature2}</p>
<p>{t.testSessions.feature3}</p>
<p>{t.testSessions.feature4}</p>

// "Full Test" text:
{t.testSessions.fullTest}

// "Book This Session" button:
{t.products.bookSession}

// Seats available:
{seats} {t.common.of} {total} {t.products.seatsAvailable}
```

### 3. `/components/Feedback.tsx` (Landing page component)
```typescript
import { useLanguage } from "../contexts/LanguageContext";
const { t } = useLanguage();

// Title:
<h2>{t.feedbackLanding.title}</h2>
<p>{t.feedbackLanding.subtitle}</p>

// Steps:
<h3>{t.feedbackLanding.step1Title}</h3>
<p>{t.feedbackLanding.step1Desc}</p>

<h3>{t.feedbackLanding.step2Title}</h3>
<p>{t.feedbackLanding.step2Desc}</p>

<h3>{t.feedbackLanding.step3Title}</h3>
<p>{t.feedbackLanding.step3Desc}</p>

// Former Examiners:
<p>{t.feedbackLanding.formerExaminers}</p>
<p>{t.feedbackLanding.formerExaminersDesc}</p>

// Average Improvement:
<p>{t.feedbackLanding.avgImprovement}</p>
<p>{t.feedbackLanding.bandsImprovement}</p>

// Button:
<Button>{t.feedbackLanding.getYourFeedback}</Button>
```

### 4. `/components/Testimonials.tsx`
```typescript
import { useLanguage } from "../contexts/LanguageContext";
const { t } = useLanguage();

<h2>{t.testimonials.studentSuccess}</h2>
<p>{t.testimonials.watchStories}</p>
```

### 5. `/components/Partners.tsx`
```typescript
import { useLanguage } from "../contexts/LanguageContext";
const { t } = useLanguage();

<h2>{t.partners.title}</h2>
<p>{t.partners.subtitle}</p>
```

### 6. `/components/CTASection.tsx`
```typescript
import { useLanguage } from "../contexts/LanguageContext";
const { t } = useLanguage();

// Main title:
<h2>{t.cta.readyToAchieve}</h2>
<p>{t.cta.joinThousands}</p>

// Buttons:
<Button>{t.cta.button}</Button>
<Button>{t.cta.scheduleCall}</Button>

// Stats:
<p>{t.cta.avgScoreIncrease}</p>
<p>{t.cta.bands}</p>
<p>{t.cta.studentSatisfaction}</p>

// Why Choose:
<h3>{t.cta.whyChoose}</h3>
<li>{t.cta.reason1}</li>
<li>{t.cta.reason2}</li>
<li>{t.cta.reason3}</li>
<li>{t.cta.reason4}</li>
<li>{t.cta.reason5}</li>
<li>{t.cta.reason6}</li>

// Special offer:
<p>{t.cta.specialOffer}</p>
```

### 7. `/components/Footer.tsx`
```typescript
import { useLanguage } from "../contexts/LanguageContext";
const { t } = useLanguage();

// Description:
<p>{t.footer.description}</p>

// Sections:
<h3>{t.footer.product}</h3>
<h3>{t.footer.company}</h3>
<h3>{t.footer.resources}</h3>
<h3>{t.footer.legal}</h3>

// Links (use nav links):
<a>{t.nav.products}</a>
<a>{t.footer.videoFeedback}</a>
<a>{t.footer.pricing}</a>

<a>{t.footer.aboutUs}</a>
<a>{t.footer.ourTeam}</a>
<a>{t.footer.careers}</a>
<a>{t.footer.contact}</a>

<a>{t.footer.ieltsGuide}</a>
<a>{t.footer.blog}</a>
<a>{t.footer.faqs}</a>
<a>{t.footer.successStories}</a>

<a>{t.footer.privacy}</a>
<a>{t.footer.terms}</a>
<a>{t.footer.cookiePolicy}</a>
<a>{t.footer.refundPolicy}</a>

// Rights:
<p>{t.footer.rights}</p>
```

---

## DASHBOARD PAGES:

### 8. `/pages/DashboardPage.tsx`
```typescript
import { useLanguage } from "../contexts/LanguageContext";
const { t } = useLanguage();

// Welcome message (line ~350):
<h1>{t.dashboard.welcomeBack}, {user?.first_name} {user?.last_name}!</h1>
<p>{t.dashboard.progressSubtitle}</p>

// Stats cards (line ~360-385):
<p>{t.dashboard.totalTests}</p>
<p>{t.dashboard.averageScore}</p>
<p>{t.dashboard.upcomingTests}</p>
<p>{t.dashboard.bestScore}</p>

// Pending Bookings section (line ~395):
<h2>{t.dashboard.pendingBookings}</h2>
<span>{t.dashboard.paymentPending}</span>
<Button>{t.dashboard.completePayment}</Button>
<Button>{t.dashboard.showLocation}</Button>
<p>{t.dashboard.onlinePayment}: {t.dashboard.completeWithin} ... {t.dashboard.expires}: ...</p>

// Upcoming Tests (line ~480):
<h2>{t.dashboard.upcomingTests}</h2>
<Button>{t.dashboard.bookNewTest}</Button>
<Button>{t.dashboard.viewDetails}</Button>
<Button>{t.dashboard.reschedule}</Button>
<Button>{t.dashboard.showLocation}</Button>

// Previous Results (line ~550):
<h2>{t.dashboard.previousResults}</h2>
<p>{t.dashboard.reading}</p>
<p>{t.dashboard.listening}</p>
<p>{t.dashboard.writing}</p>
<p>{t.dashboard.speaking}</p>
<p>{t.dashboard.overall}</p>

// Booking modal (line ~210-340):
<h2>{t.dashboard.selectPackage}</h2>
<Button>{t.dashboard.selectDate}</Button>
<Button>{t.dashboard.confirmBooking}</Button>
<h3>{t.dashboard.paymentMethod}</h3>
<Button>{t.dashboard.clickPayment}</Button>
<Button>{t.dashboard.cashPayment}</Button>
```

### 9. `/pages/ProfilePage.tsx`
```typescript
import { useLanguage } from "../contexts/LanguageContext";
const { t } = useLanguage();

// Title:
<h1>{t.profile.profileSettings}</h1>
<p>{t.profile.manageAccount}</p>

// Sections:
<h2>{t.profile.personalInfo}</h2>
<Button>{t.profile.editProfile}</Button>

// Form fields (use auth translations):
<Label>{t.auth.firstName}</Label>
<Label>{t.auth.lastName}</Label>
<Label>{t.auth.email}</Label>
<Label>{t.auth.phoneNumber}</Label>
<p>{t.profile.phoneSecurityNote}</p>

// Password section:
<h2>{t.profile.password}</h2>
<Button>{t.profile.changePassword}</Button>
<p>{t.profile.securityNote}</p>

// Buttons:
<Button>{t.profile.save}</Button>
<Button>{t.profile.cancel}</Button>

// Payment history table:
<th>{t.profile.date}</th>
<th>{t.profile.amount}</th>
<th>{t.profile.status}</th>

// Status badges:
{t.profile.paid}
{t.profile.pending}
{t.profile.failed}
```

### 10. `/pages/FeedbackPage.tsx`
```typescript
import { useLanguage } from "../contexts/LanguageContext";
const { t } = useLanguage();

// Title:
<h1>{t.feedback.videoFeedback}</h1>
<p>{t.feedback.submitWriting}</p>

// Request Feedback button:
<Button>{t.feedback.requestFeedback}</Button>

// Stats:
<p>{t.feedback.totalSubmissions}</p>
<p>{t.feedback.completedFeedback}</p>
<p>{t.feedback.averageScore}</p>

// Submission card:
<p>{t.feedback.submitted}: {date}</p>
<p>{t.feedback.examiner}: {name}</p>
<p>{t.feedback.bandScore}</p>
<Button>{t.feedback.watchVideo}</Button>

// How it works:
<h2>{t.feedback.howItWorks}</h2>

<h3>{t.feedback.writingFeedback}</h3>
<li>{t.feedback.writingStep1}</li>
<li>{t.feedback.writingStep2}</li>
<li>{t.feedback.writingStep3}</li>

<h3>{t.feedback.speakingFeedback}</h3>
<li>{t.feedback.speakingStep1}</li>
<li>{t.feedback.speakingStep2}</li>
<li>{t.feedback.speakingStep3}</li>
```

---

## QUICK CHECKLIST:
- [ ] Products.tsx
- [ ] TestSessions.tsx
- [ ] Feedback.tsx (landing component)
- [ ] Testimonials.tsx
- [ ] Partners.tsx
- [ ] CTASection.tsx
- [ ] Footer.tsx
- [ ] DashboardPage.tsx
- [ ] ProfilePage.tsx
- [ ] FeedbackPage.tsx

Har bir komponentga:
1. `import { useLanguage } from "../contexts/LanguageContext";` qo'shing
2. `const { t } = useLanguage();` hook qo'shing
3. Hardcoded textlarni `{t.section.key}` bilan almashtiring

Barcha translation keylar `/locales/*.ts` fayllarida tayyor! 🎉
