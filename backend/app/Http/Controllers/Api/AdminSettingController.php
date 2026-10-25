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
     * Get restaurant settings.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $canteen = null;

        if ($request->filled('canteen_id')) {
            $canteen = \App\Models\Canteen::find($request->query('canteen_id'));
        } elseif ($request->filled('canteen')) {
            $canteen = \App\Models\Canteen::where('slug', $request->query('canteen'))->first();
        } elseif ($user && $user->canteen_id) {
            $canteen = \App\Models\Canteen::find($user->canteen_id);
        } else {
            $canteen = \App\Models\Canteen::getDefault();
        }

        if ($canteen) {
            return response()->json([
                'settings' => $canteen->toSettingsArray(),
            ]);
        }

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
        $user = $request->user();
        $validated = $request->validated();

        // Handle logo file upload
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $safeName = 'logo_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('branding', $safeName, 'public');
            $validated['logo_url'] = '/storage/' . $path;
            unset($validated['logo']);
        }

        $canteen = null;
        if ($request->filled('canteen_id')) {
            $canteen = \App\Models\Canteen::find($request->input('canteen_id'));
        } elseif ($user && $user->canteen_id) {
            $canteen = \App\Models\Canteen::find($user->canteen_id);
        } else {
            $canteen = \App\Models\Canteen::getDefault();
        }

        if ($canteen) {

            if (isset($validated['restaurant_name'])) {
                $canteen->name = $validated['restaurant_name'];
            }
            if (isset($validated['logo_url'])) {
                $canteen->logo_url = $validated['logo_url'];
            }
            if (isset($validated['army_discount_enabled'])) {
                $canteen->discount_badge_enabled = filter_var($validated['army_discount_enabled'], FILTER_VALIDATE_BOOLEAN);
            }
            if (isset($validated['army_discount_text'])) {
                $canteen->discount_badge_text = $validated['army_discount_text'];
            }

            foreach ($validated as $key => $value) {
                if (!in_array($key, ['restaurant_name', 'logo', 'logo_url', 'army_discount_enabled', 'army_discount_text']) && in_array($key, $canteen->getFillable())) {
                    $canteen->$key = $value;
                }
            }

            $canteen->save();

            return response()->json([
                'message' => "Settings for '{$canteen->name}' updated successfully",
                'settings' => $canteen->toSettingsArray(),
            ]);
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
