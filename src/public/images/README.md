# Images Directory

Bu papkaga local development uchun rasmlarni joylashtiring.

## Kerakli Rasmlar

Quyidagi rasmlarni Figma'dan export qilib, shu papkaga joylashtiring:

### 1. **click-logo.png**
- **Tavsif:** Click to'lov tizimi logosi
- **Qaerda ishlatiladi:** Dashboard > Payment modal
- **Recommended size:** 200x60 px (2x: 400x120 px)
- **Format:** PNG (transparency uchun)

### 2. **hero-image.png**
- **Tavsif:** Landing page hero section background image
- **Qaerda ishlatiladi:** Home page hero section
- **Recommended size:** 1920x1080 px yoki yuqori
- **Format:** JPG yoki PNG
- **Note:** Bu yirik background image, sifat muhim

### 3. **feedback-image.png**
- **Tavsif:** Video feedback section image (IELTS expert)
- **Qaerda ishlatiladi:** Feedback section
- **Recommended size:** 800x600 px (2x: 1600x1200 px)
- **Format:** JPG yoki PNG

### 4. **westminster-bigben.png**
- **Tavsif:** Westminster/Big Ben background for pricing cards
- **Qaerda ishlatiladi:** Pricing section card background
- **Recommended size:** 600x800 px (2x: 1200x1600 px)
- **Format:** JPG yoki PNG

### 5. **logo-rect-3.png** (Optional)
- **Tavsif:** Logo component rectangle 3
- **Qaerda ishlatiladi:** Logo imports
- **Format:** PNG

### 6. **logo-rect-4.png** (Optional)
- **Tavsif:** Logo component rectangle 4
- **Qaerda ishlatiladi:** Logo imports
- **Format:** PNG

## Export Qoidalari

### Figma'dan Export

1. Figma'da rasmni tanlang
2. Export settings:
   - **Scale:** 2x (Retina display uchun)
   - **Format:** 
     - PNG - agar transparency kerak bo'lsa (logo, icons)
     - JPG - agar faqat photo bo'lsa (hero, feedback images)
   - **Quality:** 90-100%

3. Export qiling va shu papkaga joylashtiring

### Optimization (Ixtiyoriy)

Rasm hajmini kamaytirish uchun:
- **TinyPNG:** https://tinypng.com/
- **Squoosh:** https://squoosh.app/
- **ImageOptim:** https://imageoptim.com/

**Muhim:** Optimization qilganda quality 80% dan past bo'lmasin!

## Tekshirish

Rasmlar to'g'ri joylashganligini tekshirish:

```bash
ls -lh /public/images/
```

Quyidagi fayllar ko'rinishi kerak:
```
click-logo.png
hero-image.png
feedback-image.png
westminster-bigben.png
README.md
```

## Troubleshooting

### Rasm ko'rinmayapti?

1. **Fayl nomi to'g'rimi?**
   - Kichik harflar bilan yozing
   - Probel o'rniga `-` (dash) ishlating
   - Extension to'g'ri (.png yoki .jpg)

2. **Papka to'g'ri joyda?**
   ```
   /public/images/click-logo.png ✅
   /images/click-logo.png ❌
   /src/images/click-logo.png ❌
   ```

3. **Browser cache**
   - Ctrl+Shift+R (hard refresh)
   - DevTools > Network tab > Disable cache

4. **Permission issues**
   ```bash
   chmod 644 /public/images/*.png
   ```

## Production

Production build qilganda (`npm run build`), `/public` papkadagi barcha fayllar avtomatik `dist/` papkaga ko'chiriladi va to'g'ri serve qilinadi.

Server'da (Figma Make platformasida) esa rasmlar avtomatik `figma:asset` CDN orqali yuklanadi.
