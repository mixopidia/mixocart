<?php
/**
 * Quick API Role Test Script
 * 
 * This script tests if the login API returns role data correctly.
 * Run with: php test-api-role.php
 */

echo "=======================================================\n";
echo "  MIXOCART API ROLE DATA TEST\n";
echo "=======================================================\n\n";

// Configuration
$apiUrl = 'http://127.0.0.1:8000/api/v1/login';
$testEmail = 'admin@fastkart.com';
$testPassword = 'password123';

echo "📡 Testing API: $apiUrl\n";
echo "📧 Email: $testEmail\n";
echo "🔑 Password: " . str_repeat('*', strlen($testPassword)) . "\n\n";

// Prepare request
$data = json_encode([
    'email' => $testEmail,
    'password' => $testPassword
]);

// Initialize cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

echo "🚀 Sending request...\n\n";

// Execute request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Check for cURL errors
if ($error) {
    echo "❌ CURL Error: $error\n";
    echo "\n⚠️  Make sure Laravel server is running:\n";
    echo "   cd main_backend && php artisan serve\n\n";
    exit(1);
}

echo "📊 HTTP Status Code: $httpCode\n\n";

// Parse response
$result = json_decode($response, true);

if ($httpCode === 200 && $result && isset($result['success']) && $result['success']) {
    echo "✅ LOGIN SUCCESSFUL!\n\n";
    
    echo "=======================================================\n";
    echo "  RESPONSE DATA\n";
    echo "=======================================================\n\n";
    
    // Display formatted response
    echo json_encode($result, JSON_PRETTY_PRINT) . "\n\n";
    
    // Check for role data
    echo "=======================================================\n";
    echo "  ROLE DATA VERIFICATION\n";
    echo "=======================================================\n\n";
    
    if (isset($result['user']['role']) && $result['user']['role'] !== null) {
        echo "✅ PASS: Role data is present!\n\n";
        echo "   Role ID: " . $result['user']['role']['id'] . "\n";
        echo "   Role Name: " . $result['user']['role']['name'] . "\n";
        echo "   Role Slug: " . $result['user']['role']['slug'] . "\n\n";
        
        // Check specific role requirements
        if (isset($result['user']['role']['name'])) {
            $roleName = $result['user']['role']['name'];
            echo "🎯 Role-Based Dashboard Access:\n";
            
            if ($roleName === 'Administrator' || $roleName === 'Admin') {
                echo "   ✅ User Dashboard: VISIBLE\n";
                echo "   ✅ Main Dashboard: VISIBLE\n";
            } else {
                echo "   ✅ User Dashboard: VISIBLE\n";
                echo "   ❌ Main Dashboard: HIDDEN\n";
            }
            echo "\n";
        }
        
        echo "✅ FRONTEND INTEGRATION: READY!\n\n";
        echo "   The frontend dashboard navigation will now work correctly.\n";
        echo "   Dashboard links will be shown based on the user's role.\n\n";
        
    } else {
        echo "❌ FAIL: Role data is missing or null!\n\n";
        echo "   This means:\n";
        echo "   - User may not have a role assigned in database\n";
        echo "   - Role relationship may not be loading\n\n";
        echo "   To fix:\n";
        echo "   1. Check if user has role_id in database\n";
        echo "   2. Assign a role to the user:\n";
        echo "      php artisan tinker\n";
        echo "      >>> \$user = User::where('email', '$testEmail')->first();\n";
        echo "      >>> \$user->role_id = 1;\n";
        echo "      >>> \$user->save();\n\n";
    }
    
    echo "=======================================================\n";
    echo "  TOKEN INFORMATION\n";
    echo "=======================================================\n\n";
    
    if (isset($result['token'])) {
        $token = $result['token'];
        $tokenPreview = substr($token, 0, 20) . '...' . substr($token, -10);
        echo "   Token: $tokenPreview\n";
        echo "   Token Type: " . ($result['token_type'] ?? 'N/A') . "\n\n";
        echo "   Use this token for authenticated requests:\n";
        echo "   Authorization: Bearer $token\n\n";
    }
    
} else {
    echo "❌ LOGIN FAILED!\n\n";
    
    if ($httpCode === 401) {
        echo "   Reason: Invalid credentials\n";
        echo "   Please check the email and password.\n\n";
    } elseif ($httpCode === 422) {
        echo "   Reason: Validation error\n";
        if (isset($result['errors'])) {
            echo "   Errors:\n";
            foreach ($result['errors'] as $field => $messages) {
                foreach ($messages as $message) {
                    echo "   - $field: $message\n";
                }
            }
        }
        echo "\n";
    } else {
        echo "   HTTP Code: $httpCode\n";
        echo "   Response: " . ($response ?: 'No response') . "\n\n";
    }
}

echo "=======================================================\n";
echo "  TEST COMPLETE\n";
echo "=======================================================\n\n";

if ($httpCode === 200 && isset($result['user']['role']) && $result['user']['role'] !== null) {
    echo "🎉 ALL CHECKS PASSED! Role data is working correctly!\n\n";
    exit(0);
} else {
    echo "⚠️  Some checks failed. Review the output above.\n\n";
    exit(1);
}

