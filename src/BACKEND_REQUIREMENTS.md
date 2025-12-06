# PRETEST PLATFORM - FEEDBACK TAB API DOCUMENTATION

## 🎯 EXISTING APIs (Already Implemented)

### 1. Get Feedback Options
**Endpoint:** `GET /api/v1/feedback-options/`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Writing Task 1",
    "price": "1000.00"
  },
  {
    "id": 2,
    "name": "Writing Task 2",
    "price": "1000.00"
  },
  {
    "id": 3,
    "name": "Speaking",
    "price": "1000.00"
  }
]
```

---

### 2. Create Feedback Request
**Endpoint:** `POST /api/v1/feedbacks/create/`

**Request Body (3 variants):**

#### Variant 1: Text Submission
```json
{
  "writing": "The graph shows the percentage of students...",
  "feedback_type": 1,
  "related_booking": null
}
```

#### Variant 2: File Upload (FormData)
```
Content-Type: multipart/form-data

uploaded_file: [File object]
feedback_type: 1
related_booking: null (optional)
```

#### Variant 3: Related to Booking
```json
{
  "writing": null,
  "feedback_type": 2,
  "related_booking": 5
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "uploaded_file": null,
  "writing": "stringsdf asdf ds",
  "admin_video_response": null,
  "created_at": "2025-11-26T15:34:47.145941Z",
  "is_completed": false,
  "user": "1628b7e6-d6b4-493d-bcb5-b3ab03f06e37",
  "feedback_type": 1,
  "related_booking": null,
  "payment": null
}
```

---

### 3. Create Payment
**Endpoint:** `POST /api/v1/payments/create/`

**Request Body:**
```json
{
  "booking_id": null,
  "feedback_request_id": 2,
  "payment_method": "click"
}
```

**Response (201 Created):**
```json
{
  "payment_id": "29d0bdd5-f0d8-4c4a-bd89-ac4da2dcf494",
  "booking_id": null,
  "feedback_request_id": 1,
  "amount": "1000.00",
  "payment_method": "click",
  "status": "pending",
  "redirect_url": "https://my.click.uz/services/pay?service_id=87182&merchant_trans_id=29d0bdd5-f0d8-4c4a-bd89-ac4da2dcf494&amount=1000.00",
  "created_at": "2025-11-26T15:37:09.942414Z"
}
```

---

### 4. Get Feedback List
**Endpoint:** `GET /api/v1/feedbacks/list/`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "payment_status": "pending",
    "payment_method": "click",
    "uploaded_file": null,
    "writing": "string",
    "admin_video_response": null,
    "created_at": "2025-11-26T14:22:21.200204Z",
    "is_completed": false,
    "user": "1628b7e6-d6b4-493d-bcb5-b3ab03f06e37",
    "feedback_type": 1,
    "related_booking": null
  },
  {
    "id": 2,
    "payment_status": "paid",
    "payment_method": "click",
    "uploaded_file": null,
    "writing": "stringsdf asdf ds",
    "admin_video_response": "https://cdn.example.com/video.mp4",
    "created_at": "2025-11-26T15:34:47.145941Z",
    "is_completed": true,
    "user": "1628b7e6-d6b4-493d-bcb5-b3ab03f06e37",
    "feedback_type": 1,
    "related_booking": null
  }
]
```

---

## ⚠️ MISSING FIELDS (Need to Add)

### In `feedbacks/list/` response, please add:

```json
{
  "id": 1,
  "payment_status": "pending",
  "payment_method": "click",
  "uploaded_file": null,
  "writing": "string",
  "admin_video_response": null,
  "created_at": "2025-11-26T14:22:21.200204Z",
  "is_completed": false,
  "user": "uuid",
  "feedback_type": 1,
  "related_booking": null,
  
  // ← PLEASE ADD THESE:
  "feedback_type_name": "Writing Task 1",  // Name from feedback_options
  "examiner_name": "Dr. Sarah Mitchell",   // Examiner who reviewed
  "score": 7.5,                             // IELTS score (0-9)
  "feedback_description": "Excellent coherence and cohesion..." // Short summary
}
```

---

## 📊 FIELD DESCRIPTIONS

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Unique feedback request ID |
| `feedback_type` | Integer | ID from feedback-options (1=Task1, 2=Task2, 3=Speaking) |
| `feedback_type_name` | String | **[ADD]** Name from feedback-options |
| `payment_status` | String | `pending`, `paid`, `completed`, `failed`, null |
| `payment_method` | String | `click`, `cash`, null |
| `uploaded_file` | String/Null | File URL if uploaded |
| `writing` | String/Null | Text content if written |
| `admin_video_response` | String/Null | Video feedback URL |
| `is_completed` | Boolean | True if video uploaded |
| `created_at` | DateTime | ISO 8601 format |
| `user` | UUID | User ID |
| `related_booking` | Integer/Null | Related test booking ID |
| `examiner_name` | String/Null | **[ADD]** Examiner name |
| `score` | Float/Null | **[ADD]** IELTS score (0-9) |
| `feedback_description` | String/Null | **[ADD]** Short feedback text |

---

## 🔄 FRONTEND FLOW

### Writing Feedback Flow:
```
1. User clicks "Request Feedback"
   ↓
2. Modal opens with feedback options
   ↓
3. User selects "Writing Task 1/2"
   ↓
4. User writes text OR uploads file
   ↓
5. Frontend: POST /api/v1/feedbacks/create/
   {
     "writing": "text..." or uploaded_file: [File],
     "feedback_type": 1,
     "related_booking": null
   }
   ↓
6. Backend returns feedback_id
   ↓
7. Frontend: POST /api/v1/payments/create/
   {
     "feedback_request_id": feedback_id,
     "payment_method": "click"
   }
   ↓
8. Backend returns redirect_url
   ↓
9. Frontend redirects to Click payment page
   ↓
10. User completes payment
    ↓
11. Click webhook updates payment_status to "paid"
    ↓
12. Admin uploads video
    ↓
13. Backend sets is_completed=true, adds admin_video_response
    ↓
14. User sees video in dashboard
```

### Speaking Feedback Flow:
```
1. User clicks "Request Feedback"
   ↓
2. User selects "Speaking"
   ↓
3. Frontend: POST /api/v1/feedbacks/create/
   {
     "writing": null,
     "feedback_type": 3,
     "related_booking": null
   }
   ↓
4. Frontend: POST /api/v1/payments/create/
   ↓
5. User redirected to Click payment
   ↓
6. After payment, admin schedules speaking session
   ↓
7. Session happens (Zoom/Offline)
   ↓
8. Admin uploads video feedback
   ↓
9. User views video in dashboard
```

---

## 🎨 FRONTEND LOGIC

### Status Display Logic:
```javascript
function getStatus(request) {
  if (request.is_completed) {
    return "Completed" // Green
  }
  
  if (request.payment_status === 'paid' || request.payment_status === 'completed') {
    return "Processing" // Blue
  }
  
  return "Payment Pending" // Red
}
```

### Button Display Logic:
```javascript
if (request.is_completed && request.admin_video_response) {
  // Show "Watch Video" button
} else if (!request.payment_status || request.payment_status === 'pending') {
  // Show "Payment Required" button (disabled)
} else {
  // Show "Processing" button (disabled)
}
```

---

## 📝 EXAMPLE SCENARIOS

### Scenario 1: Writing Task 2 - Text Submission
**Step 1:** Create feedback
```json
POST /api/v1/feedbacks/create/
{
  "writing": "Some governments spend a lot of money on space exploration...",
  "feedback_type": 2
}

Response:
{
  "id": 5,
  "writing": "Some governments...",
  "feedback_type": 2,
  "is_completed": false,
  "payment": null
}
```

**Step 2:** Create payment
```json
POST /api/v1/payments/create/
{
  "feedback_request_id": 5,
  "payment_method": "click"
}

Response:
{
  "payment_id": "uuid",
  "feedback_request_id": 5,
  "redirect_url": "https://my.click.uz/services/pay?...",
  "status": "pending"
}
```

**Step 3:** User pays → Click webhook updates payment_status

**Step 4:** Admin uploads video → Backend updates:
```json
{
  "id": 5,
  "is_completed": true,
  "admin_video_response": "https://cdn.example.com/feedback_5.mp4",
  "payment_status": "completed",
  "examiner_name": "Dr. Sarah Mitchell",
  "score": 7.5,
  "feedback_description": "Excellent work..."
}
```

---

### Scenario 2: Writing Task 1 - File Upload
**Step 1:** Create feedback (FormData)
```
POST /api/v1/feedbacks/create/
Content-Type: multipart/form-data

uploaded_file: [File: essay.pdf]
feedback_type: 1
```

**Step 2-4:** Same as Scenario 1

---

### Scenario 3: Speaking Session
**Step 1:** Create feedback
```json
POST /api/v1/feedbacks/create/
{
  "feedback_type": 3,
  "writing": null
}
```

**Step 2:** Create payment and redirect

**Step 3:** After payment, admin contacts user for scheduling

**Step 4:** Session happens

**Step 5:** Admin uploads video feedback

---

## 🔧 ADMIN ENDPOINTS (Future)

These endpoints will be needed for admin panel:

### Upload Video Feedback
```
PUT /api/v1/feedbacks/{id}/admin-upload/
Content-Type: multipart/form-data

video: [File]
examiner_name: "Dr. Sarah Mitchell"
score: 7.5
feedback_description: "Excellent coherence..."
```

**Response:**
```json
{
  "id": 5,
  "is_completed": true,
  "admin_video_response": "https://cdn.example.com/video.mp4",
  "examiner_name": "Dr. Sarah Mitchell",
  "score": 7.5,
  "feedback_description": "Excellent work..."
}
```

---

## 🎯 SUMMARY OF CHANGES NEEDED

### 1. Add to `feedbacks/list/` response:
- ✅ `feedback_type_name` (from feedback_options.name)
- ✅ `examiner_name` 
- ✅ `score`
- ✅ `feedback_description`

### 2. Optional improvements:
- Consider adding a statistics endpoint: `GET /api/v1/feedbacks/statistics/`
  ```json
  {
    "total_submissions": 12,
    "completed_feedback": 9,
    "average_score": 7.2
  }
  ```
  *For now, frontend calculates this from feedbacks/list*

---

## ✅ CURRENT STATUS

**Working:**
- ✅ Get feedback options
- ✅ Create feedback request
- ✅ Create payment
- ✅ Get feedback list
- ✅ Payment flow with Click
- ✅ Frontend integration complete

**Needs Backend Update:**
- ⏳ Add `feedback_type_name` to response
- ⏳ Add `examiner_name` to response
- ⏳ Add `score` to response
- ⏳ Add `feedback_description` to response

---

**Last Updated:** November 26, 2025  
**Status:** Ready for testing after backend adds missing fields
