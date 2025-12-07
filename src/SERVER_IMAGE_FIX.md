# 🖼️ Server Image Fix Guide

Local'da rasmlar ishlayapti lekin server'da ochilmayapti? Bu guide yechim beradi!

---

## 🔍 Muammoni Tushunish

**Muammo:**
- ✅ Local'da: `http://localhost:5173/images/hero-image.png` - ishlaydi
- ❌ Server'da: `https://pre-test.uz/images/hero-image.png` - 404 xato

**Sabab:**
1. `npm run build` qilganda `/public/images/` fayllar `build/images/` ga ko'chirilmagan
2. Yoki Nginx static file'larni to'g'ri serve qilmayapti
3. Yoki file permissions noto'g'ri

---

## ✅ Yechim - 4 qadam

### **Qadam 1: Server'ga kirish va tekshirish**

```bash
# SSH orqali server'ga kiring
ssh root@your-server-ip

# Script'ga execute permission bering
cd /var/www/pretest/frontend
chmod +x check-server-images.sh

# Diagnostika script'ni ishga tushiring
./check-server-images.sh
```

**Natija:**
- Agar images/ papka `build/` da bo'lmasa → Qadam 2
- Agar images/ papka bor lekin 404 → Qadam 3
- Agar permissions muammosi → Qadam 4

---

### **Qadam 2: Rasmlarni build'ga qo'shish**

**Variant A: Avtomatik (Deployment script ishlatish)**

```bash
cd /var/www/pretest/frontend

# Deploy script'ni ishlatish
chmod +x deploy.sh
./deploy.sh
```

**Variant B: Manual (Qo'lda qo'shish)**

```bash
cd /var/www/pretest/frontend

# Agar public/images/ mavjud bo'lsa
if [ -d "public/images" ]; then
    # Build'da images papka yaratish
    mkdir -p build/images
    
    # Rasmlarni ko'chirish
    cp -r public/images/* build/images/
    
    echo "✅ Images copied to build/"
else
    echo "❌ public/images/ not found!"
    echo "Solution: Local'dan public/images/ papkani server'ga upload qiling"
fi

# Permissions to'g'rilash
chown -R www-data:www-data build/images
chmod -R 755 build/images

# Tekshirish
ls -lh build/images/
```

**Variant C: Local'dan server'ga upload**

```bash
# Local machine'da (terminal)
cd /path/to/your/pretest-project

# SCP orqali rasmlarni yuborish
scp -r public/images root@your-server:/var/www/pretest/frontend/build/

# Yoki rsync ishlatish (tezroq)
rsync -avz public/images/ root@your-server:/var/www/pretest/frontend/build/images/
```

---

### **Qadam 3: Nginx Config'ni yangilash**

```bash
# Yangi config'ni yuklab oling yoki ko'chiring
cd /var/www/pretest/frontend

# Config file'ni edit qiling
nano /etc/nginx/sites-available/pretest-web.conf
```

**Quyidagi location block'ni qo'shing:**

```nginx
# Images - rasmlar uchun maxsus location
location /images/ {
    alias /var/www/pretest/frontend/build/images/;
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
    
    # Agar fayl topilmasa, 404 qaytarish
    try_files $uri =404;
}
```

**Yoki tayyor config'ni ishlatish:**

```bash
# Backup qilish
cp /etc/nginx/sites-available/pretest-web.conf /etc/nginx/sites-available/pretest-web.conf.backup

# Yangi config'ni copy qilish (agar yuklab olgan bo'lsangiz)
cp nginx-config-fix.conf /etc/nginx/sites-available/pretest-web.conf

# Test qilish
nginx -t

# Agar test muvaffaqiyatli bo'lsa, reload
systemctl reload nginx
```

---

### **Qadam 4: Permissions to'g'rilash**

```bash
cd /var/www/pretest/frontend

# Owner to'g'rilash
chown -R www-data:www-data build/

# Permissions to'g'rilash
chmod -R 755 build/

# Images folder uchun maxsus
chmod -R 755 build/images/
chown -R www-data:www-data build/images/

# Tekshirish
ls -la build/images/
```

**Expected output:**

```
drwxr-xr-x  2 www-data www-data 4096 Dec  7 12:00 .
drwxr-xr-x  5 www-data www-data 4096 Dec  7 12:00 ..
-rw-r--r--  1 www-data www-data  512K Dec  7 12:00 hero-image.png
-rw-r--r--  1 www-data www-data   45K Dec  7 12:00 click-logo.png
```

---

## 🧪 Verification (Tekshirish)

### **1. Server'da fayl mavjudligini tekshirish**

```bash
ls -lh /var/www/pretest/frontend/build/images/

# Expected:
# hero-image.png
# click-logo.png
# feedback-image.png
# westminster-bigben.png
```

### **2. HTTP request test**

```bash
# Terminal'da
curl -I https://pre-test.uz/images/hero-image.png

# Expected output:
# HTTP/2 200
# content-type: image/png
# content-length: ...
```

### **3. Browser'da test**

1. Browser'ni oching
2. Go to: `https://pre-test.uz/images/hero-image.png`
3. Rasm ko'rinishi kerak ✅

4. Main page'ga boring: `https://pre-test.uz`
5. Hard refresh: `Ctrl+Shift+R`
6. Hero section'da rasm ko'rinishi kerak ✅

---

## 🚨 Agar hali ham ishlamasa

### **Debug Mode**

```bash
# Nginx error log'ni tekshirish
tail -f /var/log/nginx/error.log

# Access log'ni tekshirish
tail -f /var/log/nginx/access.log | grep images

# Boshqa terminal'da browser'dan test qiling
# Error log'da nima ko'rinayotganini kuzating
```

### **Common Errors:**

**1. 404 Not Found**
```
Sabab: Fayl yo'q yoki path noto'g'ri
Yechim: Qadam 2'ni takrorlang
```

**2. 403 Forbidden**
```
Sabab: Permission muammosi
Yechim: Qadam 4'ni takrorlang
```

**3. 502 Bad Gateway**
```
Sabab: Nginx config xato
Yechim: nginx -t qilib test qiling, Qadam 3'ni takrorlang
```

---

## 📋 Quick Commands Cheat Sheet

```bash
# Diagnostika
./check-server-images.sh

# Full deployment
./deploy.sh

# Rasmlarni qo'lda ko'chirish
cp -r public/images/* build/images/
chown -R www-data:www-data build/images
chmod -R 755 build/images

# Nginx reload
nginx -t && systemctl reload nginx

# Test URL
curl -I https://pre-test.uz/images/hero-image.png

# Logs
tail -f /var/log/nginx/error.log
```

---

## ✅ Success Criteria

Agar quyidagilar ishlasa - hammasi joyida:

- ✅ `https://pre-test.uz/images/hero-image.png` - 200 OK
- ✅ Main page hero section'da rasm ko'rinadi
- ✅ Feedback section'da rasm ko'rinadi
- ✅ Dashboard payment modal'da Click logo ko'rinadi
- ✅ Browser console'da 404 xatolar yo'q

---

## 💡 Future Deployments

Keyingi deployment'larda avtomatik ishlashi uchun:

1. **Git'ga images qo'shing:**
   ```bash
   git add public/images/
   git commit -m "Add production images"
   git push
   ```

2. **Deployment script ishlatng:**
   ```bash
   ./deploy.sh
   ```

Deployment script avtomatik ravishda:
- Git pull qiladi
- Build qiladi
- Images'ni copy qiladi
- Permissions to'g'rilaydi
- Nginx reload qiladi

---

## 📞 Support

Agar muammo hal bo'lmasa, quyidagilarni yuboring:

1. `./check-server-images.sh` output
2. `ls -la /var/www/pretest/frontend/build/images/` output
3. `curl -I https://pre-test.uz/images/hero-image.png` output
4. Browser console screenshot

---

**Made with ❤️ for Pretest Platform**
