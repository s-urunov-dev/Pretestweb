#!/bin/bash
# Bu script barcha komponentlarni tarjima qilish uchun yo'riqnoma

# Men hozir barcha komponentlarni tarjima qilaman.
# Quyida eng muhim o'zgarishlar ro'yxati:

echo "TRANSLATION COMPLETE CHECKLIST"
echo "================================"
echo ""
echo "✅ DONE:"
echo "  - Navigation (with language switcher)"
echo "  - Hero"
echo "  - About"
echo "  - Products (started - need to add t.products usage)"
echo ""
echo "⏳ TODO - BATCH UPDATE:"
echo "  - TestSessions"
echo "  - Testimonials"
echo "  - Partners"
echo "  - CTASection"
echo "  - Footer"
echo "  - LoginPage"
echo "  - RegisterPage"
echo "  - DashboardLayout (add language switcher)"
echo "  - DashboardPage"
echo "  - ProfilePage"
echo "  - FeedbackPage"
echo ""
echo "PATTERN:"
echo "  1. Import: import { useLanguage } from '../contexts/LanguageContext'"
echo "  2. Hook: const { t } = useLanguage()"
echo "  3. Replace text: 'Some Text' → {t.section.key}"
