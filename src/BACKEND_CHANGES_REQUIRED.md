# BACKEND O'ZGARISHLARI - PRETEST PLATFORM

Frontendda qilingan logikalarni backend'ga ko'chirish uchun quyidagi o'zgarishlar zarur.

---

## 1. BOOKING MODEL O'ZGARISHLARI

### 1.1. Yangi fieldlar qo'shish (models.py):

```python
from django.db import models
from django.utils import timezone
from datetime import timedelta

class Booking(models.Model):
    # Mavjud fieldlar...
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session = models.ForeignKey(TestSession, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=10, choices=[('click', 'Click'), ('cash', 'Cash')])
    payment_status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('paid', 'Paid'), ('cancelled', 'Cancelled')])
    created_at = models.DateTimeField(auto_now_add=True)
    
    # ✅ YANGI FIELDLAR:
    has_result = models.BooleanField(default=False)  # Test result mavjudmi?
    expires_at = models.DateTimeField(null=True, blank=True)  # Pending booking expiration time
    
    def save(self, *args, **kwargs):
        # Agar pending bo'lsa va expires_at yo'q bo'lsa, 24 soatdan keyin expire qilish
        if self.payment_status == 'pending' and not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        """Pending booking 24 soat ichida to'lanmagan bo'lsa True qaytaradi"""
        if self.payment_status == 'pending' and self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @property
    def hours_left(self):
        """Pending booking uchun qolgan soatlar"""
        if self.payment_status == 'pending' and self.expires_at:
            delta = self.expires_at - timezone.now()
            if delta.total_seconds() > 0:
                return int(delta.total_seconds() // 3600)
        return 0
    
    @property
    def minutes_left(self):
        """Pending booking uchun qolgan daqiqalar (soatdan keyin)"""
        if self.payment_status == 'pending' and self.expires_at:
            delta = self.expires_at - timezone.now()
            if delta.total_seconds() > 0:
                total_minutes = int(delta.total_seconds() // 60)
                return total_minutes % 60
        return 0
```

### 1.2. Migration yaratish:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 2. BOOKING SERIALIZER O'ZGARISHLARI

### 2.1. serializers.py:

```python
from rest_framework import serializers

class BookingSerializer(serializers.ModelSerializer):
    # Mavjud nested serializers...
    session = TestSessionSerializer(read_only=True)
    
    # ✅ YANGI FIELDLAR:
    has_result = serializers.BooleanField(read_only=True)
    expires_at = serializers.DateTimeField(read_only=True)
    hours_left = serializers.IntegerField(read_only=True, source='hours_left')
    minutes_left = serializers.IntegerField(read_only=True, source='minutes_left')
    is_expired = serializers.BooleanField(read_only=True, source='is_expired')
    
    class Meta:
        model = Booking
        fields = [
            'id', 'session', 'payment_method', 'payment_status', 
            'created_at', 'user', 
            'has_result', 'expires_at', 'hours_left', 'minutes_left', 'is_expired'  # ✅ YANGI
        ]
```

---

## 3. BOOKING API ENDPOINTS O'ZGARISHLARI

### 3.1. views.py - BookingListView:

```python
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime

class BookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Booking.objects.filter(user=user).select_related(
            'session', 'session__product'
        ).order_by('-created_at')
        
        # ✅ FILTER BY TYPE
        booking_type = self.request.query_params.get('type', None)
        
        if booking_type == 'future':
            # Future bookings: session sanasi kelajakda
            queryset = queryset.filter(session__session_date__gte=timezone.now().date())
            
            # ✅ Auto-cancel expired pending bookings
            self._cancel_expired_bookings(queryset)
            
            # Faqat active bookings (pending yoki paid)
            queryset = queryset.exclude(payment_status='cancelled')
            
        elif booking_type == 'past':
            # Past bookings: session sanasi o'tmishda
            queryset = queryset.filter(session__session_date__lt=timezone.now().date())
            
            # Faqat paid bookings
            queryset = queryset.filter(payment_status='paid')
        
        # ✅ FILTER BY PAYMENT STATUS
        payment_status = self.request.query_params.get('status', None)
        if payment_status in ['pending', 'paid', 'cancelled']:
            queryset = queryset.filter(payment_status=payment_status)
        
        return queryset
    
    def _cancel_expired_bookings(self, queryset):
        """24 soat o'tgan pending bookinglarni avtomatik cancel qilish"""
        expired_bookings = queryset.filter(
            payment_status='pending',
            expires_at__lte=timezone.now()
        )
        
        if expired_bookings.exists():
            # Slot'larni qaytarish
            for booking in expired_bookings:
                session = booking.session
                session.available_slots += 1
                session.save()
            
            # Status'ni o'zgartirish
            expired_bookings.update(payment_status='cancelled')
```

---

## 4. DASHBOARD STATS ENDPOINT (TO'LIQ IMPLEMENT)

### 4.1. views.py - DashboardStatsView:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Max, Count, Q
from django.utils import timezone

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # ✅ 1. Total Tests (faqat result bor bo'lganlar)
        total_tests = TestResult.objects.filter(booking__user=user).count()
        
        # ✅ 2. Average Score (barcha overall scores'ning o'rtachasi)
        average_score = TestResult.objects.filter(
            booking__user=user,
            overall__isnull=False
        ).aggregate(avg=Avg('overall'))['avg'] or 0.0
        
        # ✅ 3. Best Score (eng yaxshi overall score)
        best_score = TestResult.objects.filter(
            booking__user=user,
            overall__isnull=False
        ).aggregate(max=Max('overall'))['max'] or 0.0
        
        # ✅ 4. Upcoming Tests (kelajakdagi paid bookings)
        upcoming_tests = Booking.objects.filter(
            user=user,
            payment_status='paid',
            session__session_date__gte=timezone.now().date()
        ).count()
        
        return Response({
            'total_tests': total_tests,
            'average_score': round(average_score, 1),
            'best_score': round(best_score, 1),
            'upcoming_tests': upcoming_tests
        })
```

### 4.2. urls.py:

```python
from django.urls import path

urlpatterns = [
    # ...
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
```

---

## 5. TEST RESULT UPDATE SIGNAL (has_result field)

### 5.1. signals.py:

```python
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

@receiver(post_save, sender=TestResult)
def update_booking_has_result_on_create(sender, instance, created, **kwargs):
    """Test result yaratilganda booking'ning has_result fieldini true qilish"""
    if created and instance.booking:
        booking = instance.booking
        booking.has_result = True
        booking.save(update_fields=['has_result'])

@receiver(post_delete, sender=TestResult)
def update_booking_has_result_on_delete(sender, instance, **kwargs):
    """Test result o'chirilganda booking'ning has_result fieldini false qilish"""
    if instance.booking:
        booking = instance.booking
        # Boshqa result bor yoki yo'qligini tekshirish
        has_other_results = TestResult.objects.filter(booking=booking).exists()
        booking.has_result = has_other_results
        booking.save(update_fields=['has_result'])
```

### 5.2. apps.py:

```python
from django.apps import AppConfig

class YourAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'your_app_name'
    
    def ready(self):
        import your_app_name.signals  # ✅ Signal'larni import qilish
```

---

## 6. FEEDBACK STATISTICS ENDPOINT

### 6.1. views.py - FeedbackStatisticsView:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count, Q

class FeedbackStatisticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # User'ning barcha feedback requestlari
        feedback_requests = FeedbackRequest.objects.filter(user=user)
        
        # ✅ 1. Total Submissions
        total_submissions = feedback_requests.count()
        
        # ✅ 2. Completed Feedback (is_completed=True)
        completed_feedback = feedback_requests.filter(is_completed=True).count()
        
        # ✅ 3. Average Score (score != null bo'lganlarning o'rtachasi)
        average_score = feedback_requests.filter(
            score__isnull=False
        ).aggregate(avg=Avg('score'))['avg'] or 0.0
        
        return Response({
            'total_submissions': total_submissions,
            'completed_feedback': completed_feedback,
            'average_score': f"{average_score:.1f}"
        })
```

### 6.2. urls.py:

```python
urlpatterns = [
    # ...
    path('feedback/statistics/', FeedbackStatisticsView.as_view(), name='feedback-statistics'),
]
```

---

## 7. BACKGROUND TASK (OPTIONAL - Celery)

### 7.1. tasks.py (Celery task):

```python
from celery import shared_task
from django.utils import timezone
from .models import Booking

@shared_task
def cancel_expired_bookings():
    """Har 1 soatda expired pending bookinglarni cancel qilish"""
    
    expired_bookings = Booking.objects.filter(
        payment_status='pending',
        expires_at__lte=timezone.now()
    )
    
    cancelled_count = 0
    
    for booking in expired_bookings:
        # Slot'ni qaytarish
        session = booking.session
        session.available_slots += 1
        session.save()
        
        # Cancel qilish
        booking.payment_status = 'cancelled'
        booking.save()
        
        cancelled_count += 1
    
    return f"Cancelled {cancelled_count} expired bookings"
```

### 7.2. celery.py (Celery config):

```python
from celery import Celery
from celery.schedules import crontab

app = Celery('pretest')
app.config_from_object('django.conf:settings', namespace='CELERY')

# ✅ PERIODIC TASK: Har soatda expired bookinglarni cancel qilish
app.conf.beat_schedule = {
    'cancel-expired-bookings': {
        'task': 'your_app.tasks.cancel_expired_bookings',
        'schedule': crontab(minute=0),  # Har soat boshida
    },
}

app.autodiscover_tasks()
```

---

## 8. SORTING - Default ordering qo'shish

### 8.1. models.py:

```python
class AboutCard(models.Model):
    # ...
    
    class Meta:
        ordering = ['order']  # ✅ Default sorting by order

class TestResult(models.Model):
    # ...
    
    class Meta:
        ordering = ['-test_date', '-created_at']  # ✅ Default: newest first
```

---

## 9. API RESPONSE EXAMPLES

### 9.1. GET /bookings/?type=future

```json
[
  {
    "id": 31,
    "payment_status": "pending",
    "payment_method": "cash",
    "expires_at": "2025-11-29T06:07:33.678247Z",
    "hours_left": 12,
    "minutes_left": 30,
    "is_expired": false,
    "has_result": false,
    "session": {
      "id": 11,
      "product": {...},
      "session_date": "2025-11-28",
      "session_time": "13:01:00"
    }
  }
]
```

### 9.2. GET /dashboard/stats/

```json
{
  "total_tests": 15,
  "average_score": 7.2,
  "best_score": 8.5,
  "upcoming_tests": 3
}
```

### 9.3. GET /feedback/statistics/

```json
{
  "total_submissions": 8,
  "completed_feedback": 5,
  "average_score": "7.3"
}
```

---

## 10. MIGRATION KETMA-KETLIGI

```bash
# 1. Model o'zgarishlarini qo'shish
python manage.py makemigrations

# 2. Migrate qilish
python manage.py migrate

# 3. Mavjud bookinglar uchun expires_at set qilish (optional)
python manage.py shell

# Shell'da:
from your_app.models import Booking
from django.utils import timezone
from datetime import timedelta

pending_bookings = Booking.objects.filter(payment_status='pending', expires_at__isnull=True)
for booking in pending_bookings:
    booking.expires_at = booking.created_at + timedelta(hours=24)
    booking.save()

# 4. Mavjud results uchun has_result set qilish
from your_app.models import Booking, TestResult

bookings_with_results = TestResult.objects.values_list('booking_id', flat=True).distinct()
Booking.objects.filter(id__in=bookings_with_results).update(has_result=True)
```

---

## 11. TESTING

### 11.1. Test qilish kerak bo'lgan narsalar:

✅ Pending booking 24 soatdan keyin avtomatik cancel bo'lishi  
✅ `has_result` field to'g'ri update bo'lishi  
✅ Dashboard stats to'g'ri hisoblanishi  
✅ Expired bookinglar list'da ko'rinmasligi  
✅ Slot'lar to'g'ri qaytarilishi  
✅ Feedback statistics to'g'ri hisoblanishi  

---

## 12. XULOSA

### CRITICAL (Darhol qilish kerak):
1. ✅ `has_result` va `expires_at` fieldlarini qo'shish
2. ✅ Booking API'da auto-cancel logic
3. ✅ Dashboard stats endpoint'ni to'liq implement qilish
4. ✅ Signal'larni sozlash

### IMPORTANT:
5. ✅ Feedback statistics endpoint
6. ✅ Default ordering qo'shish

### OPTIONAL:
7. ⚪ Celery background task (agar Celery mavjud bo'lsa)

---

**End of File**
