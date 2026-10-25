<?php

namespace Database\Seeders;

use App\Models\Canteen;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ChaiTadkaSeeder extends Seeder
{
    /**
     * Run the database seeds for Chai Tadka Cafe and Restaurant.
     */
    public function run(): void
    {
        // 1. Create or update Chai Tadka Canteen Entity
        $canteen = Canteen::updateOrCreate(
            ['slug' => 'chai-tadka'],
            [
                'name' => 'Chai Tadka Cafe and Restaurant',
                'page_title' => 'Chai Tadka | Cafe & Restaurant — Premium Chaap & Pizza',
                'tagline' => 'Good Food. Great Chai. Best Company!',
                'logo_url' => '/branding/chai-tadka-logo.png',
                'favicon_url' => '/branding/chai-tadka-logo.png',
                'primary_color' => '#7C2D12',
                'secondary_color' => '#15803D',
                'accent_color' => '#D97706',
                'bg_color' => '#FDFBF7',
                'theme_preset' => 'amber',
                'dietary_type' => 'pure_veg',
                'pure_veg_label' => '100% Pure Vegetarian',
                'address' => 'Shop-07, Ground Floor, Central Plaza, Shahberi Road, Opposite Golf Homes (Amrapali), Sector-4, Greater Noida – 201318',
                'location_landmark' => 'Shop-07, Central Plaza, Shahberi Road, Opp. Golf Homes, Sector-4',
                'phone' => '+91 8796728206',
                'whatsapp' => '+91 8796725207',
                'opening_hours' => '11:00 AM – 11:30 PM (Daily)',
                'hero_heading' => 'Good Food. Great Chai. Best Company!',
                'hero_subheading' => 'Ek Ehsaas Jo Dil Choo Le — Sizzling tandoori malai chaaps, stone-baked cheese burst pizzas, and kulhad masala chai crafted fresh with pure authentic ingredients.',
                'hero_badge' => 'Premium Chaap & Pizza',
                'hero_trio' => [
                    [
                        'name' => 'Paneer Capsicum Pizza',
                        'price' => '₹129',
                        'searchTerm' => 'pizza',
                        'stickerUrl' => '/stickers/pizza.jpg',
                        'showSteam' => false,
                    ],
                    [
                        'name' => 'Tadka Special Chai',
                        'price' => '₹30',
                        'searchTerm' => 'chai',
                        'stickerUrl' => '/stickers/tea.jpg',
                        'showSteam' => true,
                    ],
                    [
                        'name' => 'Malai Chaap',
                        'price' => '₹140',
                        'searchTerm' => 'chaap',
                        'stickerUrl' => '/stickers/samosa.jpg',
                        'showSteam' => false,
                    ],
                ],
                'announcement_enabled' => true,
                'announcement_text' => 'Welcome to Chai Tadka! Freshly baked pizzas, juicy premium soya chaaps, and aromatic tea. Call for orders & takeaway: +91 8796728206 / +91 8796725207.',
                'discount_badge_enabled' => true,
                'discount_badge_title' => 'Eat Chaap Be Happy',
                'discount_badge_text' => 'Chef Combos & Special Chaap & Pizza Deals. Enquiries: 8796728206 / 8796725207.',
                'qr_target_url' => 'http://localhost:5173/menu?canteen=chai-tadka',
                'is_active' => true,
                'is_default' => false,
            ]
        );

        // 2. Create or update Manager Account for Chai Tadka
        User::updateOrCreate(
            ['email' => 'chaitadka07@gmail.com'],
            [
                'name' => 'Chai Tadka Manager',
                'password' => 'Password@123',
                'role' => 'manager',
                'canteen_id' => $canteen->id,
                'email_verified_at' => now(),
            ]
        );

        // 3. Menu Categories and Items extracted directly from the physical menu brochure
        $menuData = [
            [
                'category' => [
                    'name' => 'Pizza Mania',
                    'slug' => 'pizza-mania-chai-tadka',
                    'description' => 'Freshly baked pan pizzas with delicious toppings and bubbly mozzarella cheese.',
                    'sort_order' => 1,
                ],
                'items' => [
                    [
                        'name' => 'Veg Loaded Pizza',
                        'description' => 'Loaded with fresh crunchy onions, green capsicum, juicy ripe tomatoes, and melted mozzarella cheese.',
                        'price' => 179.00,
                        'price_max' => 279.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹179 | Medium ₹279',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Paneer, Onion & Capsicum Pizza',
                        'description' => 'Tender paneer cubes paired with crisp red onions and green bell peppers on rich herb tomato sauce.',
                        'price' => 129.00,
                        'price_max' => 229.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹129 | Medium ₹229',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Cheese Overload Pizza (Mania)',
                        'description' => 'Gooey blend of 100% mozzarella, liquid cheddar, and processed cheese for true cheese enthusiasts.',
                        'price' => 355.00,
                        'price_max' => 659.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹355 | Medium ₹659',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Gourmet Pizzas',
                    'slug' => 'gourmet-pizzas-chai-tadka',
                    'description' => 'Specialty stone-baked Italian and Indian fusion pizzas with hand-stretched crusts.',
                    'sort_order' => 2,
                ],
                'items' => [
                    [
                        'name' => 'Margherita Pizza',
                        'description' => 'Classic Italian crust topped with herbed San Marzano tomato sauce and generous golden bubbly mozzarella.',
                        'price' => 149.00,
                        'price_max' => 329.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹149 | Medium ₹239 | Large ₹329',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => "Achari D'Piyazza Pizza",
                        'description' => 'Tangy pickled spices infused with double golden onions and mozzarella on freshly stretched dough.',
                        'price' => 189.00,
                        'price_max' => 429.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹189 | Medium ₹339 | Large ₹429',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Corn & Cheese Paratha Pizza',
                        'description' => 'Fusion delight combining golden sweet corn, rich mozzarella cheese on a crispy paratha-style crust.',
                        'price' => 189.00,
                        'price_type' => 'fixed',
                        'serving_info' => 'Regular ₹189',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Fresh Veggie Pizza',
                        'description' => 'Crisp green capsicum, sweet onion, fresh juicy tomatoes, and golden sweet corn baked with mozzarella.',
                        'price' => 219.00,
                        'price_max' => 479.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹219 | Medium ₹399 | Large ₹479',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Double Cheese Margherita Pizza',
                        'description' => 'Double layer of melted stringy mozzarella over aromatic Italian basil herb sauce.',
                        'price' => 219.00,
                        'price_max' => 479.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹219 | Medium ₹399 | Large ₹479',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1594007654729-407edc4be657?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Classic Special Pizza',
                        'description' => "Chai Tadka chef's special hand-stretched pizza loaded with paneer, capsicum, olives, sweet corn & mozzarella.",
                        'price' => 269.00,
                        'price_max' => 579.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹269 | Medium ₹499 | Large ₹579',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Mexican Green Wave Pizza',
                        'description' => 'Zesty Mexican herb sauce, crunchy onions, capsicum, fresh tomatoes, jalapenos, and spicy Mexican seasoning.',
                        'price' => 279.00,
                        'price_max' => 579.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹279 | Medium ₹499 | Large ₹579',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Veg Extraordinaire Pizza',
                        'description' => 'The ultimate vegetable feast with black olives, golden corn, fresh mushrooms, red paprika, paneer & capsicum.',
                        'price' => 309.00,
                        'price_max' => 649.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹309 | Medium ₹569 | Large ₹649',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Indian Tandoori Wave Pizza',
                        'description' => 'Marinated tandoori paneer tikka, spicy red paprika, crisp onions & capsicum with smoked tandoori drizzle.',
                        'price' => 309.00,
                        'price_max' => 649.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹309 | Medium ₹569 | Large ₹649',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Cheese Overload Pizza (Chef Signature)',
                        'description' => 'Extraordinary triple-cheese indulgence with mozzarella, melted cheddar and cream cheese burst.',
                        'price' => 359.00,
                        'price_max' => 739.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular ₹359 | Medium ₹659 | Large ₹739',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1594007654729-407edc4be657?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Crust & Cheese Burst Add-Ons',
                    'slug' => 'crust-cheese-burst-chai-tadka',
                    'description' => 'Custom crust enhancements and flavor burst upgrades for all pizzas.',
                    'sort_order' => 3,
                ],
                'items' => [
                    [
                        'name' => 'Fresh Pan Pizza (100% Wheat Thin Crust)',
                        'description' => 'Healthy, crisp 100% whole wheat thin crust base upgrade for your pizza.',
                        'price' => 50.00,
                        'price_max' => 80.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular Add ₹50 | Medium Add ₹80',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Cheese Burst Upgrade (4 Flavors Available)',
                        'description' => 'Decadent melted cheese stuffed crust. Available in 4 exciting flavors: Classic, Creamy Nacho, Bursty Sweet Chilli, or Hot & Fiery.',
                        'price' => 75.00,
                        'price_max' => 125.00,
                        'price_type' => 'range',
                        'serving_info' => 'Regular Add ₹75 | Medium Add ₹125',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Premium Soya Chaap (Tandoori & Gravy)',
                    'slug' => 'premium-soya-chaap-chai-tadka',
                    'description' => 'Soft, succulent soya chaap marinated in fresh cream, exotic herbs and coal-grilled to perfection.',
                    'sort_order' => 4,
                ],
                'items' => [
                    [
                        'name' => 'Malai Chaap',
                        'description' => 'Soft, juicy chaap marinated in rich cream, aromatic spices and traditional herbs. A creamy delight in every bite.',
                        'price' => 140.00,
                        'price_max' => 240.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half: ₹140 | Full: ₹240',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Malai Chaap (Stuffed)',
                        'description' => 'Soft juicy chaap with special seasoned paneer & dry fruit stuffing, marinated in velvety malai cream & mild spices.',
                        'price' => 180.00,
                        'price_max' => 320.00,
                        'price_type' => 'range',
                        'serving_info' => 'Stuffed Half: ₹180 | Stuffed Full: ₹320',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Tandoori Chaap',
                        'description' => 'Classic tandoori flavour, smoky, spicy and full of taste. Grilled to perfection for an irresistible street-style experience.',
                        'price' => 150.00,
                        'price_max' => 260.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half: ₹150 | Full: ₹260',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Tandoori Chaap (Stuffed)',
                        'description' => 'Smoky coal-grilled chaap stuffed with seasoned herbs and spiced cottage cheese.',
                        'price' => 170.00,
                        'price_max' => 300.00,
                        'price_type' => 'range',
                        'serving_info' => 'Stuffed Half: ₹170 | Stuffed Full: ₹300',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Afghani Chaap',
                        'description' => 'A royal blend of cream, dry fruits and exotic spices giving it a rich and unique flavour.',
                        'price' => 170.00,
                        'price_max' => 300.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half: ₹170 | Full: ₹300',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Afghani Chaap (Stuffed)',
                        'description' => 'Royal cashew and cream marinade stuffed chaap slowly roasted over open embers.',
                        'price' => 220.00,
                        'price_max' => 340.00,
                        'price_type' => 'range',
                        'serving_info' => 'Stuffed Half: ₹220 | Stuffed Full: ₹340',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Masala Chaap',
                        'description' => 'Rich, spicy and packed with traditional Indian spices for an unforgettable taste.',
                        'price' => 150.00,
                        'price_max' => 280.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half: ₹150 | Full: ₹280',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Masala Chaap (Stuffed)',
                        'description' => 'Robust dhaba-style spicy chaap with stuffed spiced paneer filling grilled over charcoal.',
                        'price' => 190.00,
                        'price_max' => 340.00,
                        'price_type' => 'range',
                        'serving_info' => 'Stuffed Half: ₹190 | Stuffed Full: ₹340',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Paneer Tikka Chaap',
                        'description' => 'Soft paneer blended with chaap, marinated in tandoori spices and grilled to perfection.',
                        'price' => 180.00,
                        'price_max' => 320.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half: ₹180 | Full: ₹320',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Paneer Tikka Chaap (Stuffed)',
                        'description' => 'Paneer cubes and chaap with savoury herb stuffing, tandoor-roasted with green peppers and onions.',
                        'price' => 210.00,
                        'price_max' => 360.00,
                        'price_type' => 'range',
                        'serving_info' => 'Stuffed Half: ₹210 | Stuffed Full: ₹360',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Soya Chaap (Classic)',
                        'description' => '100% vegetarian, healthy and delicious. A perfect blend of flavour and nutrition.',
                        'price' => 140.00,
                        'price_max' => 260.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half: ₹140 | Full: ₹260',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Soya Chaap (Stuffed)',
                        'description' => "Wholesome soya chaap with savoury filling, roasted with chef's signature spice blend.",
                        'price' => 160.00,
                        'price_max' => 300.00,
                        'price_type' => 'range',
                        'serving_info' => 'Stuffed Half: ₹160 | Stuffed Full: ₹300',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Chai, Coffee & Cafe Beverages',
                    'slug' => 'chai-beverages-chai-tadka',
                    'description' => 'Aromatic spiced teas brewed with fresh milk, herbal infusions and frothy cafe coolers.',
                    'sort_order' => 5,
                ],
                'items' => [
                    [
                        'name' => 'Tadka Special Masala Chai',
                        'description' => 'Signature boiled whole milk tea steeped with freshly crushed elaichi, adrak and secret tadka chai masala.',
                        'price' => 30.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Hot Cup',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Kulhad Masala Chai',
                        'description' => 'Authentic clay pot brewed tea infused with fresh ginger & fragrant spices with an earthy aroma.',
                        'price' => 40.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Clay Kulhad',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Filter Kaapi (South Indian Style)',
                        'description' => 'Frothy rich decoction filter coffee brewed with hot full-cream milk.',
                        'price' => 50.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Cup',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Cold Coffee with Vanilla Ice Cream',
                        'description' => 'Thick chilled blended coffee topped with creamy vanilla ice cream and chocolate drizzle.',
                        'price' => 99.00,
                        'price_type' => 'fixed',
                        'serving_info' => '350 ml Glass',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Add-Ons & Indian Breads',
                    'slug' => 'add-ons-breads-chai-tadka',
                    'description' => 'Crisp tandoori breads, fresh chutneys, dips and extra gravies.',
                    'sort_order' => 6,
                ],
                'items' => [
                    [
                        'name' => 'Extra Malai Gravy',
                        'description' => 'Silky smooth rich cream gravy infused with cardamom and herbs.',
                        'price' => 60.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Portion',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Extra Tandoori Mayo',
                        'description' => 'Spicy smoked tandoori mayonnaise dip.',
                        'price' => 50.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Dip',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Extra Green Chutney',
                        'description' => 'Fresh homemade spicy mint, coriander and green chilli chutney.',
                        'price' => 40.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Dip',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Extra Onion Salad',
                        'description' => 'Fresh sliced onion rings tossed with chaat masala, lemon and green chillies.',
                        'price' => 40.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Plate',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Rumali Roti (2 pcs)',
                        'description' => 'Ultra-soft handkerchief thin wheat rotis tossed on inverted tawa.',
                        'price' => 60.00,
                        'price_type' => 'fixed',
                        'serving_info' => '2 Pcs',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Tandoori Roti (2 pcs)',
                        'description' => 'Crisp clay oven baked whole wheat rotis topped with butter.',
                        'price' => 70.00,
                        'price_type' => 'fixed',
                        'serving_info' => '2 Pcs',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Butter Naan (1 pc)',
                        'description' => 'Soft leavened tandoori flatbread brushed generously with fresh melted butter.',
                        'price' => 70.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
        ];

        // 4. Seed Categories and Dishes linked to Chai Tadka
        $dishSortOrder = 1;
        foreach ($menuData as $group) {
            $cat = Category::updateOrCreate(
                [
                    'canteen_id' => $canteen->id,
                    'slug' => $group['category']['slug'],
                ],
                [
                    'name' => $group['category']['name'],
                    'description' => $group['category']['description'],
                    'sort_order' => $group['category']['sort_order'],
                    'is_active' => true,
                ]
            );

            foreach ($group['items'] as $item) {
                MenuItem::updateOrCreate(
                    [
                        'canteen_id' => $canteen->id,
                        'category_id' => $cat->id,
                        'slug' => Str::slug($item['name'] . '-chai-tadka'),
                    ],
                    [
                        'name' => $item['name'],
                        'description' => $item['description'],
                        'price' => $item['price'],
                        'price_max' => $item['price_max'] ?? null,
                        'price_type' => $item['price_type'] ?? 'fixed',
                        'serving_info' => $item['serving_info'] ?? null,
                        'is_available' => true,
                        'is_featured' => $item['is_featured'] ?? false,
                        'image_path' => $item['image_path'] ?? null,
                        'sort_order' => $dishSortOrder++,
                    ]
                );
            }
        }
    }
}
