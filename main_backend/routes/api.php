<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\CustomerDashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no authentication required)
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Protected routes (authentication required)
    Route::middleware('auth:sanctum')->group(function () {
        // Auth routes
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        
        // Customer Dashboard routes
        Route::prefix('customer/dashboard')->group(function () {
            Route::get('/profile', [CustomerDashboardController::class, 'profile']);
            Route::put('/profile', [CustomerDashboardController::class, 'updateProfile']);
            Route::post('/change-password', [CustomerDashboardController::class, 'changePassword']);
            Route::get('/statistics', [CustomerDashboardController::class, 'statistics']);
            Route::get('/orders', [CustomerDashboardController::class, 'recentOrders']);
            Route::get('/activity', [CustomerDashboardController::class, 'activityLog']);
        });
        
        // Role Management routes
        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index']);
            Route::post('/', [RoleController::class, 'store']);
            Route::get('/permissions', [RoleController::class, 'permissions']);
            Route::get('/{id}', [RoleController::class, 'show']);
            Route::put('/{id}', [RoleController::class, 'update']);
            Route::delete('/{id}', [RoleController::class, 'destroy']);
            Route::patch('/{id}/toggle-status', [RoleController::class, 'toggleStatus']);
        });
    });
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Mixocart API is running',
        'timestamp' => now()->toDateTimeString()
    ]);
});