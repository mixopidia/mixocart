// Mixocart Admin Authentication Check
// This script runs on all admin pages to ensure user is authenticated

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Admin Auth Check loaded');
    
    // Check if we're on the login page - skip auth check
    const isLoginPage = window.location.pathname.includes('login.html') || 
                        window.location.pathname.includes('forgot-password.html') ||
                        window.location.pathname.includes('otp.html');
    
    if (isLoginPage) {
        console.log('⏭️ Login page detected - skipping auth check');
        return;
    }
    
    // Check authentication
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) {
        console.log('❌ Not authenticated - redirecting to login');
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const user = JSON.parse(userData);
        console.log('✅ Admin authenticated:', user.name);
        
        // Update admin name in header
        updateAdminHeader(user);
        
        // Setup logout functionality
        setupLogout();
        
    } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = 'login.html';
    }
    
    /**
     * Update admin header with user name
     */
    function updateAdminHeader(user) {
        // Find profile name elements in header
        const profileNames = document.querySelectorAll('.header-profile .name h6, .profile-name');
        
        profileNames.forEach(element => {
            element.textContent = user.name;
        });
        
        // Update any "Admin" text with actual name
        const adminTexts = document.querySelectorAll('.media-body h5, .user-name h6');
        adminTexts.forEach(element => {
            if (element.textContent.includes('Admin') || element.textContent.includes('User')) {
                element.textContent = user.name;
            }
        });
        
        console.log('👤 Admin header updated with:', user.name);
    }
    
    /**
     * Setup logout button functionality
     */
    function setupLogout() {
        // Find all logout links/buttons
        const logoutLinks = document.querySelectorAll('[href*="logout"], .logout-btn, a[href="login.html"]');
        
        let logoutCount = 0;
        
        logoutLinks.forEach(link => {
            // Skip if it's actually a login link
            if (link.textContent.toLowerCase().includes('login') && 
                !link.textContent.toLowerCase().includes('logout')) {
                return;
            }
            
            // Check if link text suggests it's a logout button
            if (link.textContent.toLowerCase().includes('logout') || 
                link.textContent.toLowerCase().includes('log out') ||
                link.querySelector('.ri-logout-box-r-line') ||
                link.querySelector('[data-feather="log-out"]')) {
                
                link.addEventListener('click', async function(e) {
                    e.preventDefault();
                    
                    const confirmLogout = confirm('Are you sure you want to logout?');
                    if (!confirmLogout) return;
                    
                    await performLogout();
                });
                
                logoutCount++;
            }
        });
        
        console.log(`🚪 ${logoutCount} logout buttons configured`);
    }
    
    /**
     * Perform logout operation
     */
    async function performLogout() {
        try {
            // Call logout API
            if (window.API && window.API.Auth && window.API.Auth.logout) {
                try {
                    await API.Auth.logout();
                    console.log('✅ Logged out via API');
                } catch (apiError) {
                    console.warn('⚠️ API logout failed, clearing local storage anyway:', apiError);
                }
            }
            
            // Clear local storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            localStorage.removeItem('is_admin');
            
            console.log('✅ Logged out successfully');
            
            // Show success message briefly
            showLogoutMessage();
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 500);
            
        } catch (error) {
            console.error('❌ Logout error:', error);
            // Clear storage anyway and redirect
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            localStorage.removeItem('is_admin');
            window.location.href = 'login.html';
        }
    }
    
    /**
     * Show logout success message
     */
    function showLogoutMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
        messageDiv.style.zIndex = '9999';
        messageDiv.innerHTML = '✅ Logged out successfully! Redirecting...';
        document.body.appendChild(messageDiv);
    }
    
    /**
     * Global function to check if user is authenticated
     */
    window.isAuthenticated = function() {
        return !!localStorage.getItem('auth_token');
    };
    
    /**
     * Global function to get current admin user
     */
    window.getCurrentAdmin = function() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    };
    
    /**
     * Global logout function
     */
    window.adminLogout = async function() {
        await performLogout();
    };
});

