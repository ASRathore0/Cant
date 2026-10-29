<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminLoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Authenticate administrator and return token.
     */
    public function login(AdminLoginRequest $request): JsonResponse
    {
        $throttleKey = Str::transliterate(Str::lower($request->input('email')) . '|' . $request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'message' => "Too many login attempts. Please try again in {$seconds} seconds.",
                'retry_after' => $seconds,
            ], 429);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit($throttleKey, 300);
            return response()->json([
                'message' => 'The provided credentials do not match our records.',
                'errors' => [
                    'email' => ['Invalid email or password.'],
                ],
            ], 422);
        }

        RateLimiter::clear($throttleKey);

        $canteen = $user->canteen;

        // If login was initiated for a specific restaurant, verify manager belongs to it
        if ($request->filled('canteen_slug') && $user->role === 'manager' && $user->canteen_id) {
            $targetCanteen = \App\Models\Canteen::where('slug', $request->input('canteen_slug'))->first();
            if ($targetCanteen && $user->canteen_id !== $targetCanteen->id) {
                return response()->json([
                    'message' => "Access denied. Your manager credentials belong to '{$canteen->name}', not '{$targetCanteen->name}'. Please log in through the {$canteen->name} portal.",
                    'errors' => [
                        'email' => ["Account belongs to '{$canteen->name}'."],
                    ],
                ], 403);
            }
        }

        // Revoke existing tokens for a clean session
        $user->tokens()->delete();

        $token = $user->createToken('annapoorna-admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'canteen_id' => $user->canteen_id,
                'canteen' => $canteen ? [
                    'id' => $canteen->id,
                    'name' => $canteen->name,
                    'slug' => $canteen->slug,
                    'logo_url' => $canteen->full_logo_url,
                    'primary_color' => $canteen->primary_color,
                    'secondary_color' => $canteen->secondary_color,
                    'accent_color' => $canteen->accent_color,
                    'bg_color' => $canteen->bg_color,
                    'billing_enabled' => (bool) ($canteen->billing_enabled ?? true),
                ] : null,
            ],
        ]);
    }

    /**
     * Terminate administrator session.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Return authenticated admin profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $canteen = $user->canteen;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'canteen_id' => $user->canteen_id,
                'canteen' => $canteen ? [
                    'id' => $canteen->id,
                    'name' => $canteen->name,
                    'slug' => $canteen->slug,
                    'logo_url' => $canteen->full_logo_url,
                    'primary_color' => $canteen->primary_color,
                    'secondary_color' => $canteen->secondary_color,
                    'accent_color' => $canteen->accent_color,
                    'bg_color' => $canteen->bg_color,
                    'billing_enabled' => (bool) ($canteen->billing_enabled ?? true),
                ] : null,
            ],
        ]);
    }
}
