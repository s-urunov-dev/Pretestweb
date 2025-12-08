# Git Workflow: Figma → Main → Production

Ushbu dokument Figma AI orqali o‘zgarish qilgandan keyin `main` va `production` branchlarini qanday sinxronlashtirish, commitlarni yo‘qotgan holatda nima qilish, va faqat kerakli o‘zgarishlarni serverga yuborish bo‘yicha qo‘llanmadir.

---

## 1. Branch struktura

* **main** – Figma yoki boshqa o‘zgarishlar push qilinadigan branch (to‘liq kod bo‘lmasligi mumkin)
* **production** – serverda ishlaydigan branch
* **temporary branch** (masalan, `figma-ui-changes`) – faqat kerakli commitlarni tanlab production ga merge qilish uchun

---

## 2. Figma → main push qilgandan keyin

1. Localda main branchga o‘ting:

```bash
git checkout main
git pull origin main
```

2. Temporary branch yaratish:

```bash
git checkout -b figma-ui-changes
```

3. Kerakli commitlarni tanlab cherry-pick qilish:

```bash
git cherry-pick <commit-hash>
```

4. GitHub’ga push qilish:

```bash
git push origin figma-ui-changes
```

5. PR ochish: base = production, compare = figma-ui-changes → merge qilish

**Solve:** Agar noto‘g‘ri commit merge qilinsa, productionga revert yoki cherry-pick orqali to‘g‘rilang.

---

## 3. Commit yoki fayl yo‘qotilgan holatda

1. Eski commitni topish:

```bash
git log --oneline
```

2. Faqat kerakli fayllarni tiklash:

* Barcha faylni tiklash:

```bash
git checkout <commit-hash> -- path/to/file
```

* Faqat kerakli qatorda interaktiv tiklash:

```bash
git restore -s <commit-hash> -p path/to/file
```

3. Commit va push qilish:

```bash
git add path/to/file
git commit -m "Restore lost changes from <commit-hash>"
git push origin production
```

**Solve:** Agar branch konfliktda bo‘lsa, merge qilmasdan oldin interaktiv cherry-pick orqali faqat keraklilarini olish.

---

## 4. Production va main branchni sinxronlashtirish

```bash
git checkout main
git pull origin production
```

* Shu bilan main va production branchlar bir xil holatda bo‘ladi

**Solve:** Agar merge conflict bo‘lsa, `git merge` yoki `git cherry-pick` orqali tanlab yeching.

---

## 5. Har qanday holat uchun quick solves

| Muammo                                              | Solve                                                                               |
| --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Figma o‘zgarishlari noto‘g‘ri branchga push qilindi | Temporary branch yaratib cherry-pick bilan keraklilarini olish                      |
| Commit yo‘qolib ketdi                               | `git log` → `git checkout` yoki `git restore -s <commit-hash> -p` bilan tiklash     |
| Fayl o‘chib ketdi                                   | Eski commitdan tiklash, `git add` → `git commit` → push                             |
| Main va production mos emas                         | `git checkout main` → `git pull origin production`                                  |
| Merge conflict                                      | Interaktiv cherry-pick yoki `git merge --no-commit` bilan faqat keraklilarini olish |

---

## 6. Eslatmalar

* Har doim production branchga merge qilmasdan oldin localda test qiling
* Cherry-pick yordamida **faqat kerakli commitlarni** olish tavsiya qilinadi
* Interaktiv restore (`-p`) bilan faqat kerakli qatorlarni tiklash mumkin
* Har doim `git log` orqali commit tarixini tekshiring
* Backup olish, xususan `public` yoki media fayllar uchun, muhim

---

Endi sizda **Figma → main → production workflow** va har qanday commit/branch xatolari uchun yechimlar tayyor.
