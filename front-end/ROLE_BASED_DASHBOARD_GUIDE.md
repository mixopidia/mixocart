# Role-Based Dashboard Navigation System

## 📋 OVERVIEW

This system provides role-based dashboard navigation for Mixocart e-commerce, showing different dashboard options based on user roles.

---

## 🎯 FEATURES

### For Administrator Users
- ✅ **User Dashboard** - Access customer-facing dashboard
- ✅ **Main Dashboard** - Access admin panel
- ✅ Dynamic greeting with user name
- ✅ Role display in account dropdown

### For Regular Users (Customers)
- ✅ **User Dashboard** - Access customer dashboard only
- ❌ **Main Dashboard** - Hidden (admin-only)
- ✅ Dynamic greeting with user name

---

## 📂 FILES CREATED/MODIFIED

### Created Files

#### 1. `front-end/assets/js/dashboard-nav.js`
**Purpose:** Handles role-based dashboard navigation logic

**Key Functions:**
- Checks user role from localStorage
- Shows/hides dashboard links based on role
- Updates profile information dynamically
- Handles logout functionality

---

### Modified Files

#### 1. `front-end/index.html` (Homepage)
**Changes:**
- Updated profile dropdown structure (lines 311-343)
- Added separate links for User Dashboard and Main Dashboard
- Added script tag for dashboard-nav.js (line 4428)

**Before:**
```html
<li class="product-box-contain logout-section">
    <a href="user-dashboard.html">My Dashboard</a>
</li>
```

**After:**
```html
<!-- User Dashboard - shown to all logged-in users -->
<li class="product-box-contain logout-section user-dashboard-link" style="display: none;">
    <i data-feather="user"></i>
    <a href="user-dashboard.html">User Dashboard</a>
</li>

<!-- Main Dashboard - shown only to administrators -->
<li class="product-box-contain logout-section admin-dashboard-link" style="display: none;">
    <i data-feather="grid"></i>
    <a href="../back-end/index.html">Main Dashboard</a>
</li>
```

---

#### 2. `front-end/user-dashboard.html` (User Dashboard Page)
**Changes:**
- Updated profile dropdown structure (lines 305-337)
- Added both dashboard links
- Added api.js and dashboard-nav.js script tags (lines 3610-3613)

---

## 🔧 HOW IT WORKS

### 1. User Login Flow

```
User logs in → API returns user data with role → 
Data stored in localStorage → dashboard-nav.js reads role → 
Shows appropriate dashboard links
```

### 2. Role Detection Logic

```javascript
if (user.role.name === 'Administrator' || user.role.name === 'Admin') {
    // Show both dashboards
    adminDashboardLink.style.display = 'block';
    userDashboardLink.style.display = 'block';
} else {
    // Show only user dashboard
    adminDashboardLink.style.display = 'none';
    userDashboardLink.style.display = 'block';
}
```

### 3. localStorage Data Structure

**auth_token:**
```
"eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**user_data:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": {
    "id": 1,
    "name": "Administrator"
  }
}
```

---

## 🧪 TESTING

### Test Case 1: Administrator Login

**Steps:**
1. Login with administrator credentials
2. Open browser console (F12)
3. Click on profile dropdown in top-right

**Expected Console Output:**
```
🎯 [LOAD] Dashboard Navigation script loading...
✅ [LOADED] Dashboard Navigation script loaded successfully
🎯 [INIT] Dashboard Navigation initialized
🔍 [CHECK] Token exists: true
🔍 [CHECK] User data exists: true
👤 [USER] Name: Admin User
📧 [USER] Email: admin@example.com
🏷️ [USER] Role: Administrator
✅ [UI] Logged in state shown
✅ [ADMIN] Main Dashboard link shown for Administrator
✅ [ADMIN] User Dashboard link shown for Administrator
✅ [UI] Profile name updated: Admin User
✅ [READY] Dashboard navigation ready!
```

**Expected UI:**
- ✅ "User Dashboard" link visible
- ✅ "Main Dashboard" link visible
- ✅ "Logout" link visible
- ❌ Login/Register links hidden

---

### Test Case 2: Regular User Login

**Steps:**
1. Login with regular user credentials
2. Open browser console (F12)
3. Click on profile dropdown

**Expected Console Output:**
```
🎯 [LOAD] Dashboard Navigation script loading...
✅ [LOADED] Dashboard Navigation script loaded successfully
🎯 [INIT] Dashboard Navigation initialized
🔍 [CHECK] Token exists: true
🔍 [CHECK] User data exists: true
👤 [USER] Name: Regular User
📧 [USER] Email: user@example.com
🏷️ [USER] Role: Customer
✅ [UI] Logged in state shown
ℹ️ [USER] Main Dashboard link hidden (not admin)
✅ [USER] User Dashboard link shown
✅ [UI] Profile name updated: Regular User
✅ [READY] Dashboard navigation ready!
```

**Expected UI:**
- ✅ "User Dashboard" link visible
- ❌ "Main Dashboard" link hidden
- ✅ "Logout" link visible
- ❌ Login/Register links hidden

---

### Test Case 3: Not Logged In

**Steps:**
1. Clear localStorage or logout
2. Refresh page
3. Click on profile dropdown

**Expected Console Output:**
```
🎯 [LOAD] Dashboard Navigation script loading...
✅ [LOADED] Dashboard Navigation script loaded successfully
🎯 [INIT] Dashboard Navigation initialized
🔍 [CHECK] Token exists: false
🔍 [CHECK] User data exists: false
⚠️ [AUTH] No user logged in - showing login links
👋 [UI] Login links shown
```

**Expected UI:**
- ✅ "Log In" link visible
- ✅ "Register" link visible
- ✅ "Forgot Password" link visible
- ❌ Dashboard links hidden
- ❌ "Logout" link hidden

---

## 🔍 TROUBLESHOOTING

### Issue 1: Admin Dashboard Link Not Showing for Administrator

**Possible Causes:**
1. Role name doesn't match exactly "Administrator" or "Admin"
2. User data not saved properly in localStorage
3. JavaScript not loading

**Solutions:**
1. Check console logs for role name
2. Verify localStorage contains user_data with role
3. Check browser console for script errors

**Debug:**
```javascript
// In browser console
console.log(JSON.parse(localStorage.getItem('user_data')));
// Check the role.name value
```

---

### Issue 2: Links Show But Don't Work

**Possible Causes:**
1. Path to back-end/index.html is incorrect
2. Feather icons not initializing

**Solutions:**
1. Verify file paths in href attributes
2. Check if feather.replace() is called after DOM updates

---

### Issue 3: Profile Name Not Updating

**Possible Causes:**
1. User name not in localStorage
2. Selector not finding element

**Solutions:**
1. Check user_data in localStorage
2. Inspect DOM to verify element selectors

---

## 🎨 CUSTOMIZATION

### Adding More Roles

To support additional roles (e.g., "Vendor", "Manager"):

**Edit `dashboard-nav.js`:**
```javascript
if (user.role && (
    user.role.name === 'Administrator' || 
    user.role.name === 'Admin' ||
    user.role.name === 'Manager'  // Add new role
)) {
    // Show admin dashboard
    adminDashboardLink.style.display = 'block';
}
```

### Adding More Dashboard Links

To add a vendor dashboard:

**1. Add HTML in profile dropdown:**
```html
<li class="product-box-contain logout-section vendor-dashboard-link" style="display: none;">
    <i data-feather="shopping-bag"></i>
    <a href="vendor-dashboard.html">Vendor Dashboard</a>
</li>
```

**2. Add logic in `dashboard-nav.js`:**
```javascript
const vendorDashboardLink = document.querySelector('.vendor-dashboard-link');

if (user.role && user.role.name === 'Vendor') {
    if (vendorDashboardLink) {
        vendorDashboardLink.style.display = 'block';
    }
}
```

---

## 📊 EXPECTED BEHAVIOR MATRIX

| User Role | User Dashboard | Main Dashboard | Seller Dashboard |
|-----------|---------------|----------------|------------------|
| **Not Logged In** | ❌ Hidden | ❌ Hidden | ❌ Hidden |
| **Customer** | ✅ Shown | ❌ Hidden | ❌ Hidden |
| **Administrator** | ✅ Shown | ✅ Shown | ❌ Hidden |
| **Vendor** | ✅ Shown | ❌ Hidden | ✅ Shown* |

*Requires implementation of vendor dashboard link

---

## 🔒 SECURITY NOTES

### Frontend Protection Only
⚠️ **Important:** This system provides UI-level protection only. It hides/shows links based on user role but does NOT provide backend security.

### Backend Requirements
Ensure your Laravel backend:
1. ✅ Validates user role on every API request
2. ✅ Returns 403 Forbidden for unauthorized access
3. ✅ Checks permissions before returning sensitive data
4. ✅ Uses middleware to protect admin routes

### Example Laravel Middleware:
```php
// app/Http/Middleware/AdminOnly.php
public function handle($request, Closure $next)
{
    if (!auth()->user() || auth()->user()->role->name !== 'Administrator') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    return $next($request);
}
```

---

## 🚀 DEPLOYMENT CHECKLIST

- [x] dashboard-nav.js created
- [x] front-end/index.html updated
- [x] front-end/user-dashboard.html updated
- [x] Script tags added to both pages
- [ ] Test with administrator account
- [ ] Test with customer account
- [ ] Test logout functionality
- [ ] Verify backend returns role data
- [ ] Test navigation between dashboards
- [ ] Clear console errors
- [ ] Test on different browsers

---

## 📝 BACKEND API REQUIREMENTS

### Login Endpoint Must Return Role

**Endpoint:** `POST /api/v1/login`

**Required Response Format:**
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLC...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": {
      "id": 1,
      "name": "Administrator"
    }
  }
}
```

**Laravel Controller Example:**
```php
public function login(Request $request)
{
    // Validate and authenticate...
    
    $user = auth()->user();
    
    return response()->json([
        'success' => true,
        'token' => $user->createToken('auth_token')->plainTextToken,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => [
                'id' => $user->role_id,
                'name' => $user->role->name
            ]
        ]
    ]);
}
```

---

## 🎉 SUMMARY

The role-based dashboard navigation system is now fully implemented! It provides:

✅ **Dynamic dashboard links** based on user role  
✅ **Administrator access** to both user and admin dashboards  
✅ **Customer access** to user dashboard only  
✅ **Comprehensive logging** for debugging  
✅ **Secure logout** functionality  
✅ **Profile name updates** based on logged-in user  

**Ready for testing!** 🚀

---

**Last Updated:** November 14, 2025  
**Version:** 1.0  
**Status:** Complete & Ready for Testing

