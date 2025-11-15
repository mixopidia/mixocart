<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    /**
     * Get all roles
     */
    public function index(Request $request)
    {
        try {
            $query = Role::query();

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->boolean('status'));
            }

            // Get all or paginated
            if ($request->boolean('all')) {
                $roles = $query->get();
                return response()->json([
                    'success' => true,
                    'data' => $roles
                ]);
            }

            $roles = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $roles->items(),
                'pagination' => [
                    'total' => $roles->total(),
                    'per_page' => $roles->perPage(),
                    'current_page' => $roles->currentPage(),
                    'last_page' => $roles->lastPage(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch roles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new role
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $role = Role::create([
                'name' => $request->name,
                'slug' => \Illuminate\Support\Str::slug($request->name),
                'description' => $request->description,
                'permissions' => $request->permissions ?? [],
                'status' => $request->status ?? true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Role created successfully',
                'data' => $role
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single role
     */
    public function show($id)
    {
        try {
            $role = Role::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $role
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found'
            ], 404);
        }
    }

    /**
     * Update role
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name,' . $id,
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $role = Role::findOrFail($id);

            $role->update([
                'name' => $request->name,
                'slug' => \Illuminate\Support\Str::slug($request->name),
                'description' => $request->description,
                'permissions' => $request->permissions ?? [],
                'status' => $request->status ?? $role->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Role updated successfully',
                'data' => $role
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete role
     */
    public function destroy($id)
    {
        try {
            $role = Role::findOrFail($id);

            // Prevent deleting role if users are assigned
            if ($role->users()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete role with assigned users'
                ], 422);
            }

            $role->delete();

            return response()->json([
                'success' => true,
                'message' => 'Role deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all available permissions
     */
    public function permissions()
    {
        try {
            $permissions = config('permissions');

            return response()->json([
                'success' => true,
                'data' => $permissions
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch permissions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle role status
     */
    public function toggleStatus($id)
    {
        try {
            $role = Role::findOrFail($id);
            $role->status = !$role->status;
            $role->save();

            return response()->json([
                'success' => true,
                'message' => 'Role status updated',
                'data' => $role
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}