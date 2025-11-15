// API Base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Get token from localStorage
function getToken() {
    return localStorage.getItem('auth_token');
}

// Set token to localStorage
function setToken(token) {
    localStorage.setItem('auth_token', token);
}

// Remove token
function removeToken() {
    localStorage.removeItem('auth_token');
}

// API Request Helper
async function apiRequest(endpoint, method = 'GET', data = null) {
    console.log(`🌐 [API] Making ${method} request to: ${API_BASE_URL}${endpoint}`);
    console.log('📦 [API] Request data:', data ? JSON.stringify(data).replace(/"password":"[^"]*"/, '"password":"***"') : 'No data');
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🎫 [API] Token attached to request');
    } else {
        console.log('📝 [API] No token found - public request');
    }

    const config = {
        method: method,
        headers: headers
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
    }

    console.log('🔧 [API] Request config:', {
        url: `${API_BASE_URL}${endpoint}`,
        method: config.method,
        headers: config.headers,
        hasBody: !!config.body
    });

    try {
        console.log('📡 [API] Sending request...');
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        console.log(`📊 [API] Response status: ${response.status} ${response.statusText}`);
        console.log('📊 [API] Response headers:', Object.fromEntries(response.headers.entries()));
        
        const result = await response.json();
        console.log('📥 [API] Response data:', result);
        
        if (!response.ok) {
            console.error(`❌ [API] Request failed with status ${response.status}`);
            throw new Error(result.message || `API request failed with status ${response.status}`);
        }
        
        console.log('✅ [API] Request successful');
        return result;
    } catch (error) {
        console.error('❌ [API] Error occurred:', error);
        console.error('❌ [API] Error type:', error.name);
        console.error('❌ [API] Error message:', error.message);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error('❌ [API] Network error - Cannot connect to server at:', API_BASE_URL);
            console.error('💡 [API] Please ensure the Laravel backend is running on http://127.0.0.1:8000');
            throw new Error('Cannot connect to server. Please ensure the backend is running.');
        }
        
        throw error;
    }
}

// Authentication APIs
const Auth = {
    register: (data) => apiRequest('/register', 'POST', data),
    login: (data) => apiRequest('/login', 'POST', data),
    logout: () => apiRequest('/logout', 'POST'),
    getUser: () => apiRequest('/user', 'GET')
};

// Role APIs
const Roles = {
    getAll: () => apiRequest('/roles', 'GET'),
    getById: (id) => apiRequest(`/roles/${id}`, 'GET'),
    create: (data) => apiRequest('/roles', 'POST', data),
    update: (id, data) => apiRequest(`/roles/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/roles/${id}`, 'DELETE'),
    getPermissions: () => apiRequest('/roles/permissions', 'GET')
};

// Export for use
window.API = {
    Auth,
    Roles,
    setToken,
    getToken,
    removeToken
};

console.log('✅ Mixocart API loaded successfully!');