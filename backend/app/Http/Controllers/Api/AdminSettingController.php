<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RestaurantSettingRequest;
use App\Models\RestaurantSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminSettingController extends Controller
{
    /**
     * Get all restaurant settings.
     */
    public function index(): JsonResponse
    {
        $settings = RestaurantSetting::getAllSettings();

        // Ensure logo URL is properly formatted
        if (isset($settings['logo_url']) && !Str::startsWith($settings['logo_url'], ['http://', 'https://'])) {
            $settings['full_logo_url'] = url(ltrim($settings['logo_url'], '/'));
        } else {
            $settings['full_logo_url'] = $settings['logo_url'] ?? url('storage/branding/logo.png');
        }

        return response()->json([
            'settings' => $settings,
        ]);
    }

    /**
     * Update restaurant settings with optional logo upload.
     */
    public function update(RestaurantSettingRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Handle logo file upload
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $safeName = 'logo_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('branding', $safeName, 'public');
            $validated['logo_url'] = '/storage/' . $path;
            unset($validated['logo']);
        }

        foreach ($validated as $key => $value) {
            RestaurantSetting::set($key, (string) $value);
        }

        $allSettings = RestaurantSetting::getAllSettings();
        if (isset($allSettings['logo_url']) && !Str::startsWith($allSettings['logo_url'], ['http://', 'https://'])) {
            $allSettings['full_logo_url'] = url(ltrim($allSettings['logo_url'], '/'));
        } else {
            $allSettings['full_logo_url'] = $allSettings['logo_url'] ?? url('storage/branding/logo.png');
        }

        return response()->json([
            'message' => 'Restaurant settings updated successfully',
            'settings' => $allSettings,
        ]);
    }
}
