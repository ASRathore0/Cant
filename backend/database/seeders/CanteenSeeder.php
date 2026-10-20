<?php

namespace Database\Seeders;

use App\Models\Canteen;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class CanteenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Annapoorna Canteen (Default)
        $annapoorna = Canteen::updateOrCreate(
            ['slug' => 'annapoorna-canteen'],
            [
                'name' => 'Annapoorna Canteen',
                'tagline' => 'Good Food. Made Fresh. Served with Respect.',
                'logo_url' => '/logo.png',
                'primary_color' => '#062D1F',
                'secondary_color' => '#07402A',
                'accent_color' => '#E8C928',
                'bg_color' => '#F8F6F0',
                'theme_preset' => 'emerald',
                'dietary_type' => 'pure_veg',
                'pure_veg_label' => '100% Pure Vegetarian',
                'address' => 'Basement Parking, Gaur City Mall, Sector 4, Greater Noida West - 201009',
                'location_landmark' => 'Gaur City Mall, Basement Parking',
                'phone' => '+91 98765 43210',
                'whatsapp' => '+91 98765 43210',
                'opening_hours' => '08:00 AM – 10:30 PM (Everyday)',
                'hero_heading' => 'Good Food. Made Fresh. Served with Respect.',
                'hero_subheading' => 'Authentic North Indian savouries, hearty homestyle thalis, freshly toasted parathas, and refreshing shakes made daily with utmost purity and hygiene.',
                'announcement_enabled' => true,
                'announcement_text' => 'Welcome to Annapoorna Canteen! Hot breakfast, fresh parathas, and homestyle lunch thalis served daily.',
                'discount_badge_enabled' => true,
                'discount_badge_title' => 'Armed Forces 10% Off',
                'discount_badge_text' => '10% Discount for Indian Armed Forces personnel & veterans with valid ID.',
                'qr_target_url' => 'http://localhost:5173/menu',
                'is_active' => true,
                'is_default' => true,
            ]
        );

        // Attach existing unassigned categories & items to Annapoorna
        Category::whereNull('canteen_id')->update(['canteen_id' => $annapoorna->id]);
        MenuItem::whereNull('canteen_id')->update(['canteen_id' => $annapoorna->id]);

        // 2. Demo Onboarded Canteen: Chai & Bytes Cafe (Sector 62 Tech Park)
        $techCafe = Canteen::updateOrCreate(
            ['slug' => 'chai-bytes-cafe'],
            [
                'name' => 'Chai & Bytes Cafe',
                'tagline' => 'Artisan Brews, Fresh Bites & Quick Tech Lunches.',
                'logo_url' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
                'primary_color' => '#0F294A',
                'secondary_color' => '#163A69',
                'accent_color' => '#00D2D3',
                'bg_color' => '#F0F4F8',
                'theme_preset' => 'navy',
                'dietary_type' => 'veg_nonveg',
                'pure_veg_label' => 'Multi-Cuisine & Cafe',
                'address' => 'Ground Floor Tower B, Logix Cyber Park, Sector 62, Noida - 201301',
                'location_landmark' => 'Logix Cyber Park Tower B',
                'phone' => '+91 99887 76655',
                'whatsapp' => '+91 99887 76655',
                'opening_hours' => '07:30 AM – 11:00 PM (Mon-Sat)',
                'hero_heading' => 'Fueling Noida\'s Tech Workday with Great Chai & Quick Meals.',
                'hero_subheading' => 'Specialty kulhad teas, gourmet sandwiches, loaded rice bowls, and artisan brewed coffees delivered to your office desk.',
                'announcement_enabled' => true,
                'announcement_text' => 'Desk Delivery Active: Use WhatsApp to order directly to your office reception in Logix Park!',
                'discount_badge_enabled' => true,
                'discount_badge_title' => 'Corporate IT 10% Off',
                'discount_badge_text' => '10% Flat Discount for all Tech Park employees on showing company ID card.',
                'qr_target_url' => 'http://localhost:5173/menu?canteen=chai-bytes-cafe',
                'is_active' => true,
                'is_default' => false,
            ]
        );

        // Seed 2 categories and items for the demo cafe if not already present
        if ($techCafe->categories()->count() === 0) {
            $catBrews = Category::create([
                'canteen_id' => $techCafe->id,
                'name' => 'Specialty Brews & Teas',
                'slug' => 'specialty-brews-chai-bytes',
                'description' => 'Aromatic artisan coffees and kulhad chai blends for tech professionals.',
                'sort_order' => 1,
                'is_active' => true,
            ]);

            MenuItem::create([
                'canteen_id' => $techCafe->id,
                'category_id' => $catBrews->id,
                'name' => 'Masala Adrak Kulhad Chai',
                'slug' => 'masala-adrak-kulhad-chai-cb',
                'description' => 'Fresh crushed ginger, green cardamom, and Assam CTC boiled in fresh whole milk.',
                'price_type' => 'fixed',
                'price' => 25.00,
                'serving_info' => '1 Kulhad Cup',
                'is_featured' => true,
                'is_available' => true,
                'sort_order' => 1,
                'image_path' => 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
            ]);

            MenuItem::create([
                'canteen_id' => $techCafe->id,
                'category_id' => $catBrews->id,
                'name' => 'Cold Brew Latte',
                'slug' => 'cold-brew-latte-cb',
                'description' => '16-hour slow steeped Arabica coffee poured over chilled vanilla milk.',
                'price_type' => 'fixed',
                'price' => 85.00,
                'serving_info' => '350ml Glass',
                'is_featured' => true,
                'is_available' => true,
                'sort_order' => 2,
                'image_path' => 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
            ]);

            $catBites = Category::create([
                'canteen_id' => $techCafe->id,
                'name' => 'Gourmet Sandwiches & Bowls',
                'slug' => 'gourmet-sandwiches-bowls-cb',
                'description' => 'Freshly grilled sourdough sandwiches and energizing lunch bowls.',
                'sort_order' => 2,
                'is_active' => true,
            ]);

            MenuItem::create([
                'canteen_id' => $techCafe->id,
                'category_id' => $catBites->id,
                'name' => 'Peri Peri Paneer Panini',
                'slug' => 'peri-peri-paneer-panini-cb',
                'description' => 'Spiced cottage cheese steaks with grilled bell peppers and chipotle mayo in herbed focaccia.',
                'price_type' => 'fixed',
                'price' => 120.00,
                'serving_info' => '2 Jumbo Halves with Crisps',
                'is_featured' => true,
                'is_available' => true,
                'sort_order' => 1,
                'image_path' => 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
            ]);
        }
    }
}
