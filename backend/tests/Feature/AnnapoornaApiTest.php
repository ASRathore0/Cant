<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AnnapoornaApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_public_menu_returns_categories_and_items(): void
    {
        $response = $this->getJson('/api/v1/menu');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'categories' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'items',
                    ]
                ],
                'settings',
                'timestamp',
            ]);
    }

    public function test_public_categories_endpoint(): void
    {
        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'categories' => [
                    '*' => ['id', 'name', 'slug']
                ]
            ]);
    }

    public function test_public_restaurant_settings_endpoint(): void
    {
        $response = $this->getJson('/api/v1/restaurant');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'restaurant_name' => 'Annapoorna Canteen',
            ]);
    }

    public function test_qr_scan_recording(): void
    {
        $response = $this->postJson('/api/v1/qr-scans', [
            'source' => 'table_12',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'message' => 'Scan recorded successfully',
            ]);

        $this->assertDatabaseHas('qr_scans', [
            'source' => 'table_12',
        ]);
    }

    public function test_unauthenticated_user_cannot_access_admin_routes(): void
    {
        $response = $this->getJson('/api/v1/admin/dashboard');
        $response->assertStatus(401);

        $response = $this->getJson('/api/v1/admin/menu-items');
        $response->assertStatus(401);
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@annapoornacanteen.com',
            'password' => 'Annapoorna@2026',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'token',
                'user' => ['id', 'name', 'email'],
            ]);
    }

    public function test_admin_login_fails_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@annapoornacanteen.com',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors']);
    }

    public function test_authenticated_admin_can_view_dashboard_and_toggle_availability(): void
    {
        $admin = User::where('email', 'admin@annapoornacanteen.com')->first();
        $token = $admin->createToken('test-token')->plainTextToken;

        // View dashboard
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'metrics' => [
                    'total_items',
                    'available_items',
                    'unavailable_items',
                    'total_categories',
                ],
                'recent_items',
            ]);

        // Toggle availability of a menu item
        $item = MenuItem::first();
        $initialState = $item->is_available;

        $toggleResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/v1/admin/menu-items/{$item->id}/availability");

        $toggleResponse->assertStatus(200);
        $this->assertEquals(!$initialState, $item->fresh()->is_available);
    }

    public function test_admin_can_create_menu_item_with_validation(): void
    {
        $admin = User::where('email', 'admin@annapoornacanteen.com')->first();
        $token = $admin->createToken('test-token')->plainTextToken;
        $category = Category::first();

        // Negative price should fail validation
        $invalidResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/admin/menu-items', [
                'category_id' => $category->id,
                'name' => 'Bad Item',
                'price_type' => 'fixed',
                'price' => -10,
            ]);

        $invalidResponse->assertStatus(422);

        // Valid item
        $validResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/admin/menu-items', [
                'category_id' => $category->id,
                'name' => 'Special Malai Kofta',
                'description' => 'Melt-in-mouth cottage cheese dumplings in rich cashew gravy.',
                'price_type' => 'fixed',
                'price' => 140.00,
                'serving_info' => '1 Bowl with 2 Koftas',
                'is_available' => true,
                'is_featured' => true,
            ]);

        $validResponse->assertStatus(201)
            ->assertJsonFragment(['name' => 'Special Malai Kofta']);

        $this->assertDatabaseHas('menu_items', [
            'name' => 'Special Malai Kofta',
            'price' => 140.00,
        ]);
    }

    public function test_category_with_items_cannot_be_deleted(): void
    {
        $admin = User::where('email', 'admin@annapoornacanteen.com')->first();
        $token = $admin->createToken('test-token')->plainTextToken;

        $categoryWithItems = Category::has('menuItems')->first();

        $deleteResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson("/api/v1/admin/categories/{$categoryWithItems->id}");

        $deleteResponse->assertStatus(422)
            ->assertJsonFragment(['items_count' => $categoryWithItems->menuItems()->count()]);
    }

    public function test_admin_can_update_restaurant_settings(): void
    {
        $admin = User::where('email', 'admin@annapoornacanteen.com')->first();
        $token = $admin->createToken('test-token')->plainTextToken;

        $updateResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson('/api/v1/admin/settings', [
                'phone' => '+91 99999 88888',
                'opening_hours' => '07:30 AM – 11:00 PM',
            ]);

        $updateResponse->assertStatus(200);

        $this->assertDatabaseHas('restaurant_settings', [
            'key' => 'phone',
            'value' => '+91 99999 88888',
        ]);
    }
}
