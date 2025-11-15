<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

/**
 * Customer Dashboard Controller
 * 
 * Handles all customer dashboard operations including profile management,
 * statistics, orders, and activity logs.
 */
class CustomerDashboardController extends Controller
{
    /**
     * Get authenticated customer profile
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile(Request $request)
    {
        try {
            $user = $request->user();
            
            // Load role relationship if exists
            $user->load('role');
            
            // Calculate member since
            $memberSince = Carbon::parse($user->created_at);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                    'role' => $user->role ? [
                        'id' => $user->role->id,
                        'name' => $user->role->name,
                    ] : null,
                    'created_at' => $user->created_at,
                    'member_since' => $memberSince->format('F Y'),
                    'account_age_days' => $memberSince->diffInDays(now()),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update customer profile
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change customer password
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();

            // Check if current password is correct
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            // Update password
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to change password',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get customer dashboard statistics
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics(Request $request)
    {
        try {
            $user = $request->user();
            $memberSince = Carbon::parse($user->created_at);
            
            // Placeholder statistics - will be updated when orders module is implemented
            $stats = [
                'total_orders' => 0,
                'total_spent' => 0,
                'pending_orders' => 0,
                'completed_orders' => 0,
                'wishlist_items' => 0,
                'account_age_days' => $memberSince->diffInDays(now()),
                'member_since' => $memberSince->format('F d, Y'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get customer recent orders
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function recentOrders(Request $request)
    {
        try {
            // Placeholder - will be implemented when orders module is created
            return response()->json([
                'success' => true,
                'message' => 'No orders yet',
                'data' => []
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get customer activity log
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function activityLog(Request $request)
    {
        try {
            $user = $request->user();
            
            // Placeholder activity log
            $activities = [
                [
                    'id' => 1,
                    'type' => 'account_created',
                    'description' => 'Account created',
                    'timestamp' => $user->created_at->toDateTimeString(),
                    'formatted_date' => $user->created_at->format('F d, Y g:i A'),
                ],
                [
                    'id' => 2,
                    'type' => 'login',
                    'description' => 'Logged in',
                    'timestamp' => now()->toDateTimeString(),
                    'formatted_date' => 'Just now',
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $activities
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve activity log',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

