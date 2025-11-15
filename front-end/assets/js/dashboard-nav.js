// Dashboard Navigation Handler - Role-Based Dashboard System
console.log('🎯 [LOAD] Dashboard Navigation script loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 [INIT] Dashboard Navigation initialized');
    
    // Get user data from localStorage
    const userData = localStorage.getItem('user_data');
    const token = localStorage.getItem('auth_token');
    
    console.log('🔍 [CHECK] Token exists:', !!token);
    console.log('🔍 [CHECK] User data exists:', !!userData);
    
    if (!userData || !token) {
        console.log('⚠️ [AUTH] No user logged in - showing login links');
        showLoginLinks();
        return;
    }
    
    try {
        const user = JSON.parse(userData);
        console.log('👤 [USER] Name:', user.name);
        console.log('📧 [USER] Email:', user.email);
        console.log('🏷️ [USER] Role:', user.role?.name || 'No role assigned');
        
        // Show logout section (hide login links)
        showLoggedInState(user);
        
        // Get dashboard links
        const adminDashboardLink = document.querySelector('.admin-dashboard-link');
        const userDashboardLink = document.querySelector('.user-dashboard-link');
        
        // Check user role and show appropriate dashboard links
        if (user.role && (user.role.name === 'Administrator' || user.role.name === 'Admin')) {
            // Show admin dashboard for administrators
            if (adminDashboardLink) {
                adminDashboardLink.style.display = 'block';
                console.log('✅ [ADMIN] Main Dashboard link shown for Administrator');
            } else {
                console.warn('⚠️ [ADMIN] Admin dashboard link element not found in DOM');
            }
            
            // Show user dashboard too (admins can access both)
            if (userDashboardLink) {
                userDashboardLink.style.display = 'block';
                console.log('✅ [ADMIN] User Dashboard link shown for Administrator');
            }
        } else {
            // Hide admin dashboard for regular users
            if (adminDashboardLink) {
                adminDashboardLink.style.display = 'none';
                console.log('ℹ️ [USER] Main Dashboard link hidden (not admin)');
            }
            
            // Show only user dashboard for regular users
            if (userDashboardLink) {
                userDashboardLink.style.display = 'block';
                console.log('✅ [USER] User Dashboard link shown');
            }
        }
        
        // Update profile name in dropdown
        updateProfileName(user);
        
        console.log('✅ [READY] Dashboard navigation ready!');
        console.log('-----------------------------------------------------------');
        
    } catch (error) {
        console.error('❌ [ERROR] Error parsing user data:', error);
        console.error('❌ [ERROR] Raw user data:', userData);
        showLoginLinks();
    }
});

// Show login links (hide logout section)
function showLoginLinks() {
    const loginLinks = document.querySelectorAll('.login-links');
    const logoutSection = document.querySelectorAll('.logout-section');
    
    loginLinks.forEach(link => {
        link.style.display = 'block';
    });
    
    logoutSection.forEach(section => {
        section.style.display = 'none';
    });
    
    console.log('👋 [UI] Login links shown');
}

// Show logged in state (hide login links, show logout section)
function showLoggedInState(user) {
    const loginLinks = document.querySelectorAll('.login-links');
    const logoutSection = document.querySelectorAll('.logout-section');
    
    loginLinks.forEach(link => {
        link.style.display = 'none';
    });
    
    logoutSection.forEach(section => {
        section.style.display = 'block';
    });
    
    // Update account greeting
    const accountGreeting = document.querySelector('.delivery-detail h6');
    if (accountGreeting) {
        accountGreeting.textContent = `Hello, ${user.name.split(' ')[0]}!`;
    }
    
    const accountTitle = document.querySelector('.delivery-detail h5');
    if (accountTitle) {
        accountTitle.textContent = user.role?.name || 'My Account';
    }
    
    console.log('✅ [UI] Logged in state shown');
}

// Update profile name in various locations
function updateProfileName(user) {
    // Update in dropdown
    const profileName = document.querySelector('.profile-name, .user-name');
    if (profileName) {
        profileName.textContent = user.name;
        console.log('✅ [UI] Profile name updated:', user.name);
    }
    
    // Update in dashboard sidebar if exists
    const dashboardProfileName = document.querySelector('.profile-name h3');
    if (dashboardProfileName) {
        dashboardProfileName.textContent = user.name;
    }
    
    const dashboardEmail = document.querySelector('.profile-name h6');
    if (dashboardEmail) {
        dashboardEmail.textContent = user.email;
    }
}

// Global logout function
window.logout = function() {
    console.log('🚪 [LOGOUT] User logging out...');
    
    // Clear all auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('is_admin');
    
    console.log('🗑️ [LOGOUT] Auth data cleared');
    console.log('🔄 [LOGOUT] Redirecting to login page...');
    
    // Redirect to login
    window.location.href = 'login.html';
};

// Attach logout to logout button
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
        console.log('🔗 [INIT] Logout button event attached');
    }
});

console.log('✅ [LOADED] Dashboard Navigation script loaded successfully');

