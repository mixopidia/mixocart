// Mixocart Authentication Check & Logout
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Auth Check loaded');
    
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
        const user = JSON.parse(userData);
        console.log('✅ User logged in:', user.name);
        
        // Update navigation to show user info
        updateNavigation(user);
    } else {
        console.log('❌ User not logged in');
    }
    
    // Setup logout button click handlers
    setupLogoutButtons();
    
    function updateNavigation(user) {
        // Hide login links, show logout section
        const loginLinks = document.querySelectorAll('.login-links');
        const logoutSections = document.querySelectorAll('.logout-section');
        
        loginLinks.forEach(el => el.style.display = 'none');
        logoutSections.forEach(el => el.style.display = 'block');
        
        console.log(`🔄 Navigation updated: ${loginLinks.length} login links hidden, ${logoutSections.length} logout sections shown`);
        
        // Find "My Account" link in navigation
        const myAccountLinks = document.querySelectorAll('a[href*="user-dashboard"], a[href*="my-account"]');
        
        myAccountLinks.forEach(link => {
            const textElement = link.querySelector('span') || link;
            if (textElement.textContent.includes('My Account') || textElement.textContent.includes('Hello')) {
                textElement.textContent = `Hello, ${user.name.split(' ')[0]}`;
            }
        });
        
        // Update any "Hello, My Account" text
        const accountButtons = document.querySelectorAll('.header-nav-right button, .user-name');
        accountButtons.forEach(btn => {
            if (btn.textContent.includes('Hello') || btn.textContent.includes('My Account')) {
                btn.textContent = `Hello, ${user.name.split(' ')[0]}`;
            }
        });
    }
    
    function setupLogoutButtons() {
        // Find all logout links/buttons
        const logoutButtons = document.querySelectorAll('[href*="logout"], .logout-btn, #logoutBtn');
        
        logoutButtons.forEach(button => {
            button.addEventListener('click', async function(e) {
                e.preventDefault();
                
                const confirmLogout = confirm('Are you sure you want to logout?');
                if (!confirmLogout) return;
                
                try {
                    // Call logout API
                    await API.Auth.logout();
                    
                    // Clear local storage
                    API.removeToken();
                    localStorage.removeItem('user_data');
                    
                    // Show success message
                    console.log('✅ Logged out successfully');
                    
                    // Redirect to login page
                    window.location.href = 'login.html';
                    
                } catch (error) {
                    console.error('Logout error:', error);
                    // Even if API fails, clear local data and redirect
                    API.removeToken();
                    localStorage.removeItem('user_data');
                    window.location.href = 'login.html';
                }
            });
        });
        
        console.log(`✅ ${logoutButtons.length} logout buttons found and configured`);
    }
    
    // Function to check if user is authenticated (for use in other scripts)
    window.checkAuth = function() {
        const token = localStorage.getItem('auth_token');
        return !!token;
    };
    
    // Function to get current user (for use in other scripts)
    window.getCurrentUser = function() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    };
    
    // Function to manually logout (for use in other scripts)
    window.logout = async function() {
        try {
            await API.Auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
        API.removeToken();
        localStorage.removeItem('user_data');
        window.location.href = 'login.html';
    };
});