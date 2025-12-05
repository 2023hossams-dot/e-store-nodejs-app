# قاموس API - متجرك الإلكتروني

## 1. المصادقة (Authentication)

### تسجيل مستخدم جديد
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "firstName": "أحمد",
  "lastName": "محمد",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "+966501234567",
  "agreeTerms": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "تم التسجيل بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "أحمد",
    "lastName": "محمد",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

### تسجيل الدخول
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "أحمد",
    "lastName": "محمد",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

### الحصول على بيانات المستخدم الحالي
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "أحمد",
    "lastName": "محمد",
    "email": "user@example.com",
    "phone": "+966501234567",
    "role": "user",
    "addresses": [...],
    "preferences": {...}
  }
}
```

---

### تحديث الملف الشخصي
**Endpoint:** `PUT /api/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "أحمد",
  "lastName": "محمد",
  "phone": "+966501234567",
  "addresses": [{
    "fullName": "أحمد محمد",
    "street": "شارع النيل",
    "city": "الرياض",
    "zip": "12345",
    "country": "السعودية",
    "isDefault": true
  }],
  "preferences": {
    "newsletter": true,
    "notifications": true
  }
}
```

---

### تغيير كلمة المرور
**Endpoint:** `PUT /api/auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

---

## 2. المنتجات (Products)

### الحصول على جميع المنتجات
**Endpoint:** `GET /api/products`

**Query Parameters:**
```
?page=1&limit=12
?category=607f1f77bcf86cd799439011
?minPrice=100&maxPrice=1000
?search=laptop
?sort=newest|price-low|price-high|rating
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 12,
  "total": 150,
  "pages": 13,
  "currentPage": 1,
  "products": [
    {
      "_id": "607f1f77bcf86cd799439011",
      "name": "لابتوب Dell",
      "slug": "laptop-dell",
      "description": "لابتوب عالي الأداء",
      "price": 2500,
      "discountPrice": 2200,
      "discountPercentage": 12,
      "category": {...},
      "images": [...],
      "stock": 50,
      "rating": {
        "average": 4.5,
        "count": 120
      },
      "tags": ["إلكترونيات", "حواسيب"],
      "createdAt": "2024-12-01T10:00:00Z",
      "updatedAt": "2024-12-04T10:00:00Z"
    }
  ]
}
```

---

### الحصول على منتج معين
**Endpoint:** `GET /api/products/:id`

**Success Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "607f1f77bcf86cd799439011",
    "name": "لابتوب Dell",
    "description": "لابتوب عالي الأداء...",
    "price": 2500,
    "stock": 50,
    "reviews": [
      {
        "user": {...},
        "title": "منتج رائع",
        "comment": "جودة عالية جداً",
        "rating": 5,
        "createdAt": "2024-12-01T10:00:00Z"
      }
    ],
    "views": 1250
  }
}
```

---

### البحث عن المنتجات
**Endpoint:** `GET /api/products/search`

**Query Parameters:**
```
?q=laptop&page=1&limit=12
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "products": [...]
}
```

---

### الحصول على المنتجات المميزة
**Endpoint:** `GET /api/products/featured`

**Success Response (200):**
```json
{
  "success": true,
  "products": [...]
}
```

---

## 3. السلة (Cart)

### الحصول على السلة
**Endpoint:** `GET /api/cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "cart": {
    "_id": "607f1f77bcf86cd799439011",
    "user": "507f1f77bcf86cd799439011",
    "items": [
      {
        "product": "607f1f77bcf86cd799439011",
        "name": "لابتوب Dell",
        "price": 2500,
        "quantity": 1,
        "attributes": {
          "color": "أسود",
          "size": "15 بوصة"
        }
      }
    ],
    "subtotal": 2500,
    "discountAmount": 0,
    "tax": 125,
    "shippingCost": 50,
    "total": 2675
  }
}
```

---

### إضافة منتج إلى السلة
**Endpoint:** `POST /api/cart/add`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "607f1f77bcf86cd799439011",
  "quantity": 1,
  "attributes": {
    "color": "أسود",
    "size": "15 بوصة"
  }
}
```

---

### حذف منتج من السلة
**Endpoint:** `POST /api/cart/remove/:productId`

**Headers:**
```
Authorization: Bearer <token>
```

---

### تحديث كمية المنتج
**Endpoint:** `PUT /api/cart/update/:productId`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 2
}
```

---

## 4. الطلبات (Orders)

### إنشاء طلب جديد
**Endpoint:** `POST /api/orders`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "product": "607f1f77bcf86cd799439011",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "أحمد محمد",
    "email": "user@example.com",
    "phone": "+966501234567",
    "street": "شارع النيل",
    "city": "الرياض",
    "zip": "12345",
    "country": "السعودية"
  },
  "paymentMethod": {
    "type": "credit_card",
    "lastFour": "4242",
    "cardBrand": "Visa"
  },
  "discountCode": "SUMMER20"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "تم إنشاء الطلب بنجاح",
  "order": {
    "_id": "607f1f77bcf86cd799439011",
    "orderNumber": "ORD-2024-000001",
    "user": "507f1f77bcf86cd799439011",
    "items": [...],
    "subtotal": 2500,
    "discountAmount": 250,
    "tax": 225,
    "shippingCost": 0,
    "totalAmount": 2475,
    "status": "pending",
    "createdAt": "2024-12-04T10:00:00Z"
  }
}
```

---

### الحصول على طلباتي
**Endpoint:** `GET /api/orders/my-orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
```
?page=1&limit=10&status=pending
```

---

### الحصول على تفاصيل طلب
**Endpoint:** `GET /api/orders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

### إلغاء الطلب
**Endpoint:** `PUT /api/orders/:id/cancel`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "غيرت رأيي"
}
```

---

## 5. كود الأخطاء الشائعة

### 400 - Bad Request
```json
{
  "success": false,
  "message": "أخطاء في التحقق من البيانات",
  "errors": [
    {
      "field": "email",
      "message": "بريد إلكتروني غير صحيح"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "يرجى تسجيل الدخول أولاً"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "أنت غير مصرح بالوصول إلى هذا المورد"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "المورد غير موجود"
}
```

### 429 - Too Many Requests
```json
{
  "success": false,
  "message": "تم جعل الكثير من الطلبات، يرجى المحاولة لاحقاً"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "خطأ في السيرفر"
}
```

---

## 📝 ملاحظات مهمة

1. **التوكن**: احفظ التوكن المستقبل من تسجيل الدخول واستخدمه في جميع الطلبات المحمية
2. **الرؤوس**: تأكد من إضافة `Content-Type: application/json` عند إرسال البيانات
3. **التاريخ**: يتم إرسال التاريخ بصيغة ISO 8601
4. **العملة**: جميع الأسعار بالريال السعودي (SAR)
5. **معدل التحديث**: هناك حدود على عدد الطلبات من نفس الـ IP

---

**تم آخر تحديث**: ديسمبر 2024
