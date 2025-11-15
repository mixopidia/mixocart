// Mixocart Login Integration
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Mixocart Login Integration loaded');
    
    const loginForm = document.querySelector('form.row.g-4');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    
    if (!loginForm) {
        console.error('❌ Login form not found');
        return;
    }
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        if (!email || !password) {
            showAlert('Please enter both email and password', 'danger');
            return;
        }
        
        submitButton.disabled = true;
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Logging in...';
        
        try {
            const response = await API.Auth.login({ email, password });
            
            if (response.success) {
                API.setToken(response.token);
                localStorage.setItem('user_data', JSON.stringify(response.user));
                showAlert('✅ Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('❌ ' + (error.message || 'Login failed'), 'danger');
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
    
    function showAlert(message, type) {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        loginForm.parentNode.insertBefore(alertDiv, loginForm.nextSibling);
        setTimeout(() => alertDiv.remove(), 5000);
    }
    
    console.log('✅ Login form ready!');
});