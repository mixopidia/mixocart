# Role-Based Dashboard Navigation - Visual Demo

## 🎨 VISUAL DEMONSTRATION

This document shows exactly what users will see based on their role.

---

## 📱 SCENARIO 1: Not Logged In

### Profile Dropdown View

```
┌─────────────────────────────────────┐
│  👤 Hello,                          │
│     My Account                      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │  🔓 Log In                    │ │
│  │                               │ │
│  │  📝 Register                  │ │
│  │                               │ │
│  │  🔑 Forgot Password           │ │
│  │                               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**What's Visible:**
- ✅ Log In link
- ✅ Register link
- ✅ Forgot Password link
- ❌ Dashboard links (hidden)
- ❌ Logout link (hidden)

**Console Output:**
```
🎯 [LOAD] Dashboard Navigation script loading...
✅ [LOADED] Dashboard Navigation script loaded successfully
🎯 [INIT] Dashboard Navigation initialized
🔍 [CHECK] Token exists: false
🔍 [CHECK] User data exists: false
⚠️ [AUTH] No user logged in - showing login links
👋 [UI] Login links shown
```

---

## 👥 SCENARIO 2: Regular Customer (Logged In)

### Profile Dropdown View

```
┌─────────────────────────────────────┐
│  👤 Hello, Sarah!                   │
│     Customer                        │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │  👤 User Dashboard            │ │
│  │                               │ │
│  │  🚪 Logout                    │ │
│  │                               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**What's Visible:**
- ✅ User Dashboard link → `user-dashboard.html`
- ✅ Logout link
- ❌ Main Dashboard link (hidden)
- ❌ Login/Register links (hidden)

**Console Output:**
```
🎯 [LOAD] Dashboard Navigation script loading...
✅ [LOADED] Dashboard Navigation script loaded successfully
🎯 [INIT] Dashboard Navigation initialized
🔍 [CHECK] Token exists: true
🔍 [CHECK] User data exists: true
👤 [USER] Name: Sarah Johnson
📧 [USER] Email: sarah@example.com
🏷️ [USER] Role: Customer
✅ [UI] Logged in state shown
ℹ️ [USER] Main Dashboard link hidden (not admin)
✅ [USER] User Dashboard link shown
✅ [UI] Profile name updated: Sarah Johnson
✅ [READY] Dashboard navigation ready!
-----------------------------------------------------------
```

**User Journey:**
1. Click "User Dashboard" → Navigate to customer dashboard
2. Can manage orders, addresses, profile
3. Cannot access admin panel

---

## 👨‍💼 SCENARIO 3: Administrator (Logged In)

### Profile Dropdown View

```
┌─────────────────────────────────────┐
│  👤 Hello, Admin!                   │
│     Administrator                   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │  👤 User Dashboard            │ │
│  │                               │ │
│  │  🎛️ Main Dashboard            │ │
│  │                               │ │
│  │  🚪 Logout                    │ │
│  │                               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**What's Visible:**
- ✅ User Dashboard link → `user-dashboard.html`
- ✅ Main Dashboard link → `../back-end/index.html`
- ✅ Logout link
- ❌ Login/Register links (hidden)

**Console Output:**
```
🎯 [LOAD] Dashboard Navigation script loading...
✅ [LOADED] Dashboard Navigation script loaded successfully
🎯 [INIT] Dashboard Navigation initialized
🔍 [CHECK] Token exists: true
🔍 [CHECK] User data exists: true
👤 [USER] Name: Admin User
📧 [USER] Email: admin@fastkart.com
🏷️ [USER] Role: Administrator
✅ [UI] Logged in state shown
✅ [ADMIN] Main Dashboard link shown for Administrator
✅ [ADMIN] User Dashboard link shown for Administrator
✅ [UI] Profile name updated: Admin User
✅ [READY] Dashboard navigation ready!
-----------------------------------------------------------
```

**User Journey:**
1. Click "User Dashboard" → View customer-facing dashboard
2. Click "Main Dashboard" → Access admin panel with full controls
3. Can switch between dashboards seamlessly

---

## 🔄 SCENARIO 4: Logout Process

### Before Logout

```
localStorage:
├── auth_token: "eyJ0eXAiOiJKV1Qi..."
├── user_data: '{"id":1,"name":"Admin User",...}'
└── is_admin: "true"
```

### User Clicks Logout

**Console Output:**
```
🚪 [LOGOUT] User logging out...
🗑️ [LOGOUT] Auth data cleared
🔄 [LOGOUT] Redirecting to login page...
```

### After Logout

```
localStorage:
├── auth_token: (removed)
├── user_data: (removed)
└── is_admin: (removed)

→ Redirected to login.html
```

---

## 📊 COMPARISON TABLE

| Feature | Not Logged In | Customer | Administrator |
|---------|--------------|----------|---------------|
| **Log In Link** | ✅ Shown | ❌ Hidden | ❌ Hidden |
| **Register Link** | ✅ Shown | ❌ Hidden | ❌ Hidden |
| **Forgot Password** | ✅ Shown | ❌ Hidden | ❌ Hidden |
| **User Dashboard** | ❌ Hidden | ✅ Shown | ✅ Shown |
| **Main Dashboard** | ❌ Hidden | ❌ Hidden | ✅ Shown |
| **Logout** | ❌ Hidden | ✅ Shown | ✅ Shown |
| **Profile Name** | - | Sarah Johnson | Admin User |
| **Account Title** | My Account | Customer | Administrator |

---

## 🎯 NAVIGATION FLOW DIAGRAM

### Customer Flow

```
┌──────────────┐
│  Homepage    │
│  (index.html)│
└──────┬───────┘
       │
       │ Click Profile → "User Dashboard"
       │
       ▼
┌──────────────────────┐
│  User Dashboard      │
│  (user-dashboard.html)│
└──────────────────────┘
       │
       │ Click "Logout"
       │
       ▼
┌──────────────┐
│  Login Page  │
│  (login.html)│
└──────────────┘
```

### Administrator Flow

```
┌──────────────┐
│  Homepage    │
│  (index.html)│
└──────┬───────┘
       │
       ├─ Click "User Dashboard"
       │  ▼
       │  ┌──────────────────────┐
       │  │  User Dashboard      │
       │  │  (user-dashboard.html)│
       │  └──────────────────────┘
       │
       └─ Click "Main Dashboard"
          ▼
       ┌──────────────────────┐
       │  Admin Panel         │
       │  (back-end/index.html)│
       └──────────────────────┘
       
Both can logout → login.html
```

---

## 🖼️ ACTUAL HTML STRUCTURE

### Profile Dropdown HTML (Both Pages)

```html
<div class="onhover-div onhover-div-login">
    <ul class="user-box-name">
        <!-- Not Logged In Section -->
        <li class="product-box-contain login-links">
            <i></i>
            <a href="login.html">Log In</a>
        </li>
        
        <li class="product-box-contain login-links">
            <a href="sign-up.html">Register</a>
        </li>
        
        <li class="product-box-contain login-links">
            <a href="forgot.html">Forgot Password</a>
        </li>
        
        <!-- Logged In Section -->
        <li class="product-box-contain logout-section user-dashboard-link" 
            style="display: none;">
            <i data-feather="user"></i>
            <a href="user-dashboard.html">User Dashboard</a>
        </li>
        
        <li class="product-box-contain logout-section admin-dashboard-link" 
            style="display: none;">
            <i data-feather="grid"></i>
            <a href="../back-end/index.html">Main Dashboard</a>
        </li>
        
        <li class="product-box-contain logout-section" 
            style="display: none;">
            <i data-feather="log-out"></i>
            <a href="#" class="logout-btn" style="color: #dc3545;">Logout</a>
        </li>
    </ul>
</div>
```

---

## 💻 BROWSER CONSOLE EXAMPLES

### Example 1: Check Current User

```javascript
// Open Browser Console (F12)

// Check if user is logged in
console.log('Token:', localStorage.getItem('auth_token'));

// Check user data
console.log('User:', JSON.parse(localStorage.getItem('user_data')));

// Check role
const user = JSON.parse(localStorage.getItem('user_data'));
console.log('Role:', user?.role?.name);
```

**Output (if admin logged in):**
```
Token: eyJ0eXAiOiJKV1QiLCJhbGciOi...
User: {id: 1, name: "Admin User", email: "admin@fastkart.com", role: {…}}
Role: Administrator
```

---

### Example 2: Manually Check Dashboard Visibility

```javascript
// Open Browser Console (F12)

// Check which links are visible
const userDashboard = document.querySelector('.user-dashboard-link');
const adminDashboard = document.querySelector('.admin-dashboard-link');

console.log('User Dashboard Display:', 
    window.getComputedStyle(userDashboard).display);
console.log('Admin Dashboard Display:', 
    window.getComputedStyle(adminDashboard).display);
```

**Output (for admin):**
```
User Dashboard Display: block
Admin Dashboard Display: block
```

**Output (for customer):**
```
User Dashboard Display: block
Admin Dashboard Display: none
```

---

### Example 3: Test Logout Function

```javascript
// Open Browser Console (F12)

// Manually trigger logout
logout();

// You'll see console logs and be redirected to login
```

---

## 📱 MOBILE VIEW

### Collapsed Header State

```
┌─────────────────────────────────┐
│  ☰                    🛒 👤    │
└─────────────────────────────────┘
                           ↓
                    Click Profile Icon
                           ↓
┌─────────────────────────────────┐
│  Profile Menu                   │
│  ───────────────────────────    │
│  👤 User Dashboard              │
│  🎛️ Main Dashboard (admin)      │
│  🚪 Logout                      │
└─────────────────────────────────┘
```

**Same functionality, responsive design!**

---

## 🎨 CSS CLASSES REFERENCE

| Class | Purpose | Initial State |
|-------|---------|---------------|
| `.login-links` | Login/Register links | `display: block` |
| `.logout-section` | Dashboard/Logout links | `display: none` |
| `.user-dashboard-link` | User Dashboard link | `display: none` |
| `.admin-dashboard-link` | Main Dashboard link | `display: none` |
| `.logout-btn` | Logout button | `display: none` |

**JavaScript Controls Visibility Based on Role**

---

## 🔍 DEBUGGING TIPS

### Tip 1: Check if Script is Loading

```javascript
// Type in console:
typeof window.logout === 'function'
// Should return: true
```

### Tip 2: Check User Role

```javascript
// Type in console:
const userData = localStorage.getItem('user_data');
const user = JSON.parse(userData);
console.table(user);
```

### Tip 3: Force Show Admin Link (Testing)

```javascript
// Type in console:
document.querySelector('.admin-dashboard-link').style.display = 'block';
// Admin link will appear (UI only - not secure!)
```

### Tip 4: Monitor All Dashboard Nav Events

```javascript
// Add this to console to see all dashboard events:
const originalLog = console.log;
console.log = function(...args) {
    if (args[0] && typeof args[0] === 'string' && 
        (args[0].includes('[INIT]') || 
         args[0].includes('[USER]') || 
         args[0].includes('[ADMIN]'))) {
        originalLog.apply(console, ['⭐', ...args]);
    }
    originalLog.apply(console, args);
};
```

---

## ✅ TESTING CHECKLIST WITH VISUALS

### [ ] Test 1: Not Logged In State
- Open homepage
- Click profile icon
- Should see: Log In, Register, Forgot Password
- Should NOT see: Dashboard links

### [ ] Test 2: Customer Login
- Login as customer
- Click profile icon
- Should see: User Dashboard, Logout
- Should NOT see: Main Dashboard

### [ ] Test 3: Admin Login
- Login as administrator
- Click profile icon
- Should see: User Dashboard, Main Dashboard, Logout
- Should NOT see: Log In, Register

### [ ] Test 4: Navigation
- Click User Dashboard → Should go to user-dashboard.html
- (Admin only) Click Main Dashboard → Should go to back-end/index.html

### [ ] Test 5: Logout
- Click Logout
- Should clear localStorage
- Should redirect to login.html
- Should show login links again

---

## 🎉 SUMMARY

The role-based dashboard navigation provides:

✅ **Clear Visual Separation** - Different users see different options  
✅ **Intuitive Icons** - Feather icons for better UX  
✅ **Smooth Transitions** - Links appear/disappear based on state  
✅ **Comprehensive Logging** - Easy debugging in console  
✅ **Responsive Design** - Works on all devices  

**Ready to use!** 🚀

---

**Visual Demo Version:** 1.0  
**Last Updated:** November 14, 2025  
**For:** Mixocart E-commerce Platform

