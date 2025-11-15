// Mixocart Sign-Up Integration
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Mixocart Sign-Up Integration loaded');
    
    const signupForm = document.querySelector('form.row.g-4');
    const nameInput = document.getElementById('fullname') || document.getElementById('fname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('cpassword') || document.getElementById('password_confirmation');
    const submitButton = signupForm.querySelector('button[type="submit"]');
    
    if (!signupForm) {
        console.error('❌ Sign-up form not found');
        return;
    }
    
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : password;
        
        // Validation
        if (!name || !email || !password) {
            showAlert('Please fill in all required fields', 'danger');
            return;
        }
        
        if (password.length < 8) {
            showAlert('Password must be at least 8 characters long', 'danger');
            return;
        }
        
        if (confirmPasswordInput && password !== confirmPassword) {
            showAlert('Passwords do not match', 'danger');
            return;
        }
        
        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email address', 'danger');
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';
        
        try {
            const response = await API.Auth.register({ 
                name: name,
                email: email, 
                password: password,
                password_confirmation: password
            });
            
            if (response.success) {
                // Save token and user data
                API.setToken(response.token);
                localStorage.setItem('user_data', JSON.stringify(response.user));
                
                showAlert('✅ Account created successfully! Redirecting...', 'success');
                
                // Redirect after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        } catch (error) {
            console.error('Sign-up error:', error);
            let errorMessage = 'Registration failed. Please try again.';
            
            // Handle specific error messages
            if (error.message && error.message.includes('email')) {
                errorMessage = 'This email is already registered. Please login instead.';
            }
            
            showAlert('❌ ' + errorMessage, 'danger');
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
    
    // Email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Show alert message
    function showAlert(message, type) {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        signupForm.parentNode.insertBefore(alertDiv, signupForm.nextSibling);
        setTimeout(() => alertDiv.remove(), 5000);
    }
    
    console.log('✅ Sign-up form ready!');
});