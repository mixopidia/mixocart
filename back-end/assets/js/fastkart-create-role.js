// Mixocart Create/Edit Role Handler
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📝 Create Role Handler loaded');
    
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.error('❌ No auth token found');
        window.location.href = 'login.html';
        return;
    }
    console.log('✅ Auth token verified');
    
    // Get role ID from URL if editing
    const urlParams = new URLSearchParams(window.location.search);
    const roleId = urlParams.get('id');
    const isEditMode = !!roleId;
    
    console.log(isEditMode ? `✏️ Edit mode - Role ID: ${roleId}` : '➕ Create mode');
    
    // Get form elements - be more specific
    const roleNameInput = document.querySelector('.card-body input[type="text"].form-control');
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Find submit button with multiple strategies
    let submitButton = document.querySelector('button.btn-primary');
    if (!submitButton) {
        submitButton = document.querySelector('button[type="submit"]');
    }
    if (!submitButton) {
        submitButton = Array.from(document.querySelectorAll('button')).find(btn => 
            btn.textContent.trim().toLowerCase().includes('save') ||
            btn.textContent.trim().toLowerCase().includes('submit')
        );
    }
    
    if (submitButton) {
        console.log('✅ Submit button found:', submitButton.textContent.trim());
    } else {
        console.error('❌ Submit button not found!');
    }
    
    console.log(`📋 Found ${allCheckboxes.length} checkboxes total`);
    console.log('📝 Role name input:', roleNameInput ? 'Found' : 'NOT FOUND');
    
    // Update page title if editing
    if (isEditMode) {
        const pageTitle = document.querySelector('.card-header-2 h5');
        if (pageTitle) pageTitle.textContent = 'Edit Role';
    }
    
    // Load permissions from API first (important for edit mode)
    await loadPermissions();
    
    // Small delay to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Load role data if editing (AFTER permissions are loaded)
    if (isEditMode) {
        console.log('📥 Loading role data for editing...');
        await loadRoleData(roleId);
    }
    
    // Setup form submission
    setupFormSubmission();
    
    /**
     * Load available permissions from API
     */
    async function loadPermissions() {
        try {
            const response = await API.Roles.getPermissions();
            
            if (response.success && response.data) {
                console.log('✅ Permissions loaded:', response.data);
                // Permissions are already in HTML, just log for now
                // In future, could dynamically generate permission checkboxes
            }
        } catch (error) {
            console.error('⚠️ Error loading permissions:', error);
            // Continue anyway, form has static permissions
        }
    }
    
    /**
     * Load role data for editing
     */
    async function loadRoleData(id) {
        console.log(`📡 Fetching role data for ID: ${id}...`);
        
        try {
            const response = await API.Roles.getById(id);
            
            console.log('📦 API Response:', response);
            
            if (response.success && response.data) {
                const role = response.data;
                console.log('✅ Role data loaded successfully:', role);
                console.log('📝 Role name:', role.name);
                console.log('🔐 Role permissions:', role.permissions);
                
                // Populate role name
                if (roleNameInput) {
                    roleNameInput.value = role.name;
                    console.log('✅ Role name populated');
                } else {
                    console.error('❌ Role name input not found!');
                }
                
                // Wait a moment for DOM to be fully ready
                await new Promise(resolve => setTimeout(resolve, 50));
                
                // Check permissions if available
                if (role.permissions && Array.isArray(role.permissions)) {
                    console.log(`🔐 Processing ${role.permissions.length} permissions...`);
                    checkPermissions(role.permissions);
                } else {
                    console.warn('⚠️ No permissions found in role data');
                }
                
                return role;
            } else {
                throw new Error(response.message || 'Invalid response from API');
            }
        } catch (error) {
            console.error('❌ Error loading role data:', error);
            console.error('❌ Error details:', {
                message: error.message,
                roleId: id,
                error: error
            });
            showAlert('❌ Failed to load role data: ' + (error.message || 'Unknown error'), 'danger');
            
            // Optionally redirect back to role list after a delay
            setTimeout(() => {
                if (confirm('Failed to load role data. Return to roles list?')) {
                    window.location.href = 'role.html';
                }
            }, 2000);
        }
    }
    
    /**
     * Check permission checkboxes based on role permissions
     */
    function checkPermissions(permissions) {
        console.log('🔍 Checking permissions in edit mode:', permissions);
        
        if (!permissions || permissions.length === 0) {
            console.warn('⚠️ No permissions to check');
            return;
        }
        
        // Find all permission checkboxes dynamically (exclude "checkall" buttons)
        const allPermissionCheckboxes = document.querySelectorAll('input[type="checkbox"]:not(.checkall):not(.checkall1):not(.checkall2):not(.checkall3):not(.checkall4):not(.checkall5):not(.checkall6):not(.checkall7):not(.checkall8):not(.checkall9):not(.checkall10):not(.checkall11)');
        
        console.log(`📋 Found ${allPermissionCheckboxes.length} checkboxes in DOM`);
        
        let checkedCount = 0;
        
        permissions.forEach(permission => {
            const permLower = permission.toLowerCase();
            console.log(`🔎 Looking for permission: ${permLower}`);
            
            // Try to match permission with checkbox
            // Permission format could be: "roles.index" or just "index"
            const permissionParts = permLower.split('.');
            const permissionAction = permissionParts[permissionParts.length - 1]; // Get last part (e.g., "index")
            
            // Find checkbox matching this permission
            const checkbox = Array.from(allPermissionCheckboxes).find(cb => {
                const label = cb.nextElementSibling;
                if (!label) return false;
                
                const labelText = label.textContent.trim().toLowerCase();
                
                // Check if label text matches the permission action
                if (labelText === permissionAction) {
                    // Also verify the module matches by checking the parent ul
                    const ul = cb.closest('ul');
                    if (ul && permissionParts.length > 1) {
                        const moduleElement = ul.querySelector('li:first-child');
                        if (moduleElement) {
                            const moduleName = moduleElement.textContent.replace(':', '').trim().toLowerCase();
                            return moduleName === permissionParts[0];
                        }
                    }
                    return true;
                }
                
                // Fallback: check if full permission is in label
                return labelText.includes(permissionAction);
            });
            
            if (checkbox) {
                checkbox.checked = true;
                checkedCount++;
                console.log(`✅ Checked: ${permission}`);
            } else {
                console.warn(`⚠️ Checkbox not found for: ${permission}`);
            }
        });
        
        console.log(`✅ ${checkedCount} of ${permissions.length} permissions checked in edit mode`);
    }
    
    /**
     * Setup form submission handler
     */
    function setupFormSubmission() {
        if (!submitButton) {
            console.error('❌ Cannot setup form submission - button not found');
            return;
        }
        
        submitButton.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('🚀 Form submit button clicked');
            await handleSubmit();
        });
        
        // Also handle form submission if button is inside a form
        const form = submitButton.closest('form');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                console.log('🚀 Form submitted via submit event');
                await handleSubmit();
            });
        }
        
        console.log('✅ Form submission handler ready');
    }
    
    /**
     * Handle form submission
     */
    async function handleSubmit() {
        console.log('📤 Starting form submission...');
        
        // Validate role name
        const roleName = roleNameInput ? roleNameInput.value.trim() : '';
        console.log('📝 Role name:', roleName);
        
        if (!roleName) {
            console.warn('⚠️ Role name is empty');
            showAlert('Please enter a role name', 'warning');
            if (roleNameInput) roleNameInput.focus();
            return;
        }
        
        // Disable submit button to prevent double submission
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
        }
        
        // Collect selected permissions
        const selectedPermissions = [];
        const permissionCheckboxes = document.querySelectorAll('input[type="checkbox"]:not(.checkall):not(.checkall1):not(.checkall2):not(.checkall3):not(.checkall4):not(.checkall5):not(.checkall6):not(.checkall7):not(.checkall8):not(.checkall9):not(.checkall10):not(.checkall11)');
        
        console.log(`🔍 Checking ${permissionCheckboxes.length} permission checkboxes...`);
        
        permissionCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const label = checkbox.nextElementSibling;
                if (label) {
                    const permissionName = label.textContent.trim().toLowerCase();
                    
                    // Get the parent ul element to find the module name
                    const ul = checkbox.closest('ul');
                    if (ul) {
                        const moduleElement = ul.querySelector('li:first-child');
                        if (moduleElement) {
                            const moduleName = moduleElement.textContent.replace(':', '').trim().toLowerCase();
                            const fullPermission = `${moduleName}.${permissionName}`;
                            selectedPermissions.push(fullPermission);
                            console.log('✅ Added permission:', fullPermission);
                        }
                    }
                }
            }
        });
        
        console.log('📋 Total selected permissions:', selectedPermissions.length);
        console.log('📋 Permissions array:', selectedPermissions);
        
        if (selectedPermissions.length === 0) {
            console.warn('⚠️ No permissions selected');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Save';
            }
            showAlert('Please select at least one permission', 'warning');
            return;
        }
        
        // Prepare data for API
        const roleData = {
            name: roleName,
            permissions: selectedPermissions
        };
        
        console.log('📦 Sending data to API:', JSON.stringify(roleData, null, 2));
        
        try {
            let response;
            
            if (isEditMode) {
                console.log(`📡 Updating role ID ${roleId}...`);
                response = await API.Roles.update(roleId, roleData);
                console.log('✅ API Response (Update):', response);
            } else {
                console.log('📡 Creating new role...');
                response = await API.Roles.create(roleData);
                console.log('✅ API Response (Create):', response);
            }
            
            if (response.success) {
                console.log('✅ Role saved successfully!');
                showAlert(
                    isEditMode ? '✅ Role updated successfully!' : '✅ Role created successfully!',
                    'success'
                );
                
                // Redirect to roles list after 1 second
                console.log('🔄 Redirecting to role.html in 1 second...');
                setTimeout(() => {
                    window.location.href = 'role.html';
                }, 1000);
            } else {
                throw new Error(response.message || 'Failed to save role');
            }
        } catch (error) {
            console.error('❌ Error saving role:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response
            });
            
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Save';
            }
            
            showAlert(
                '❌ ' + (error.message || 'Failed to save role. Please try again.'),
                'danger'
            );
        }
    }
    
    /**
     * Show alert message
     */
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const cardBody = document.querySelector('.card-body');
        if (cardBody) {
            cardBody.insertBefore(alertDiv, cardBody.firstChild);
        }
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => alertDiv.remove(), 5000);
    }
    
    console.log('✅ Create/Edit Role Handler initialized');
});

