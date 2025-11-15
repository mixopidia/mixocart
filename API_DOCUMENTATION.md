# Mixocart E-Commerce - API Documentation

**API Version:** 1.0  
**Base URL:** `http://127.0.0.1:8000/api/v1`  
**Authentication:** Laravel Sanctum (Bearer Token)  
**Content-Type:** `application/json`  
**Last Updated:** November 14, 2025

---

## 📋 TABLE OF CONTENTS

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Role Management](#role-management)
5. [Customer Dashboard](#customer-dashboard)
6. [Product Management](#product-management) (Not Implemented)
7. [Category Management](#category-management) (Not Implemented)
8. [Order Management](#order-management) (Not Implemented)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

---

## 1. GETTING STARTED

### Base URL
```
Production: https://api.mixocart.com/api/v1
Development: http://127.0.0.1:8000/api/v1
```

### Common Headers
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}  # For protected routes
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"  // Optional
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": {...}  // Validation errors
}
```

---

## 2. AUTHENTICATION

### 2.1 Register New User

**Endpoint:** `POST /register`  
**Authentication:** Not Required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": {
      "id": 2,
      "name": "Customer",
      "slug": "customer"
    }
  },
  "token_type": "Bearer"
}
```

**Validation Errors (422):**
```json
{
  "success": false,
  "errors": {
    "email": [
      "The email has already been taken."
    ],
    "password": [
      "The password must be at least 8 characters."
    ]
  }
}
```

**Validation Rules:**
- `name`: required, string, max 255 characters
- `email`: required, email, max 255, unique
- `password`: required, string, min 8 characters, confirmed

---

### 2.2 Login

**Endpoint:** `POST /login`  
**Authentication:** Not Required

**Request Body:**
```json
{
  "email": "admin@mixocart.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "2|XyZ123AbC456DeF789GhI012JkL",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@mixocart.com",
    "role": {
      "id": 1,
      "name": "Administrator",
      "slug": "administrator"
    }
  },
  "token_type": "Bearer"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Validation Rules:**
- `email`: required, email
- `password`: required

---

### 2.3 Logout

**Endpoint:** `POST /logout`  
**Authentication:** Required

**Headers:**
```http
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2.4 Get Current User

**Endpoint:** `GET /user`  
**Authentication:** Required

**Headers:**
```http
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@mixocart.com",
    "role": {
      "id": 1,
      "name": "Administrator",
      "slug": "administrator"
    }
  }
}
```

**Error Response (401):**
```json
{
  "message": "Unauthenticated."
}
```

---

## 3. USER MANAGEMENT

### ❌ **NOT IMPLEMENTED YET**

**Planned Endpoints:**

```
GET    /users           - List all users
GET    /users/{id}      - Get user details
POST   /users           - Create user
PUT    /users/{id}      - Update user
DELETE /users/{id}      - Delete user
```

---

## 4. ROLE MANAGEMENT

### 4.1 List All Roles

**Endpoint:** `GET /roles`  
**Authentication:** Required

**Query Parameters:**
- `search` (optional): Search by name or description
- `status` (optional): Filter by status (0|1)
- `all` (optional): Get all without pagination (0|1)
- `per_page` (optional): Items per page (default: 15)

**Request Example:**
```http
GET /api/v1/roles?search=admin&status=1&per_page=10
Authorization: Bearer {token}
```

**Success Response (200) - Paginated:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Administrator",
      "slug": "administrator",
      "description": "Full system access",
      "permissions": ["users.create", "users.edit", "users.delete"],
      "status": true,
      "created_at": "2025-11-14T10:00:00.000000Z",
      "updated_at": "2025-11-14T10:00:00.000000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "per_page": 10,
    "current_page": 1,
    "last_page": 1
  }
}
```

**Success Response (200) - All:**
```http
GET /api/v1/roles?all=1
```

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Administrator",
      "slug": "administrator",
      "description": "Full system access",
      "permissions": [],
      "status": true
    },
    {
      "id": 2,
      "name": "Customer",
      "slug": "customer",
      "description": "Regular customer",
      "permissions": [],
      "status": true
    }
  ]
}
```

---

### 4.2 Get Single Role

**Endpoint:** `GET /roles/{id}`  
**Authentication:** Required

**Request Example:**
```http
GET /api/v1/roles/1
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Administrator",
    "slug": "administrator",
    "description": "Full system access",
    "permissions": ["users.create", "users.edit", "roles.manage"],
    "status": true,
    "created_at": "2025-11-14T10:00:00.000000Z",
    "updated_at": "2025-11-14T10:00:00.000000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Role not found"
}
```

---

### 4.3 Create Role

**Endpoint:** `POST /roles`  
**Authentication:** Required

**Request Body:**
```json
{
  "name": "Store Manager",
  "description": "Manage products and orders",
  "permissions": [
    "products.view",
    "products.create",
    "products.edit",
    "orders.view",
    "orders.update"
  ],
  "status": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "id": 3,
    "name": "Store Manager",
    "slug": "store-manager",
    "description": "Manage products and orders",
    "permissions": [
      "products.view",
      "products.create",
      "products.edit",
      "orders.view",
      "orders.update"
    ],
    "status": true,
    "created_at": "2025-11-14T15:30:00.000000Z",
    "updated_at": "2025-11-14T15:30:00.000000Z"
  }
}
```

**Validation Errors (422):**
```json
{
  "success": false,
  "errors": {
    "name": [
      "The name has already been taken."
    ]
  }
}
```

**Validation Rules:**
- `name`: required, string, max 255, unique
- `description`: optional, string
- `permissions`: optional, array
- `status`: optional, boolean

---

### 4.4 Update Role

**Endpoint:** `PUT /roles/{id}`  
**Authentication:** Required

**Request Body:**
```json
{
  "name": "Store Manager",
  "description": "Updated description",
  "permissions": [
    "products.view",
    "products.create",
    "orders.view"
  ],
  "status": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "id": 3,
    "name": "Store Manager",
    "slug": "store-manager",
    "description": "Updated description",
    "permissions": [
      "products.view",
      "products.create",
      "orders.view"
    ],
    "status": true,
    "created_at": "2025-11-14T15:30:00.000000Z",
    "updated_at": "2025-11-14T16:00:00.000000Z"
  }
}
```

---

### 4.5 Delete Role

**Endpoint:** `DELETE /roles/{id}`  
**Authentication:** Required

**Request Example:**
```http
DELETE /api/v1/roles/3
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

**Error Response (422) - Has Users:**
```json
{
  "success": false,
  "message": "Cannot delete role with assigned users"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Failed to delete role",
  "error": "No query results for model [App\\Models\\Role] 999"
}
```

---

### 4.6 Get Permissions

**Endpoint:** `GET /roles/permissions`  
**Authentication:** Required

**Request Example:**
```http
GET /api/v1/roles/permissions
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "category": "Users",
      "permissions": [
        {"key": "users.view", "name": "View Users"},
        {"key": "users.create", "name": "Create Users"},
        {"key": "users.edit", "name": "Edit Users"},
        {"key": "users.delete", "name": "Delete Users"}
      ]
    },
    {
      "category": "Products",
      "permissions": [
        {"key": "products.view", "name": "View Products"},
        {"key": "products.create", "name": "Create Products"},
        {"key": "products.edit", "name": "Edit Products"},
        {"key": "products.delete", "name": "Delete Products"}
      ]
    }
  ]
}
```

---

### 4.7 Toggle Role Status

**Endpoint:** `PATCH /roles/{id}/toggle-status`  
**Authentication:** Required

**Request Example:**
```http
PATCH /api/v1/roles/3/toggle-status
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role status updated",
  "data": {
    "id": 3,
    "name": "Store Manager",
    "slug": "store-manager",
    "status": false,
    "updated_at": "2025-11-14T16:30:00.000000Z"
  }
}
```

---

## 5. CUSTOMER DASHBOARD

### 5.1 Get Profile

**Endpoint:** `GET /customer/dashboard/profile`  
**Authentication:** Required

**Request Example:**
```http
GET /api/v1/customer/dashboard/profile
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "John Customer",
    "email": "john@example.com",
    "role_id": 2,
    "role": {
      "id": 2,
      "name": "Customer"
    },
    "created_at": "2025-10-15T08:30:00.000000Z",
    "member_since": "October 2025",
    "account_age_days": 30
  }
}
```

---

### 5.2 Update Profile

**Endpoint:** `PUT /customer/dashboard/profile`  
**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 5,
    "name": "John Updated",
    "email": "john.updated@example.com"
  }
}
```

**Validation Rules:**
- `name`: required, string, max 255
- `email`: required, email, max 255, unique (except current user)

---

### 5.3 Change Password

**Endpoint:** `POST /customer/dashboard/change-password`  
**Authentication:** Required

**Request Body:**
```json
{
  "current_password": "oldpassword123",
  "new_password": "newpassword456",
  "new_password_confirmation": "newpassword456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**Validation Rules:**
- `current_password`: required
- `new_password`: required, string, min 8, confirmed

---

### 5.4 Get Statistics

**Endpoint:** `GET /customer/dashboard/statistics`  
**Authentication:** Required

**Request Example:**
```http
GET /api/v1/customer/dashboard/statistics
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total_orders": 0,
    "total_spent": 0,
    "pending_orders": 0,
    "completed_orders": 0,
    "wishlist_items": 0,
    "account_age_days": 30,
    "member_since": "October 15, 2025"
  }
}
```

**Note:** Currently returns placeholder data. Will be updated when orders module is implemented.

---

### 5.5 Get Recent Orders

**Endpoint:** `GET /customer/dashboard/orders`  
**Authentication:** Required

**Request Example:**
```http
GET /api/v1/customer/dashboard/orders
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "No orders yet",
  "data": []
}
```

**Note:** Placeholder endpoint. Will return actual orders when orders module is implemented.

---

### 5.6 Get Activity Log

**Endpoint:** `GET /customer/dashboard/activity`  
**Authentication:** Required

**Request Example:**
```http
GET /api/v1/customer/dashboard/activity
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "account_created",
      "description": "Account created",
      "timestamp": "2025-10-15T08:30:00.000000Z",
      "formatted_date": "October 15, 2025 8:30 AM"
    },
    {
      "id": 2,
      "type": "login",
      "description": "Logged in",
      "timestamp": "2025-11-14T16:45:00.000000Z",
      "formatted_date": "Just now"
    }
  ]
}
```

**Note:** Currently returns placeholder data. Will be expanded when more features are implemented.

---

## 6. PRODUCT MANAGEMENT

### ❌ **NOT IMPLEMENTED YET**

**Planned Endpoints:**

#### 6.1 List Products
```
GET /products
Query Params: page, per_page, category_id, search, status, sort
```

#### 6.2 Get Product
```
GET /products/{id}
```

#### 6.3 Create Product
```
POST /products
Body: name, slug, description, price, category_id, images, stock_quantity, etc.
```

#### 6.4 Update Product
```
PUT /products/{id}
Body: name, description, price, etc.
```

#### 6.5 Delete Product
```
DELETE /products/{id}
```

#### 6.6 Upload Product Images
```
POST /products/{id}/images
Body: FormData with image files
```

#### 6.7 Search Products
```
GET /products/search?q={query}
```

#### 6.8 Featured Products
```
GET /products/featured
```

---

## 7. CATEGORY MANAGEMENT

### ❌ **NOT IMPLEMENTED YET**

**Planned Endpoints:**

#### 7.1 List Categories
```
GET /categories
Query Params: parent_id, status
```

#### 7.2 Get Category
```
GET /categories/{id}
```

#### 7.3 Create Category
```
POST /categories
Body: name, slug, description, parent_id, image
```

#### 7.4 Update Category
```
PUT /categories/{id}
Body: name, description, etc.
```

#### 7.5 Delete Category
```
DELETE /categories/{id}
```

#### 7.6 Category Tree
```
GET /categories/tree
Returns hierarchical category structure
```

---

## 8. ORDER MANAGEMENT

### ❌ **NOT IMPLEMENTED YET**

**Planned Endpoints:**

#### 8.1 List Orders
```
GET /orders
Query Params: status, user_id, page, per_page
```

#### 8.2 Get Order
```
GET /orders/{id}
```

#### 8.3 Create Order
```
POST /orders
Body: items[], shipping_address, payment_method
```

#### 8.4 Update Order Status
```
PATCH /orders/{id}/status
Body: status (pending|processing|shipped|delivered|cancelled)
```

#### 8.5 Cancel Order
```
POST /orders/{id}/cancel
```

---

## 9. ERROR HANDLING

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| **200** | OK | Successful GET, PUT, PATCH, DELETE |
| **201** | Created | Successful POST (resource created) |
| **400** | Bad Request | Invalid request format |
| **401** | Unauthorized | Missing or invalid token |
| **403** | Forbidden | Valid token but insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **422** | Unprocessable Entity | Validation errors |
| **500** | Internal Server Error | Server error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",  // Optional
  "errors": {                         // Validation errors
    "field_name": ["Error message"]
  }
}
```

### Common Error Examples

**Validation Error (422):**
```json
{
  "success": false,
  "errors": {
    "email": [
      "The email field is required."
    ],
    "password": [
      "The password must be at least 8 characters."
    ]
  }
}
```

**Authentication Error (401):**
```json
{
  "message": "Unauthenticated."
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Failed to perform operation",
  "error": "Database connection timeout"
}
```

---

## 10. RATE LIMITING

### Current Limits
- **Not Implemented Yet**

### Planned Limits
- **Public Routes:** 60 requests/minute
- **Authenticated Routes:** 120 requests/minute
- **Admin Routes:** 240 requests/minute

### Rate Limit Headers (Planned)
```http
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 119
X-RateLimit-Reset: 1699999999
```

---

## 📝 CHANGELOG

### Version 1.0 (2025-11-14)
- ✅ Authentication endpoints (register, login, logout, user)
- ✅ Role management CRUD
- ✅ Customer dashboard endpoints
- ✅ Role-based authorization
- ✅ Token authentication

### Upcoming (Version 1.1)
- Product management endpoints
- Category management endpoints
- Order management endpoints
- Cart management endpoints
- User management endpoints (admin)

---

## 📞 SUPPORT

### API Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Mixocart API is running",
  "timestamp": "2025-11-14 16:45:30"
}
```

### Base URL Test
```bash
curl http://127.0.0.1:8000/api/health
```

---

## 🔐 SECURITY

### Authentication
- Uses Laravel Sanctum
- Token-based authentication
- Tokens stored in `personal_access_tokens` table
- Tokens can be revoked individually

### Best Practices
1. Always use HTTPS in production
2. Store tokens securely (httpOnly cookies or secure storage)
3. Implement token refresh mechanism
4. Add rate limiting
5. Validate all inputs
6. Sanitize outputs
7. Use CORS properly
8. Implement API versioning

---

## 🧪 TESTING

### Using cURL

**Login Example:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@mixocart.com","password":"password123"}'
```

**Authenticated Request Example:**
```bash
curl -X GET http://127.0.0.1:8000/api/v1/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Using Postman

1. Import collection (to be created)
2. Set environment variables:
   - `base_url`: `http://127.0.0.1:8000/api/v1`
   - `token`: Your authentication token
3. Use `{{base_url}}` and `{{token}}` in requests

---

**API Documentation Version:** 1.0  
**Last Updated:** November 14, 2025  
**Maintained By:** Development Team

