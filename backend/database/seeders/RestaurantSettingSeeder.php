<?php

namespace Database\Seeders;

use App\Models\RestaurantSetting;
use Illuminate\Database\Seeder;

class RestaurantSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            'restaurant_name' => 'Annapoorna Canteen',
            'tagline' => 'Good Food. Made Fresh. Served with Respect.',
            'pure_veg_label' => '100% Pure Vegetarian',
            'address' => 'Gaur City Mall Basement Parking, Sector 4, Greater Noida West, UP - 201009',
            'location_landmark' => 'Gaur City Mall Basement Parking, Sector 4, Noida',
            'phone' => '+91 98765 43210',
            'whatsapp' => '+91 98765 43210',
            'opening_hours' => '08:00 AM – 10:30 PM (Everyday)',
            'hero_heading' => 'Good Food. Made Fresh. Served with Respect.',
            'hero_subheading' => 'Authentic North Indian savouries, hearty homestyle thalis, freshly toasted parathas, and refreshing shakes made daily with utmost purity and hygiene.',
            'logo_url' => '/storage/branding/logo.png',
            'announcement_enabled' => '1',
            'announcement_text' => 'Welcome to Annapoorna Canteen! Hot breakfast, fresh parathas, and homestyle lunch thalis served daily.',
            'army_discount_enabled' => '1',
            'army_discount_text' => 'Special Honor: 10% Discount for Indian Armed Forces personnel & veterans with valid Service ID.',
            'qr_target_url' => 'http://localhost:5173/menu',
        ];

        foreach ($settings as $key => $value) {
            RestaurantSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
