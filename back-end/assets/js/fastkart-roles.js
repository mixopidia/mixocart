// Mixocart Role Management Integration
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🔐 Role Management loaded');
    
    // Check if we're on the role list page
    const roleTable = document.querySelector('#table_id');
    if (!roleTable) {
        console.log('Not on role list page');
        return;
    }
    
    await loadRoles();
    
    async function loadRoles() {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }
            
            // Fetch roles from API
            const response = await API.Roles.getAll();
            
            if (response.success) {
                displayRoles(response.data);
                console.log('✅ Roles loaded:', response.data.length);
            }
        } catch (error) {
            console.error('Error loading roles:', error);
            showAlert('Failed to load roles', 'danger');
        }
    }
    
    function displayRoles(roles) {
        const tbody = roleTable.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows
        
        if (roles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No roles found</td></tr>';
            return;
        }
        
        roles.forEach((role, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${role.name}</strong></td>
                <td>${formatDate(role.created_at)}</td>
                <td>
                    <ul>
                        <li>
                            <a href="create-role.html?id=${role.id}" title="Edit">
                                <i class="ri-pencil-line"></i>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0)" onclick="deleteRole(${role.id}, '${role.name}')" title="Delete">
                                <i class="ri-delete-bin-line"></i>
                            </a>
                        </li>
                    </ul>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Reinitialize DataTable if it exists
        if ($.fn.DataTable) {
            $('#table_id').DataTable({
                retrieve: true,
                responsive: true
            });
        }
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // seconds
        
        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
        if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
        if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
        if (diff < 2592000) return Math.floor(diff / 604800) + ' weeks ago';
        
        return date.toLocaleDateString();
    }
    
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.card-body');
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => alertDiv.remove(), 5000);
    }
    
    // Make deleteRole global for onclick handler
    window.deleteRole = async function(roleId, roleName) {
        if (!confirm(`Are you sure you want to delete role "${roleName}"?`)) {
            return;
        }
        
        try {
            const response = await API.Roles.delete(roleId);
            
            if (response.success) {
                showAlert('Role deleted successfully!', 'success');
                loadRoles(); // Reload the list
            }
        } catch (error) {
            console.error('Error deleting role:', error);
            showAlert(error.message || 'Failed to delete role', 'danger');
        }
    };
});