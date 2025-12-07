# 🚀 Quick Start - No Images Required!

Rasmlar yo'q bo'lsa ham loyiha ishga tushadi! Automatic Unsplash fallback bilan.

---

## ✅ Local Development (Rasm yuklamasdan)

### 1. Install & Run

```bash
# Dependencies
npm install

# Development server
npm run dev
```

**That's it!** 🎉

Loyiha `http://localhost:5173` da ochiladi va **avtomatik ravishda** Unsplash'dan placeholder rasmlar yuklanadi.

---

## 🖼️ Avtomatik Fallback Mechanism

Loyiha uch bosqichli image loading qiladi:

### **Priority Order:**

1. **Figma CDN** → Figma Make platformasida
2. **Local `/public/images/`** → Agar fayllar mavjud bo'lsa
3. **Unsplash Placeholder** → Agar yuqoridagilar yo'q bo'lsa (automatic)

### **Ishlatilgan Rasmlar:**

| Component | Local Path | Unsplash Fallback |
|-----------|------------|-------------------|
| Hero Section | `/images/hero-image.png` | Education theme |
| Feedback Section | `/images/feedback-image.png` | Professional woman |
| Pricing Cards | `/images/westminster-bigben.png` | Westminster/Big Ben |
| Payment Modal | `/images/click-logo.png` | Payment logo |

---

## 📦 Server Deployment (Rasmlar bilan)

Agar production'da real rasmlar ishlatmoqchi bo'lsangiz:

### **Variant A: Git orqali**

```bash
# 1. Local'da public/images/ yaratish
mkdir -p public/images

# 2. Rasmlarni joylashtirish (export from Figma)
# - hero-image.png
# - feedback-image.png
# - westminster-bigben.png
# - click-logo.png

# 3. Git'ga qo'shish
git add public/images/
git commit -m "Add production images"
git push

# 4. Server'da pull
cd /var/www/pretest/frontend
git pull
npm run build
```

### **Variant B: Direct upload**

```bash
# Local'dan server'ga SCP
scp -r public/images root@server:/var/www/pretest/frontend/build/

# Permissions
ssh root@server "chmod -R 755 /var/www/pretest/frontend/build/images"
```

### **Variant C: Deploy script ishlatish**

```bash
# Server'da
cd /var/www/pretest/frontend
chmod +x deploy.sh
./deploy.sh
```

---

## 🧪 Test

### **Local'da test:**

```bash
npm run dev

# Browser'da:
# - http://localhost:5173
# - Hero section rasm ko'rinishi kerak
# - Console'da [ImageResolver] log'lar
```

### **Server'da test:**

```bash
# SSH orqali
cd /var/www/pretest/frontend
chmod +x check-server-images.sh
./check-server-images.sh

# Browser'da:
curl -I https://pre-test.uz/images/hero-image.png
```

---

## 🎯 Summary

### **Local Development:**
- ✅ `npm install && npm run dev` - done!
- ✅ Rasmlar avtomatik Unsplash'dan yuklanadi
- ✅ Console log'larda image loading ko'rinadi

### **Production:**
- ✅ Option 1: Unsplash placeholder (hech narsa qilmaslik)
- ✅ Option 2: Real images (git push yoki scp)
- ✅ Option 3: Deploy script (automatic)

---

## 📚 Qo'shimcha Guides

- **Local setup:** [LOCAL_SETUP.md](./LOCAL_SETUP.md)
- **Server images fix:** [SERVER_IMAGE_FIX.md](./SERVER_IMAGE_FIX.md)
- **Full deployment:** [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md)

---

**Made with ❤️ for Pretest Platform**
