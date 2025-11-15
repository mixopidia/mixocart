// Mixocart Admin Login Integration
console.log('🔄 [LOAD] fastkart-admin-login.js script loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 [DOM] DOMContentLoaded event fired');
    console.log('🔍 [CHECK] API object available:', typeof API !== 'undefined');
    
    // Try multiple selectors for form
    const loginForm = document.querySelector('form') || 
                      document.querySelector('.log-in-box form') ||
                      document.querySelector('form.row');
    
    console.log('🔍 [FORM] Form element found:', loginForm !== null);
    console.log('🔍 [FORM] Form selector used:', loginForm ? loginForm.tagName : 'NOT FOUND');
    
    if (!loginForm) {
        console.error('❌ [ERROR] Login form not found - tried multiple selectors');
        console.log('Available forms:', document.querySelectorAll('form'));
        return;
    }
    
    // Try multiple selectors for inputs
    const emailInput = document.getElementById('email') || 
                       document.querySelector('input[type="email"]') ||
                       document.querySelector('input[placeholder*="Email"]');
    
    const passwordInput = document.getElementById('password') || 
                         document.querySelector('input[type="password"]') ||
                         document.querySelector('input[placeholder*="Password"]');
    
    console.log('🔍 [EMAIL] Email input found:', emailInput !== null, emailInput ? emailInput.id : 'N/A');
    console.log('🔍 [PASSWORD] Password input found:', passwordInput !== null, passwordInput ? passwordInput.id : 'N/A');
    
    const submitButton = loginForm.querySelector('button[type="submit"]') || 
                        loginForm.querySelector('.btn-animation') ||
                        loginForm.querySelector('button.btn');
    
    console.log('🔍 [BUTTON] Submit button found:', submitButton !== null);
    
    if (!emailInput || !passwordInput) {
        console.error('❌ [ERROR] Email or Password input not found');
        return;
    }
    
    console.log('✅ [INIT] All form elements found successfully');
    console.log('📝 [API] API Base URL:', 'http://127.0.0.1:8000/api/v1');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🚀 [SUBMIT] Form submission triggered');
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        console.log('📧 [DATA] Email:', email);
        console.log('🔑 [DATA] Password length:', password.length);
        
        if (!email || !password) {
            console.warn('⚠️ [VALIDATION] Missing email or password');
            showAlert('Please enter both email and password', 'danger');
            return;
        }
        
        console.log('✅ [VALIDATION] Form data validated');
        
        // Show loading
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Logging in...';
        
        console.log('🔄 [API] Preparing API call to /login endpoint');
        console.log('🔄 [API] Request body:', JSON.stringify({ email, password: '***' }));
        
        try {
            console.log('📡 [API] Calling API.Auth.login()...');
            const response = await API.Auth.login({ email, password });
            
            console.log('📥 [RESPONSE] API response received:', response);
            
            if (response.success || response.token) {
                console.log('✅ [SUCCESS] Login successful!');
                console.log('🎫 [TOKEN] Token received:', response.token ? 'YES' : 'NO');
                console.log('👤 [USER] User data:', response.user);
                
                // Save token
                API.setToken(response.token);
                localStorage.setItem('user_data', JSON.stringify(response.user));
                localStorage.setItem('is_admin', 'true');
                
                console.log('💾 [STORAGE] Data saved to localStorage');
                
                showAlert('✅ Login successful! Redirecting...', 'success');
                
                // Redirect to admin dashboard
                console.log('🔄 [REDIRECT] Redirecting to index.html in 1 second...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                console.warn('⚠️ [WARNING] Login response missing success/token');
                throw new Error(response.message || 'Login failed - no token received');
            }
        } catch (error) {
            console.error('❌ [ERROR] Login failed:', error);
            console.error('❌ [ERROR] Error message:', error.message);
            console.error('❌ [ERROR] Error stack:', error.stack);
            
            showAlert('❌ ' + (error.message || 'Login failed. Please check your credentials.'), 'danger');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
    
    function showAlert(message, type) {
        console.log(`🔔 [ALERT] Showing ${type} alert: ${message}`);
        
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        loginForm.parentNode.insertBefore(alertDiv, loginForm);
        setTimeout(() => alertDiv.remove(), 5000);
    }
    
    console.log('✅ [READY] Admin login form ready and waiting for submission!');
    console.log('-----------------------------------------------------------');
});

console.log('✅ [LOADED] fastkart-admin-login.js script loaded successfully');