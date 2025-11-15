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
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
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