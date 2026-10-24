<?php

namespace Database\Seeders;

use App\Models\Canteen;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HiraSweetsSeeder extends Seeder
{
    /**
     * Run the database seeds for Hira Sweets (Est. 1912).
     */
    public function run(): void
    {
        // 1. Create or update Hira Sweets Canteen Entity
        $canteen = Canteen::updateOrCreate(
            ['slug' => 'hira-sweets'],
            [
                'name' => 'Hira Sweets',
                'page_title' => 'Hira Sweets | Traditional Taste Since 1912',
                'tagline' => 'Tradition of Purity Since 1912 - Sweets, Restaurant & Bakery',
                'logo_url' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=300&q=80',
                'favicon_url' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=64&q=80',
                'primary_color' => '#9E1B1B',
                'secondary_color' => '#7A1313',
                'accent_color' => '#F59E0B',
                'bg_color' => '#FBF9F5',
                'theme_preset' => 'crimson_gold',
                'dietary_type' => 'pure_veg',
                'pure_veg_label' => '100% Pure Vegetarian Since 1912',
                'address' => 'Plot No. C-03, Sector-4, Galaxy Blue Sapphire Plaza, Greater Noida West - 201009, U.P.',
                'location_landmark' => 'Galaxy Blue Sapphire Plaza, Sector-4, Gr. Noida (W)',
                'phone' => '+91 93118 80483',
                'whatsapp' => '+91 84489 58485',
                'opening_hours' => '08:00 AM – 11:00 PM (Everyday)',
                'hero_heading' => 'Ab Subah Ka Naashta Aur Bhi Sasta — Starting at ₹40',
                'hero_subheading' => 'Famous Balushahi, steaming puris, iconic street chaat, South Indian platters, royal desi thalis, and eggless live bakery creations crafted with timeless purity since 1912.',
                'hero_badge' => 'Est. 1912',
                'hero_trio' => [
                    ['name' => 'Puri Sabji with Balushahi', 'price' => '₹115', 'tag' => 'Signature Combo'],
                    ['name' => 'Chole Bhature', 'price' => '₹165', 'tag' => 'Bestseller'],
                    ['name' => 'Deluxe Thali', 'price' => '₹375', 'tag' => 'Royal Meal'],
                ],
                'announcement_enabled' => true,
                'announcement_text' => 'Breakfast Specials from 8:30 AM to 11:30 AM starting at ₹40! Free Home Delivery within 3 km on orders above ₹350. Order: 9311880483 / 8448958485.',
                'discount_badge_enabled' => true,
                'discount_badge_title' => 'Free Home Delivery',
                'discount_badge_text' => 'Free Home Delivery within 3 km on minimum order of ₹350/-. Call: 9311880483.',
                'qr_target_url' => 'http://localhost:5173/menu?canteen=hira-sweets',
                'is_active' => true,
                'is_default' => false,
            ]
        );

        // 2. Manager Account for Hira Sweets
        User::updateOrCreate(
            ['email' => 'hira@sweets.com'],
            [
                'name' => 'Hira Sweets Manager',
                'password' => 'Password@123',
                'role' => 'manager',
                'canteen_id' => $canteen->id,
                'email_verified_at' => now(),
            ]
        );

        // 3. Menu Data extracted directly from brochure
        $menuData = [
            [
                'category' => [
                    'name' => 'Nukkad Ki Chaat & Morning Breakfast (8:30 AM - 11:30 AM)',
                    'slug' => 'nukkad-chaat-breakfast-hira',
                    'description' => 'Famous Old Delhi style chaat, steaming puri sabji with balushahi, fluffy chole bhature, and morning breakfast combos.',
                    'sort_order' => 1,
                ],
                'items' => [
                    [
                        'name' => 'Puri Sabji with Balushahi',
                        'description' => 'Hira signature breakfast: 4 crisp bedmi puris served with spicy aloo jhol sabji and one pure ghee balushahi.',
                        'price' => 115.00,
                        'serving_info' => '4 Puris + Sabji + 1 Balushahi',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Puri Sabji Plate',
                        'description' => 'Freshly fried hot puris accompanied by traditional seasoned potato curry and mixed pickle. (Morning rate: ₹55)',
                        'price' => 82.00,
                        'serving_info' => '4 Pcs with Aloo Sabji',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Chole Bhature',
                        'description' => 'Two large puffed golden bhature served with slow-simmered Punjabi chole, pickled onions, and green chilies.',
                        'price' => 165.00,
                        'serving_info' => '2 Bhature + Pindi Chole',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Pao Bhaji',
                        'description' => 'Rich buttery mashed mixed vegetable bhaji served with two butter toasted pavs and chopped red onions.',
                        'price' => 165.00,
                        'serving_info' => '2 Butter Pavs + Spiced Bhaji',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Matar Kulcha',
                        'description' => 'Tangy boiled dried white peas tempered with ginger, green chilies, and lemon, served with two soft kulchas.',
                        'price' => 155.00,
                        'serving_info' => '2 Soft Kulchas + Matar',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Raj Kachori',
                        'description' => 'Large crispy hollow sphere filled with potatoes, sprouts, sweetened curd, saunth, mint chutney, and sev.',
                        'price' => 150.00,
                        'serving_info' => '1 Grand Stuffed Raj Kachori',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Dahi Bhalla',
                        'description' => 'Velvety lentil dumplings immersed in thick sweetened yogurt topped with roasted cumin and tangy pomegranate saunth.',
                        'price' => 150.00,
                        'serving_info' => '2 Dumplings in Chilled Curd',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Aloo Ki Tikki with Dahi Chole',
                        'description' => 'Desi ghee shallow-fried crisp potato patties smothered with hot chole gravy, sweet curd, and dual chutneys.',
                        'price' => 135.00,
                        'serving_info' => '2 Tikkis with Chole & Curd',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Gol Gappe (6 Pcs)',
                        'description' => 'Crispy suji puris filled with spicy potatoes and served with mint-hing teekha pani and sweet meetha pani.',
                        'price' => 65.00,
                        'serving_info' => '6 Puris with Two Waters',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Snacks, Dhokla & Live Bakery',
                    'slug' => 'snacks-dhokla-bakery-hira',
                    'description' => 'Fresh evening kachoris, Mumbai vada pao, Gujarati steamed dhokla, and warm bakery puffs.',
                    'sort_order' => 2,
                ],
                'items' => [
                    [
                        'name' => 'Vada Pao',
                        'description' => 'Mumbai street specialty batata vada tucked inside soft pav with spicy dry garlic chutney and fried green chili.',
                        'price' => 45.00,
                        'serving_info' => '1 Pc with Chutneys',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Jodhpuri Pyaz Kachori',
                        'description' => 'Flaky Rajasthani crust packed with spiced caramelised onion masala and aromatic fennel.',
                        'price' => 40.00,
                        'serving_info' => '1 Large Crispy Kachori',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Kachori Subzi Plate (2 Pcs)',
                        'description' => 'Two khasta kachoris served crushed under piping hot spicy potato curry with fenugreek pickle.',
                        'price' => 70.00,
                        'serving_info' => '2 Kachoris + Aloo Subzi',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Paneer Pakora (Per Pc)',
                        'description' => 'Rich slice of fresh malai paneer seasoned with mint chutney, dipped in spiced chickpea batter and fried golden.',
                        'price' => 40.00,
                        'serving_info' => '1 Large Paneer Pakora',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Khandvi Dhokla (Plate)',
                        'description' => 'Silky smooth rolled gram flour pinwheels tempered with mustard seeds, fresh coconut, and curry leaves.',
                        'price' => 38.00,
                        'serving_info' => '1 Plate Rolled Khandvi',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Paneer Dhokla (Plate)',
                        'description' => 'Spongy steamed savory dhokla layered with fresh grated cottage cheese and green chutney.',
                        'price' => 31.00,
                        'serving_info' => '1 Plate Steamed Dhokla',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Chilli Paneer Roll',
                        'description' => 'Flaky puff pastry stuffed with spicy stir-fried cottage cheese, bell peppers, and scallions.',
                        'price' => 56.00,
                        'serving_info' => '1 Fresh Baked Puff Roll',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Spiral Pizza Slice',
                        'description' => 'Oven baked pizza slice topped with gooey mozzarella, sweet corn, and Italian herbs.',
                        'price' => 56.00,
                        'serving_info' => '1 Warm Pizza Slice',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Traditional Sweets & Royal Mithai',
                    'slug' => 'traditional-sweets-mithai-hira',
                    'description' => 'Centurylong legacy of pure desi ghee Balushahi, Rasmalai, hot Jalebis, and signature Rabri Faluda since 1912.',
                    'sort_order' => 3,
                ],
                'items' => [
                    [
                        'name' => 'Hira Special Balushahi',
                        'description' => 'World renowned Hira Balushahi with its flaky, melt-in-mouth golden crust soaked in fragrant sugar glaze.',
                        'price' => 35.00,
                        'serving_info' => '1 Signature Pure Ghee Pc',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Special Rabri Faluda',
                        'description' => 'Chilled thick malai rabri served over ice with cornstarch vermicelli sev and scented rose syrup.',
                        'price' => 135.00,
                        'serving_info' => 'Royal Sundae Glass',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Desi Ghee Jalebi (Per Plate)',
                        'description' => 'Crispy spiraled jalebis fried in pure desi ghee and immersed in saffron cardamom sugar nectar.',
                        'price' => 55.00,
                        'serving_info' => '1 Hot Plate Jalebi',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Rasmalai (1 Pc)',
                        'description' => 'Soft poached cottage cheese disc soaked in thickened sweet milk scented with saffron and pistachios.',
                        'price' => 45.00,
                        'serving_info' => '1 Chilled Kesar Rasmalai',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Gulab Jamun (1 Pc)',
                        'description' => 'Hot khoya dumpling fried to deep mahogany in pure ghee and bathed in rose cardamom syrup.',
                        'price' => 35.00,
                        'serving_info' => '1 Warm Desi Ghee Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Rajbhog (1 Pc)',
                        'description' => 'Royal saffron chenna sphere stuffed with pistachio and almond bits.',
                        'price' => 40.00,
                        'serving_info' => '1 Royal Stuffed Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Stick Kulfi (1 Pc)',
                        'description' => 'Traditional dense reduced milk kulfi on stick loaded with roasted almonds and cardamom.',
                        'price' => 55.00,
                        'serving_info' => '1 Traditional Kesar Kulfi',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Tandoori Starters & Kababs (From 12:00 Noon)',
                    'slug' => 'tandoori-starters-kababs-hira',
                    'description' => 'Charcoal roasted soya chaap specialties, marinated paneer tikkas, and stuffed mushroom delicacies.',
                    'sort_order' => 4,
                ],
                'items' => [
                    [
                        'name' => 'Tandoori Malai Chaap',
                        'description' => 'Tender soya chaap marinated in rich cashew paste, hung curd, and fresh cream, cooked over live charcoal.',
                        'price' => 325.00,
                        'serving_info' => 'Creamy Roasted Chaap Plate',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Paneer Tikka',
                        'description' => 'Thick cubes of malai cottage cheese, onions, and bell peppers marinated with ajwain and mustard oil.',
                        'price' => 340.00,
                        'serving_info' => '6 Charred Cottage Cheese Cubes',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Achari Paneer Tikka',
                        'description' => 'Fresh paneer tossed in zesty Rajasthani pickle spices and roasted in the clay tandoor.',
                        'price' => 340.00,
                        'serving_info' => 'Tangy Spiced Paneer Tikka',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Veg Seekh Kabab',
                        'description' => 'Minced fresh vegetables, cottage cheese, and aromatic spices skewered and charred to perfection.',
                        'price' => 270.00,
                        'serving_info' => '4 Skewered Kababs',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Mushroom Tikka',
                        'description' => 'Whole button mushrooms marinated in tandoori spices and char-grilled with crunchy peppers.',
                        'price' => 310.00,
                        'serving_info' => 'Charred Button Mushrooms',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'North Indian Curries & Combos (From 12:00 Noon)',
                    'slug' => 'north-indian-curries-combos-hira',
                    'description' => 'Iconic Hira Special Dal, creamy Dal Makhani, Shahi Paneer, and comforting Chole Chawal lunch bowls.',
                    'sort_order' => 5,
                ],
                'items' => [
                    [
                        'name' => 'Dal Makhani',
                        'description' => 'Whole black urad lentils slow simmered for 18 hours with butter, fresh cream, and subtle Kashmiri spices.',
                        'price' => 320.00,
                        'serving_info' => 'Slow Simmered Creamy Dal',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Shahi Paneer',
                        'description' => 'Soft paneer cubes simmered in royal velvety cashew nut and tomato gravy scented with shahi jeera.',
                        'price' => 345.00,
                        'serving_info' => 'Rich Royal Gravy Bowl',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Hira Special Dal',
                        'description' => 'Chef special signature yellow lentil preparation tempered with desi ghee, burnt garlic, and cumin.',
                        'price' => 340.00,
                        'serving_info' => 'Signature House Dal',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Kadai Paneer',
                        'description' => 'Cottage cheese wok-tossed with freshly crushed coriander seeds, dry red chilies, and bell peppers.',
                        'price' => 350.00,
                        'serving_info' => 'Wok Spiced Paneer',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Paneer Butter Masala',
                        'description' => 'Succulent paneer pieces bathed in creamy spiced makhani tomato butter sauce.',
                        'price' => 345.00,
                        'serving_info' => 'Buttery Makhani Paneer',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Chole Chawal Combo',
                        'description' => 'Comfort lunch bowl of authentic spiced pindi chole served over fragrant steamed basmati rice with pickled salad.',
                        'price' => 175.00,
                        'serving_info' => 'Meal Bowl with Salad',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Rajma Chawal Combo',
                        'description' => 'Homestyle slow-cooked Jammu rajma curry layered over piping hot basmati rice with crunchy onions.',
                        'price' => 175.00,
                        'serving_info' => 'Meal Bowl with Salad',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'South Indian Dosas, Idlis & Uttapams',
                    'slug' => 'south-indian-dosas-uttapams-hira',
                    'description' => 'Crispy fermented dosas, Mysore masala specialties, fluffy steamed rice idlis, and loaded vegetable uttapams.',
                    'sort_order' => 6,
                ],
                'items' => [
                    [
                        'name' => 'Hira Special Dosa',
                        'description' => 'Chef signature crisp crepe layered with spiced red chutney, paneer crumbles, mashed potato masala, and dry fruits.',
                        'price' => 255.00,
                        'serving_info' => 'Special King Size Dosa',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Masala Dosa',
                        'description' => 'Classic paper thin crisp crepe stuffed with tempered potato onion masala, accompanied by drumstick sambhar and coconut chutney.',
                        'price' => 215.00,
                        'serving_info' => 'Crisp Dosa with Sambhar & Chutneys',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Mysore Masala Dosa',
                        'description' => 'Crisp golden crepe coated inside with spicy garlic red chutney and stuffed with spiced potato mash.',
                        'price' => 230.00,
                        'serving_info' => 'Mysore Garlic Chutney Dosa',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Paneer Masala Dosa',
                        'description' => 'Crispy fermented crepe filled with seasoned cottage cheese shreds and onion coriander relish.',
                        'price' => 245.00,
                        'serving_info' => 'Paneer Stuffed Dosa',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Rice Idli (2 Pcs)',
                        'description' => 'Steamed fluffy rice and lentil cakes served with piping hot drumstick sambhar and fresh coconut chutney.',
                        'price' => 140.00,
                        'serving_info' => '2 Steamed Idlis with Sambhar',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Vada Sambhar (2 Pcs)',
                        'description' => 'Crispy golden medu vadas prepared with black gram lentils and cumin, served with hot sambhar.',
                        'price' => 140.00,
                        'serving_info' => '2 Medu Vadas with Sambhar',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Tomato Onion Uttapam',
                        'description' => 'Thick savory pancake griddled with chopped ripe tomatoes, red onions, green chilies, and fresh coriander.',
                        'price' => 235.00,
                        'serving_info' => 'Thick Griddled Uttapam',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Royal Thalis & Sizzling Platters (From 12:00 Noon)',
                    'slug' => 'royal-thalis-platters-hira',
                    'description' => 'Grand thali meals, South Indian samplers, and sizzling tandoori feasts with accompaniments.',
                    'sort_order' => 7,
                ],
                'items' => [
                    [
                        'name' => 'Deluxe Thali',
                        'description' => 'Grand royal feast: Dal Makhani, Shahi Paneer, Mix Veg, Pulao, Boondi Raita, Salad, Papad, 1 Baby Butter Naan, 1 Baby Lachha Parantha & 1 Sweet.',
                        'price' => 375.00,
                        'serving_info' => 'Grand 10-Item Royal Thali',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Mini Thali',
                        'description' => 'Dal Makhani, Shahi Paneer, Pulao, Boondi Raita, Salad, 2 Butter Rotis & 1 Sweet.',
                        'price' => 315.00,
                        'serving_info' => 'Wholesome Meal Thali',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'ECO Thali',
                        'description' => 'Dal Fry, Mix Veg, Steamed Pulao, Raita, Salad, Papad, 2 Butter Rotis & 1 Sweet.',
                        'price' => 295.00,
                        'serving_info' => 'Value Meal Thali',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Tandoori Sizzling Platter',
                        'description' => 'Tandoori Aloo, Veg Seekh Kabab, Paneer Tikka, Stuffed Mushroom served with 1 Baby Butter Naan & Dal Makhani.',
                        'price' => 399.00,
                        'serving_info' => 'Grand Tandoori Feast Platter',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'South Indian Platter',
                        'description' => '2 Pcs Idli, 2 Pcs Medu Vada, 1 Pc Mini Masala Dosa & 1 Pc Mini Veg Uttapam served with hot Sambhar, Coconut & Tomato Chutneys.',
                        'price' => 330.00,
                        'serving_info' => 'Complete South Indian Feast',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Chinese Platter',
                        'description' => 'Veg Hakka Noodles, Chilli Paneer Gravy, Veg Manchurian & Vegetable Fried Rice.',
                        'price' => 330.00,
                        'serving_info' => '4-in-1 Chinese Feast',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Chinese, Continental & Pizza Pasta',
                    'slug' => 'chinese-continental-pizza-hira',
                    'description' => 'Wok-tossed noodles, crispy chilli potato, Italian thin crust pizzas, and creamy pasta.',
                    'sort_order' => 8,
                ],
                'items' => [
                    [
                        'name' => 'Veg Hakka Noodles',
                        'description' => 'Stir-fried noodles tossed with julienned carrots, cabbage, capsicum, and light soya sauce.',
                        'price' => 199.00,
                        'serving_info' => '1 Bowl Wok Noodles',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Chilli Paneer (Dry / Gravy)',
                        'description' => 'Fried cottage cheese cubes tossed in spicy garlic soy sauce with bell peppers and green chilies.',
                        'price' => 285.00,
                        'serving_info' => 'Paneer in Chili Glaze',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Chilli Potato',
                        'description' => 'Crisp fried potato fingers glazed in spicy chili-garlic paste and spring onions.',
                        'price' => 180.00,
                        'serving_info' => 'Crispy Chili Potatoes',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Supreme Cheese Pizza',
                        'description' => 'Freshly baked thin crust pizza topped with mozzarella cheese, capsicum, sweet corn, onions, and black olives.',
                        'price' => 299.00,
                        'serving_info' => 'Oven Baked Pizza',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Alfredo White Sauce Pasta',
                        'description' => 'Penne pasta tossed in rich parmesan cream cheese sauce with sautéed mushrooms and sweet corn.',
                        'price' => 260.00,
                        'serving_info' => 'Creamy White Penne',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Beverages, Shakes & Coolers',
                    'slug' => 'beverages-shakes-coolers-hira',
                    'description' => 'Kulhad masala chai, rich Kesariya lassi, Badam Thandai, chilled fruit milkshakes, and heat buster mocktails.',
                    'sort_order' => 9,
                ],
                'items' => [
                    [
                        'name' => 'Kulhad Masala Chai',
                        'description' => 'Strong CTC tea brewed with freshly crushed ginger, green cardamom, and cloves served in clay cup.',
                        'price' => 55.00,
                        'serving_info' => '1 Earthen Kulhad Cup',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Kesariya Lassi',
                        'description' => 'Thick creamy Punjabi curd churned with saffron, crushed pistachios, and a layer of fresh malai.',
                        'price' => 110.00,
                        'serving_info' => 'Rich Saffron Lassi Glass',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Badam Thandai (Seasonal)',
                        'description' => 'Traditional cooling drink infused with crushed almonds, poppy seeds, fennel, and rose water.',
                        'price' => 95.00,
                        'serving_info' => 'Chilled Royal Thandai',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Cold Coffee with Ice Cream',
                        'description' => 'Chilled blended creamy coffee served with a generous scoop of vanilla ice cream and chocolate drizzle.',
                        'price' => 145.00,
                        'serving_info' => 'Tall Chilled Glass',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Cucumber Mint Cooler',
                        'description' => 'Crisp cooling beverage with fresh cucumber juice, crushed garden mint, and a touch of black salt.',
                        'price' => 115.00,
                        'serving_info' => 'Refreshing Chilled Cooler',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'All American Banana Split Sundae',
                        'description' => 'Classic banana split with scoops of vanilla, strawberry, and chocolate ice cream topped with fudge and nuts.',
                        'price' => 210.00,
                        'serving_info' => 'Triple Scoop Boat Sundae',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
        ];

        // 4. Seed categories & menu items strictly bound to this Canteen entity
        foreach ($menuData as $group) {
            $catRecord = Category::updateOrCreate(
                [
                    'canteen_id' => $canteen->id,
                    'slug' => $group['category']['slug'],
                ],
                [
                    'canteen_id' => $canteen->id,
                    'name' => $group['category']['name'],
                    'slug' => $group['category']['slug'],
                    'description' => $group['category']['description'],
                    'sort_order' => $group['category']['sort_order'],
                    'is_active' => true,
                ]
            );

            $itemOrder = 1;
            foreach ($group['items'] as $item) {
                MenuItem::updateOrCreate(
                    [
                        'canteen_id' => $canteen->id,
                        'category_id' => $catRecord->id,
                        'name' => $item['name'],
                    ],
                    [
                        'canteen_id' => $canteen->id,
                        'category_id' => $catRecord->id,
                        'name' => $item['name'],
                        'slug' => Str::slug($item['name']) . '-hira',
                        'description' => $item['description'],
                        'price_type' => 'fixed',
                        'price' => $item['price'],
                        'serving_info' => $item['serving_info'],
                        'is_featured' => $item['is_featured'],
                        'is_available' => true,
                        'sort_order' => $itemOrder++,
                        'image_path' => $item['image_path'],
                    ]
                );
            }
        }
    }
}
