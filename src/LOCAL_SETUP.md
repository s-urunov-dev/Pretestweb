# Local Development Setup Guide

Ushbu loyihani local kompyuterda ishlatish uchun quyidagi qadamlarni bajaring.

> **Server setup uchun:** [SERVER_IMAGE_FIX.md](./SERVER_IMAGE_FIX.md) ga qarang

## 📦 Rasmlar Setup

Loyiha Figma Make platformasida `figma:asset` scheme orqali rasmlarni yuklaydi. Local development uchun rasmlarni qo'lda joylashtirish kerak.

### 1. Public Images Papkani Yarating

Loyihaning root papkasida quyidagi struktura yarating:

```
/public
  /images
    click-logo.png
    hero-image.png
    feedback-image.png
    westminster-bigben.png
```

### 2. Rasmlarni Yuklab Oling

Quyidagi rasmlarni Figma'dan export qilib, tegishli nomlarda `/public/images/` papkasiga joylashtiring:

| Fayl nomi | Tavsif | Original Hash |
|-----------|--------|---------------|
| `click-logo.png` | Click to'lov tizimi logosi | `2a03e1d9f42a8a77d98665ab2740b6507b408cd2.png` |
| `hero-image.png` | Landing page hero section rasmi | `6303e8dcc4b52dc83bedb7876578abe30165231a.png` |
| `feedback-image.png` | Video feedback section rasmi | `7a857004c4db27e89045589b1490b9e5d93c9bac.png` |
| `westminster-bigben.png` | Pricing section background | `3600c3807830360d61d240921531dcdb4a5b4085.png` |

### 3. Rasm Sifati

Rasmlar **yuqori sifatda** export qilinishi kerak:
- **Format:** PNG (transparency uchun) yoki JPG (photo uchun)
- **Resolution:** 2x yoki 3x (Retina display uchun)
- **Optimization:** TinyPNG yoki similar tool bilan optimize qiling
- **Recommended size:**
  - Click logo: ~100-200 KB
  - Hero image: ~500KB - 1MB (large background)
  - Feedback image: ~300-500 KB
  - Westminster: ~400-600 KB

### 4. Yangi Rasmlar Qo'shish

Agar yangi figma:asset rasm qo'shmoqchi bo'lsangiz:

1. **Rasm hash'ini aniqlang:**
   ```typescript
   // Code'da:
   import myImage from 'figma:asset/ABC123XYZ.png';
   ```

2. **`/utils/imageResolver.ts` ga qo'shing:**
   ```typescript
   const assetMap: Record<string, string> = {
     'ABC123XYZ.png': '/images/my-new-image.png',
   };
   ```

3. **Rasmni `/public/images/my-new-image.png` ga joylashtiring**

## 🔧 Ishlash Mexanizmi

Loyihada adaptive image loading system bor:

- **Server'da (Figma Make):** `figma:asset` scheme orqali CDN'dan rasmlar yuklanadi
- **Local'da:** `/public/images/` papkadan rasmlar yuklanadi

### Component'lar:

**`/utils/imageResolver.ts`** - Image path resolver utility
- `figma:asset` hash'larni local path'ga map qiladi
- Automatic fallback mechanism

**`/components/AdaptiveImage.tsx`** - Smart image component
- `<img>` tag replacement
- Automatic source resolution

### Foydalanish:

```tsx
import { AdaptiveImage } from './components/AdaptiveImage';
import myImage from 'figma:asset/HASH.png';

// Component'da:
<AdaptiveImage 
  figmaAsset={myImage} 
  fallback="/images/my-image.png"
  alt="Description"
  className="..."
/>
```

## ✅ Local'da Test Qilish

```bash
# Dependencies o'rnatish
npm install

# Development server
npm run dev

# Browser'da ochish
# http://localhost:5173
```

Agar rasmlar ko'rinmasa:
1. `/public/images/` papka to'g'ri joylashganligini tekshiring
2. Rasm nomlarini `/utils/imageResolver.ts` dagi map bilan solishtiring
3. Browser console'da error bor-yo'qligini tekshiring
4. Browser cache'ni tozalang (Ctrl+Shift+R)

## 🚀 Production Build

```bash
npm run build
npm run preview
```

Production build avtomatik ravishda to'g'ri rasm path'larni ishlatadi.

## 📝 Muhim Eslatmalar

- ⚠️ `/public/images/` papka `.gitignore` ga qo'shilmagan - rasmlarni commit qilishingiz mumkin
- 🎨 Rasm sifati maksimal saqlanishi uchun PNG format (lossless) ishlatilgan
- 🔄 Agar Figma'da dizayn yangilansa, rasmlarni qayta export qiling
- 💾 Rasmlar production CDN'da host qilinishi kerak (yoki `/public` orqali serve)

## 🆘 Troubleshooting

**Rasm ko'rinmayapti:**
- Browser DevTools > Network tab'da 404 error bor-yo'qligini tekshiring
- `/public/images/` papkada rasm bor-yo'qligini tekshiring
- Rasm nomi to'g'ri yozilganligini (`/utils/imageResolver.ts`) tekshiring

**Rasm xiralashib ketgan:**
- Yuqori resolution (2x yoki 3x) export qiling
- PNG format ishlatilganligini tekshiring
- Image compression tool'ni qayta sozlang (quality 80-90%)

**Server'da ishlamayapti:**
- Figma Make serverida `figma:asset` automatic ishlamasi kerak
- Local fallback faqat development uchun
- Production'da CDN path'ni to'g'ri sozlang