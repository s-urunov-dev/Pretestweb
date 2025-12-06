# Translation Implementation Guide

Quyidagi komponentlarning translation pattern'ini qo'llaymiz:

## Landing Page Components

### ✅ Tugallangan:
- Navigation
- Hero
- About

### 🔄 Qilish kerak:

#### 1. Products Component (`/components/Products.tsx`)
```typescript
import { useLanguage } from "../contexts/LanguageContext";

// Component ichida:
const { t } = useLanguage();

// O'zgartirish kerak:
- "Our Products" → {t.products.title}
- "Packages tailored for every need" → {t.products.subtitle}
- "Daily Practice Test" → {t.products.dailyPractice}
- "Full Simulation Test" → {t.products.fullSimulation}
- "$29" → {t.products.price29}
- "$89" → {t.products.price89}
- "per test" → {t.products.perTest}
- Features → t.products.daily1, daily2, daily3, daily4 va full1, full2, full3, full4
- "Select" button → {t.products.selectButton}
```

#### 2. TestSessions Component (`/components/TestSessions.tsx`)
```typescript
- "Test Sessions" → {t.testSessions.title}
- "Experience real IELTS in a professional environment" → {t.testSessions.subtitle}
- Features → t.testSessions.feature1, feature2, feature3, feature4
```

#### 3. Testimonials Component (`/components/Testimonials.tsx`)
```typescript
- "What Our Students Say" → {t.testimonials.title}
- "Thousands of students achieved their goals with Pretest" → {t.testimonials.subtitle}
```

#### 4. Partners Component (`/components/Partners.tsx`)
```typescript
- "Our Partners" → {t.partners.title}
- "Partnering with leading educational institutions" → {t.partners.subtitle}
```

#### 5. CTASection Component (`/components/CTASection.tsx`)
```typescript
- "Start Your IELTS Journey Today" → {t.cta.title}
- "Join thousands of successful students" → {t.cta.subtitle}
- Button text → {t.cta.button}
```

#### 6. Footer Component (`/components/Footer.tsx`)
```typescript
- Description → {t.footer.description}
- "Quick Links" → {t.footer.quickLinks}
- "Legal" → {t.footer.legal}
- "Privacy Policy" → {t.footer.privacy}
- "Terms of Service" → {t.footer.terms}
- "Contact" → {t.footer.contact}
- "All rights reserved" → {t.footer.rights}
- Navigation items → t.nav.about, t.nav.products, ...
```

## Auth Pages

#### 7. LoginPage (`/pages/LoginPage.tsx`)
```typescript
- "Sign in to your account" → {t.auth.loginTitle}
- "Enter your credentials to continue" → {t.auth.loginSubtitle}
- "Email" → {t.auth.email}
- "Password" → {t.auth.password}
- "Remember me" → {t.auth.rememberMe}
- "Forgot password?" → {t.auth.forgotPassword}
- "Sign In" button → {t.auth.loginButton}
- "Don't have an account?" → {t.auth.noAccount}
- "Sign up" → {t.auth.signUp}
- "Signing in..." → {t.auth.loggingIn}
```

#### 8. RegisterPage (`/pages/RegisterPage.tsx`)
```typescript
- "Create a new account" → {t.auth.registerTitle}
- "Start your IELTS journey today" → {t.auth.registerSubtitle}
- All form fields: t.auth.firstName, lastName, email, password, confirmPassword, etc.
- "Sign Up" button → {t.auth.registerButton}
- "Already have an account?" → {t.auth.haveAccount}
- "Sign in" → {t.auth.signIn}
```

## Dashboard Pages

#### 9. DashboardLayout (`/pages/DashboardLayout.tsx`)
```typescript
- Sidebar items: t.nav.dashboard, t.nav.profile, t.nav.feedback
- Language switcher qo'shish (Navigation componentdagi kabi)
```

#### 10. DashboardPage (`/pages/DashboardPage.tsx`)
```typescript
- "Welcome" → {t.dashboard.welcome}
- "Book a Test" → {t.dashboard.bookTest}
- "My Tests" → {t.dashboard.myTests}
- "Results" → {t.dashboard.results}
- va h.k. (barcha dashboard textlari)
```

## Pattern (Har bir component uchun):

1. Import qo'shish:
```typescript
import { useLanguage } from "../contexts/LanguageContext";
```

2. Hook ishlatish:
```typescript
const { t } = useLanguage();
```

3. Static textlarni almashtirish:
```typescript
// Old:
<h2>Our Products</h2>

// New:
<h2>{t.products.title}</h2>
```

## Eslatma:
- Backend'dan kelayotgan dinamik ma'lumotlarni (testimonials, products, team members) tarjima qilmaymiz
- Faqat frontendda yozilgan static textlarni tarjima qilamiz
