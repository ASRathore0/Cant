<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Canteen;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\RestaurantSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminCanteenController extends Controller
{
    /**
     * List all canteens with their counts and active status.
     */
    public function index(): JsonResponse
    {
        $canteens = Canteen::withCount(['categories', 'menuItems'])
            ->with(['managers:id,name,email,role,canteen_id,created_at'])
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($canteen) {
                return array_merge($canteen->toArray(), [
                    'full_logo_url' => $canteen->full_logo_url,
                ]);
            });

        return response()->json([
            'canteens' => $canteens,
            'default_canteen' => Canteen::getDefault(),
        ]);
    }

    /**
     * Show a single canteen.
     */
    public function show(int $id): JsonResponse
    {
        $canteen = Canteen::with(['categories.menuItems'])->findOrFail($id);

        return response()->json([
            'canteen' => array_merge($canteen->toArray(), [
                'full_logo_url' => $canteen->full_logo_url,
            ]),
        ]);
    }

    /**
     * Onboard a brand new canteen.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'page_title' => ['nullable', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:150', 'unique:canteens,slug'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'logo_url' => ['nullable', 'string', 'max:1000'],
            'favicon_url' => ['nullable', 'string', 'max:1000'],
            'primary_color' => ['nullable', 'string', 'max:30'],
            'secondary_color' => ['nullable', 'string', 'max:30'],
            'accent_color' => ['nullable', 'string', 'max:30'],
            'bg_color' => ['nullable', 'string', 'max:30'],
            'theme_preset' => ['nullable', 'string', 'max:50'],
            'dietary_type' => ['nullable', 'string', 'max:50'],
            'pure_veg_label' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:500'],
            'location_landmark' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'opening_hours' => ['nullable', 'string', 'max:255'],
            'hero_heading' => ['nullable', 'string', 'max:255'],
            'hero_subheading' => ['nullable', 'string', 'max:1000'],
            'hero_badge' => ['nullable', 'string', 'max:100'],
            'hero_trio' => ['nullable'],
            'announcement_enabled' => ['nullable', 'boolean'],
            'announcement_text' => ['nullable', 'string', 'max:500'],
            'discount_badge_enabled' => ['nullable', 'boolean'],
            'discount_badge_title' => ['nullable', 'string', 'max:100'],
            'discount_badge_text' => ['nullable', 'string', 'max:500'],
            'qr_target_url' => ['nullable', 'string', 'max:500'],
            'is_default' => ['nullable', 'boolean'],
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:5120'],
            'favicon' => ['nullable', 'file', 'mimes:ico,png,svg,jpg,jpeg,webp', 'max:2048'],
            'clone_from_canteen_id' => ['nullable', 'exists:canteens,id'],
            'manager_name' => ['nullable', 'string', 'max:150'],
            'manager_email' => ['nullable', 'email', 'max:150', 'unique:users,email'],
            'manager_password' => ['nullable', 'string', 'min:6'],
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(4);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        // Handle logo file upload
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $safeName = 'logo_' . Str::slug($validated['name']) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('branding', $safeName, 'public');
            $validated['logo_url'] = '/storage/' . $path;
            unset($validated['logo']);
        }

        // Handle favicon file upload
        if ($request->hasFile('favicon')) {
            $file = $request->file('favicon');
            $safeName = 'favicon_' . Str::slug($validated['name']) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('branding', $safeName, 'public');
            $validated['favicon_url'] = '/storage/' . $path;
            unset($validated['favicon']);
        }

        // Set default values if not passed
        $validated['primary_color'] = $validated['primary_color'] ?? '#062D1F';
        $validated['secondary_color'] = $validated['secondary_color'] ?? '#07402A';
        $validated['accent_color'] = $validated['accent_color'] ?? '#E8C928';
        $validated['bg_color'] = $validated['bg_color'] ?? '#F8F6F0';
        $validated['theme_preset'] = $validated['theme_preset'] ?? 'emerald';
        $validated['dietary_type'] = $validated['dietary_type'] ?? 'pure_veg';
        $validated['pure_veg_label'] = $validated['pure_veg_label'] ?? '100% Pure Vegetarian';
        $validated['is_active'] = true;

        if (array_key_exists('hero_trio', $validated)) {
            if (is_string($validated['hero_trio'])) {
                $validated['hero_trio'] = json_decode($validated['hero_trio'], true);
            }
        }

        if (!empty($validated['is_default'])) {
            Canteen::where('id', '>', 0)->update(['is_default' => false]);
        }

        $cloneFromId = $validated['clone_from_canteen_id'] ?? null;
        unset($validated['clone_from_canteen_id']);

        $managerName = $validated['manager_name'] ?? null;
        $managerEmail = $validated['manager_email'] ?? null;
        $managerPassword = $validated['manager_password'] ?? null;
        unset($validated['manager_name'], $validated['manager_email'], $validated['manager_password']);

        $canteen = Canteen::create($validated);

        // Create manager account if provided
        $manager = null;
        if (!empty($managerEmail)) {
            $manager = User::create([
                'name' => $managerName ?: ($canteen->name . ' Manager'),
                'email' => $managerEmail,
                'password' => $managerPassword ?: 'Password@123',
                'role' => 'manager',
                'canteen_id' => $canteen->id,
                'email_verified_at' => now(),
            ]);
        }

        // Optionally clone menu from another canteen
        if ($cloneFromId) {
            $this->performCloneMenu($cloneFromId, $canteen->id);
        }

        return response()->json([
            'message' => "Establishment '{$canteen->name}' onboarded successfully!",
            'canteen' => array_merge($canteen->toArray(), [
                'full_logo_url' => $canteen->full_logo_url,
                'managers' => $manager ? [$manager] : [],
            ]),
        ], 201);
    }

    /**
     * Create or update a manager account for a canteen.
     */
    public function upsertManager(Request $request, int $id): JsonResponse
    {
        $canteen = Canteen::findOrFail($id);

        $validated = $request->validate([
            'manager_id' => ['nullable', 'exists:users,id'],
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150'],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        if (!empty($validated['manager_id'])) {
            $manager = User::where('canteen_id', $canteen->id)->findOrFail($validated['manager_id']);
            $manager->name = $validated['name'];
            $manager->email = $validated['email'];
            if (!empty($validated['password'])) {
                $manager->password = $validated['password'];
            }
            $manager->save();
        } else {
            $existing = User::where('email', $validated['email'])->first();
            if ($existing) {
                return response()->json(['message' => 'A user with this email already exists.'], 422);
            }

            $manager = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'] ?: 'Password@123',
                'role' => 'manager',
                'canteen_id' => $canteen->id,
                'email_verified_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Manager account updated successfully!',
            'manager' => [
                'id' => $manager->id,
                'name' => $manager->name,
                'email' => $manager->email,
                'role' => $manager->role,
                'canteen_id' => $manager->canteen_id,
            ],
        ]);
    }

    /**
     * Update canteen branding, theme, colors, logo, and identity.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $canteen = Canteen::findOrFail($id);

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:150'],
            'page_title' => ['nullable', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:150', 'unique:canteens,slug,' . $id],
            'tagline' => ['nullable', 'string', 'max:255'],
            'logo_url' => ['nullable', 'string', 'max:1000'],
            'favicon_url' => ['nullable', 'string', 'max:1000'],
            'primary_color' => ['nullable', 'string', 'max:30'],
            'secondary_color' => ['nullable', 'string', 'max:30'],
            'accent_color' => ['nullable', 'string', 'max:30'],
            'bg_color' => ['nullable', 'string', 'max:30'],
            'theme_preset' => ['nullable', 'string', 'max:50'],
            'dietary_type' => ['nullable', 'string', 'max:50'],
            'pure_veg_label' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:500'],
            'location_landmark' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'opening_hours' => ['nullable', 'string', 'max:255'],
            'hero_heading' => ['nullable', 'string', 'max:255'],
            'hero_subheading' => ['nullable', 'string', 'max:1000'],
            'hero_badge' => ['nullable', 'string', 'max:100'],
            'hero_trio' => ['nullable'],
            'announcement_enabled' => ['nullable'],
            'announcement_text' => ['nullable', 'string', 'max:500'],
            'discount_badge_enabled' => ['nullable'],
            'discount_badge_title' => ['nullable', 'string', 'max:100'],
            'discount_badge_text' => ['nullable', 'string', 'max:500'],
            'qr_target_url' => ['nullable', 'string', 'max:500'],
            'is_active' => ['nullable'],
            'is_default' => ['nullable'],
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:5120'],
            'favicon' => ['nullable', 'file', 'mimes:ico,png,svg,jpg,jpeg,webp', 'max:2048'],
            'trio_file_0' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg,gif', 'max:5120'],
            'trio_file_1' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg,gif', 'max:5120'],
            'trio_file_2' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg,gif', 'max:5120'],
        ]);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $canteenName = $validated['name'] ?? $canteen->name;
            $safeName = 'logo_' . Str::slug($canteenName) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('branding', $safeName, 'public');
            $validated['logo_url'] = '/storage/' . $path;
            unset($validated['logo']);
        }

        if ($request->hasFile('favicon')) {
            $file = $request->file('favicon');
            $canteenName = $validated['name'] ?? $canteen->name;
            $safeName = 'favicon_' . Str::slug($canteenName) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('branding', $safeName, 'public');
            $validated['favicon_url'] = '/storage/' . $path;
            unset($validated['favicon']);
        }

        // Format boolean fields properly
        if (isset($validated['announcement_enabled'])) {
            $validated['announcement_enabled'] = filter_var($validated['announcement_enabled'], FILTER_VALIDATE_BOOLEAN);
        }
        if (isset($validated['discount_badge_enabled'])) {
            $validated['discount_badge_enabled'] = filter_var($validated['discount_badge_enabled'], FILTER_VALIDATE_BOOLEAN);
        }
        if (isset($validated['is_active'])) {
            $validated['is_active'] = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);
        }
        if (!empty($validated['is_default'])) {
            $isDefault = filter_var($validated['is_default'], FILTER_VALIDATE_BOOLEAN);
            if ($isDefault) {
                Canteen::where('id', '!=', $id)->update(['is_default' => false]);
                $validated['is_default'] = true;
            }
        }

        if (array_key_exists('hero_trio', $validated)) {
            if (is_string($validated['hero_trio'])) {
                $validated['hero_trio'] = json_decode($validated['hero_trio'], true);
            }
        }

        // Handle uploaded trio sticker files if sent along with form
        if (isset($validated['hero_trio']) && is_array($validated['hero_trio'])) {
            $trioArray = $validated['hero_trio'];
            for ($i = 0; $i < 3; $i++) {
                if ($request->hasFile("trio_file_{$i}")) {
                    $file = $request->file("trio_file_{$i}");
                    $safeName = 'sticker_' . time() . '_' . $i . '_' . Str::random(6) . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('stickers', $safeName, 'public');
                    if (isset($trioArray[$i])) {
                        $trioArray[$i]['stickerUrl'] = '/storage/' . $path;
                    }
                }
            }
            $validated['hero_trio'] = $trioArray;
        }

        $canteen->update($validated);

        // If this is the default canteen, also sync with restaurant_settings for legacy backwards compatibility
        if ($canteen->is_default) {
            foreach ($canteen->toSettingsArray() as $k => $v) {
                if (is_scalar($v) || is_null($v)) {
                    RestaurantSetting::set($k, (string) $v);
                } elseif (is_array($v)) {
                    RestaurantSetting::set($k, json_encode($v));
                }
            }
        }

        $canteenPayload = array_merge($canteen->toArray(), [
            'full_logo_url' => $canteen->full_logo_url,
        ]);

        return response()->json([
            'message' => "Canteen '{$canteen->name}' settings & theme updated successfully!",
            'canteen' => $canteenPayload,
            'data' => $canteenPayload,
        ]);
    }

    /**
     * Delete a canteen.
     */
    public function destroy(int $id): JsonResponse
    {
        if (Canteen::count() <= 1) {
            return response()->json([
                'message' => 'Cannot delete the only canteen in the system.',
            ], 422);
        }

        $canteen = Canteen::findOrFail($id);

        if ($canteen->is_default) {
            // Assign default to another canteen before deleting
            $other = Canteen::where('id', '!=', $id)->first();
            if ($other) {
                $other->update(['is_default' => true]);
            }
        }

        $canteen->delete();

        return response()->json([
            'message' => 'Canteen deleted successfully',
        ]);
    }

    /**
     * Set a canteen as the primary/default canteen.
     */
    public function setDefault(int $id): JsonResponse
    {
        $canteen = Canteen::findOrFail($id);
        Canteen::where('id', '!=', $id)->update(['is_default' => false]);
        $canteen->update(['is_default' => true, 'is_active' => true]);

        // Sync with legacy settings
        foreach ($canteen->toSettingsArray() as $k => $v) {
            if (is_scalar($v) || is_null($v)) {
                RestaurantSetting::set($k, (string) $v);
            }
        }

        return response()->json([
            'message' => "'{$canteen->name}' is now set as the primary default canteen.",
            'canteen' => $canteen,
        ]);
    }

    /**
     * Clone menu items and categories from one canteen to another.
     */
    public function cloneMenu(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'from_canteen_id' => ['required', 'exists:canteens,id'],
        ]);

        $this->performCloneMenu($request->from_canteen_id, $id);

        return response()->json([
            'message' => 'Menu categories and items successfully cloned!',
        ]);
    }

    private function performCloneMenu(int $sourceId, int $targetId): void
    {
        $sourceCategories = Category::where('canteen_id', $sourceId)->with('menuItems')->get();

        foreach ($sourceCategories as $cat) {
            $newCat = Category::create([
                'canteen_id' => $targetId,
                'name' => $cat->name,
                'slug' => $cat->slug . '-' . $targetId . '-' . Str::random(3),
                'description' => $cat->description,
                'sort_order' => $cat->sort_order,
                'is_active' => $cat->is_active,
            ]);

            foreach ($cat->menuItems as $item) {
                MenuItem::create([
                    'canteen_id' => $targetId,
                    'category_id' => $newCat->id,
                    'name' => $item->name,
                    'slug' => $item->slug . '-' . $targetId . '-' . Str::random(3),
                    'description' => $item->description,
                    'price_type' => $item->price_type,
                    'price' => $item->price,
                    'price_max' => $item->price_max,
                    'pricing_note' => $item->pricing_note,
                    'image_path' => $item->image_path,
                    'serving_info' => $item->serving_info,
                    'is_available' => $item->is_available,
                    'is_featured' => $item->is_featured,
                    'sort_order' => $item->sort_order,
                ]);
            }
        }
    }

    /**
     * Emulate/impersonate a canteen's manager without password (Super Admin only).
     */
    public function emulateManager(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        if ($currentUser->role !== 'super_admin' && $currentUser->role !== 'superadmin') {
            return response()->json([
                'message' => 'Unauthorized: Only Super Administrators can emulate manager accounts.',
            ], 403);
        }

        $canteen = Canteen::findOrFail($id);

        // Find existing manager for this canteen
        $manager = User::where('canteen_id', $canteen->id)
            ->where('role', 'manager')
            ->first();

        // If no manager found, automatically create an active manager account for this establishment
        if (!$manager) {
            $safeSlug = Str::slug($canteen->slug ?: $canteen->name);
            $manager = User::create([
                'name' => $canteen->name . ' Manager',
                'email' => "manager.{$safeSlug}@canteen.internal",
                'password' => Hash::make(Str::random(16)),
                'role' => 'manager',
                'canteen_id' => $canteen->id,
                'email_verified_at' => now(),
            ]);
        }

        // Generate Sanctum token for the manager without requiring password
        $token = $manager->createToken('emulated-by-' . $currentUser->email)->plainTextToken;

        return response()->json([
            'message' => "Successfully emulating {$manager->name} for {$canteen->name}",
            'token' => $token,
            'user' => [
                'id' => $manager->id,
                'name' => $manager->name,
                'email' => $manager->email,
                'role' => $manager->role,
                'canteen_id' => $manager->canteen_id,
                'canteen' => [
                    'id' => $canteen->id,
                    'name' => $canteen->name,
                    'slug' => $canteen->slug,
                    'logo_url' => $canteen->full_logo_url,
                    'primary_color' => $canteen->primary_color,
                    'secondary_color' => $canteen->secondary_color,
                    'accent_color' => $canteen->accent_color,
                    'bg_color' => $canteen->bg_color,
                ],
            ],
            'canteen' => $canteen,
        ]);
    }

    /**
     * Emulate a specific user directly (Super Admin only).
     */
    public function emulateUser(Request $request, int $id): JsonResponse
    {
        $currentUser = $request->user();
        if ($currentUser->role !== 'super_admin' && $currentUser->role !== 'superadmin') {
            return response()->json([
                'message' => 'Unauthorized: Only Super Administrators can emulate accounts.',
            ], 403);
        }

        $targetUser = User::with('canteen')->findOrFail($id);
        $canteen = $targetUser->canteen;

        $token = $targetUser->createToken('emulated-by-' . $currentUser->email)->plainTextToken;

        return response()->json([
            'message' => "Successfully emulating {$targetUser->name}",
            'token' => $token,
            'user' => [
                'id' => $targetUser->id,
                'name' => $targetUser->name,
                'email' => $targetUser->email,
                'role' => $targetUser->role,
                'canteen_id' => $targetUser->canteen_id,
                'canteen' => $canteen ? [
                    'id' => $canteen->id,
                    'name' => $canteen->name,
                    'slug' => $canteen->slug,
                    'logo_url' => $canteen->full_logo_url,
                    'primary_color' => $canteen->primary_color,
                    'secondary_color' => $canteen->secondary_color,
                    'accent_color' => $canteen->accent_color,
                    'bg_color' => $canteen->bg_color,
                ] : null,
            ],
            'canteen' => $canteen,
        ]);
    }

    /**
     * Upload an icon, sticker or delicacy image for hero showcase or branding.
     */
    public function uploadMedia(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,svg,gif', 'max:5120'],
            'folder' => ['nullable', 'string', 'in:stickers,branding,delicacies'],
        ]);

        $folder = $request->input('folder', 'stickers');
        $file = $request->file('image');
        $safeName = 'sticker_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();

        // 1. Store via standard Laravel storage disk
        $path = $file->storeAs($folder, $safeName, 'public');

        // 2. Direct copy to public_path($folder) - bypasses symlinks entirely (prevents 403 Forbidden on Hostinger/Apache)
        $publicDir = public_path($folder);
        if (!file_exists($publicDir)) {
            @mkdir($publicDir, 0755, true);
        }
        $publicFile = $publicDir . DIRECTORY_SEPARATOR . $safeName;
        @copy($file->getRealPath(), $publicFile);
        @chmod($publicFile, 0644);

        // 3. Direct copy to public_path('storage/' . $folder) in case /storage/ is referenced
        $publicStorageDir = public_path('storage' . DIRECTORY_SEPARATOR . $folder);
        if (!file_exists($publicStorageDir)) {
            @mkdir($publicStorageDir, 0755, true);
        }
        $publicStorageFile = $publicStorageDir . DIRECTORY_SEPARATOR . $safeName;
        @copy($file->getRealPath(), $publicStorageFile);
        @chmod($publicStorageFile, 0644);

        // Best URL: direct public path /stickers/... (matches other built-in stickers)
        $url = '/' . $folder . '/' . $safeName;

        return response()->json([
            'success' => true,
            'url' => $url,
            'storage_url' => '/storage/' . $path,
            'full_url' => url($url),
            'message' => 'Image uploaded successfully',
        ]);
    }
}
