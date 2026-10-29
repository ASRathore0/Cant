<?php

namespace Database\Seeders;

use App\Models\Canteen;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KrishnaDhabaSeeder extends Seeder
{
    /**
     * Run the database seeds for Krishna Fast Food and Family Dhaba.
     */
    public function run(): void
    {
        // 1. Create or update Krishna Fast Food & Family Dhaba Canteen Entity
        $canteen = Canteen::updateOrCreate(
            ['slug' => 'krishna-dhaba'],
            [
                'name' => 'Krishna Fast Food & Family Dhaba',
                'page_title' => 'Krishna Fast Food & Family Dhaba | Pure Veg Dhaba & Chinese',
                'tagline' => 'स्वाद ऐसा जो घर की याद दिला दे | Real Desi Dhaba Taste',
                'logo_url' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
                'favicon_url' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=64&q=80',
                'primary_color' => '#9A3412',
                'secondary_color' => '#7C2D12',
                'accent_color' => '#F59E0B',
                'bg_color' => '#FDFBF7',
                'theme_preset' => 'amber',
                'dietary_type' => 'pure_veg',
                'pure_veg_label' => '100% Pure Vegetarian Dhaba',
                'address' => 'Main Highway Road (Proprietor: Aditya Pandit, Lic. No: 22724441000795)',
                'location_landmark' => 'Prop. Aditya Pandit, Lic. No: 22724441000795',
                'phone' => '+91 94114 79706',
                'whatsapp' => '+91 96251 46241',
                'opening_hours' => '09:00 AM – 11:30 PM (Daily)',
                'hero_heading' => 'कृष्णा फास्ट फूड एण्ड फैमिली ढाबा',
                'hero_subheading' => 'Authentic Desi Highway Dhaba Tadka, Handi Paneer Curries, Slow-Cooked Dal Makhani, Fresh Tandoori Rotis, Chinese Delights, Crispy Dosas & Homestyle Thalis starting at just ₹70.',
                'hero_badge' => 'Prop. Aditya Pandit',
                'hero_trio' => [
                    [
                        'name' => 'Shahi Maharaja Thali',
                        'price' => '₹220',
                        'searchTerm' => 'thali',
                        'stickerUrl' => '/stickers/thali.jpg',
                        'showSteam' => true,
                    ],
                    [
                        'name' => 'Dal Makhani',
                        'price' => '₹90',
                        'searchTerm' => 'dal',
                        'stickerUrl' => '/stickers/dal.jpg',
                        'showSteam' => true,
                    ],
                    [
                        'name' => 'Paneer Butter Masala',
                        'price' => '₹120',
                        'searchTerm' => 'paneer',
                        'stickerUrl' => '/stickers/paneer.jpg',
                        'showSteam' => false,
                    ],
                ],
                'announcement_enabled' => true,
                'announcement_text' => 'Welcome to Krishna Fast Food & Family Dhaba! Pure veg hearty meals, combos & special thalis starting at ₹70. Takeaway & Party Orders: +91 9411479706 / +91 9625146241.',
                'discount_badge_enabled' => true,
                'discount_badge_title' => 'Family Thali Special ₹70',
                'discount_badge_text' => 'Complete wholesome lunch & dinner thali starting at just ₹70! Call for orders: 9411479706 / 9625146241.',
                'qr_target_url' => 'http://localhost:5173/menu?canteen=krishna-dhaba',
                'is_active' => true,
                'is_default' => false,
            ]
        );

        // 2. Create or update Manager Account for Krishna Dhaba
        User::updateOrCreate(
            ['email' => 'krishnadhaba@gmail.com'],
            [
                'name' => 'Aditya Pandit (Manager)',
                'password' => 'Password@123',
                'role' => 'manager',
                'canteen_id' => $canteen->id,
                'email_verified_at' => now(),
            ]
        );

        // 3. Menu Categories and Items extracted directly from the physical menu board
        $menuData = [
            // ---------------------------------------------------------
            // 1. ढाबा स्पेशल थाली (Special Thalis)
            // ---------------------------------------------------------
            [
                'category' => [
                    'name' => 'ढाबा स्पेशल थाली (Special Thalis)',
                    'slug' => 'thali-krishna-dhaba',
                    'description' => 'Complete, wholesome and balanced meal platters prepared fresh in authentic desi ghee and mustard oil.',
                    'sort_order' => 1,
                ],
                'items' => [
                    [
                        'name' => 'सादा थाली / रेगुलर थाली (Regular Thali)',
                        'description' => '1 मौसमी सब्जी, पीली दाल, स्टीम्ड चावल, 4 तवा रोटियां और ताजा सलाद। Wholesome daily meal.',
                        'price' => 70.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Sabji, Dal, Chawal, 4 Roti, Salad',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'स्पेशल थाली (Special Thali)',
                        'description' => '1 मौसमी सब्जी, दाल तड़का, पनीर की सब्जी, बासमती चावल, 4 रोटियां एवं सलाद का बेहतरीन संगम।',
                        'price' => 100.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Sabji, Dal, Paneer Sabji, Chawal, 4 Roti, Salad',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'डीलक्स थाली (Deluxe Thali)',
                        'description' => 'मटर पनीर, पीली दाल तड़का, सुगंधित जीरा राईस, 4 गरमा-गरम बटर रोटियां, कुरकुरा पापड़, सलाद और ठंडा रायता।',
                        'price' => 160.00,
                        'price_type' => 'fixed',
                        'serving_info' => 'Matar Paneer, Dal, Jeera Rice, 4 Butter Roti, Papad, Salad, Raita',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'शाही महाराजा थाली (Royal Shahi Thali)',
                        'description' => 'शाही पनीर, मक्खनी दाल मखनी, मिक्स वेज, वेज पुलाव, 4 बटर रोटी, मीठा गुलाबजामुन, पापड़, सलाद और रायता।',
                        'price' => 220.00,
                        'price_type' => 'fixed',
                        'serving_info' => 'Shahi Paneer, Dal Makhani, Mix Veg, Veg Pulao, 4 Butter Roti, Gulab Jamun, Papad, Salad, Raita',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],

            // ---------------------------------------------------------
            // 2. पनीर स्पेशल (Paneer Specials)
            // ---------------------------------------------------------
            [
                'category' => [
                    'name' => 'पनीर स्पेशल (Paneer Specials)',
                    'slug' => 'paneer-specials-krishna-dhaba',
                    'description' => 'Fresh cottage cheese cooked in authentic rich Indian gravies, infused with whole spices and fresh herbs.',
                    'sort_order' => 2,
                ],
                'items' => [
                    [
                        'name' => 'मटर पनीर (Matar Paneer)',
                        'description' => 'Tender green peas and soft paneer cubes simmered in a spiced onion-tomato dhaba gravy.',
                        'price' => 90.00,
                        'price_max' => 170.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹90 | Full ₹170',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'शाही पनीर (Shahi Paneer)',
                        'description' => 'Royal preparation of paneer simmered in a silky smooth, fragrant cashew and cream tomato gravy.',
                        'price' => 100.00,
                        'price_max' => 170.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹170',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'कढ़ाई पनीर (Kadhai Paneer)',
                        'description' => 'Cottage cheese wok-tossed with freshly crushed coriander seeds, bell peppers, and roasted masala.',
                        'price' => 100.00,
                        'price_max' => 170.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹170',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पालक पनीर (Palak Paneer)',
                        'description' => 'Fresh tender paneer cubes cooked in a wholesome, garlic-infused creamy spinach puree.',
                        'price' => 100.00,
                        'price_max' => 170.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹170',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर दो प्याजा (Paneer Do Pyaza)',
                        'description' => 'Paneer tossed with generous caramelized shallots, crunchy onion petals, and aromatic spices.',
                        'price' => 110.00,
                        'price_max' => 180.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹110 | Full ₹180',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर बटर मसाला (Paneer Butter Masala)',
                        'description' => 'Silky butter gravy made with ripe red tomatoes, cream, and tender cottage cheese chunks.',
                        'price' => 120.00,
                        'price_max' => 230.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹120 | Full ₹230',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर लबाबदार (Paneer Lababdar)',
                        'description' => 'Rich cottage cheese in a velvety makhani sauce infused with grated paneer and kasuri methi.',
                        'price' => 110.00,
                        'price_max' => 190.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹110 | Full ₹190',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर भुर्जी (Paneer Bhurji)',
                        'description' => 'Scrambled fresh paneer sauteed with juicy tomatoes, green chillies, ginger, and desi spices.',
                        'price' => 130.00,
                        'price_max' => 230.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹130 | Full ₹230',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर टिक्का (Paneer Tikka Masala / Dry)',
                        'description' => 'Marinated paneer cubes charcoal-roasted with spiced bell peppers and onions in tandoor.',
                        'price' => 150.00,
                        'price_max' => 270.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹150 | Full ₹270',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],

            // ---------------------------------------------------------
            // 3. दाल बहार (Dal Delicacies)
            // ---------------------------------------------------------
            [
                'category' => [
                    'name' => 'दाल बहार (Dal Delicacies)',
                    'slug' => 'dal-specials-krishna-dhaba',
                    'description' => 'Slow-cooked lentils tempered with garlic, cumin, red chillies and pure desi ghee.',
                    'sort_order' => 3,
                ],
                'items' => [
                    [
                        'name' => 'दाल मखनी (Dal Makhani)',
                        'description' => 'Signature black lentils and kidney beans slow-cooked overnight with white butter and fresh cream.',
                        'price' => 90.00,
                        'price_max' => 160.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹90 | Full ₹160',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'दाल फ्राई (Dal Fry)',
                        'description' => 'Yellow lentils cooked till tender and tossed with onions, tomatoes, and fragrant spices.',
                        'price' => 70.00,
                        'price_max' => 110.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹70 | Full ₹110',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'दाल तड़का (Dal Tadka)',
                        'description' => 'Yellow toor dal finished with a crackling tadka of cumin, garlic, and whole dried red chillies.',
                        'price' => 80.00,
                        'price_max' => 120.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹80 | Full ₹120',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'दाल पंजाबी (Dal Punjabi)',
                        'description' => 'Hearty Punjabi style spiced mixed lentils infused with ginger, hing, and fresh coriander.',
                        'price' => 80.00,
                        'price_max' => 130.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹80 | Full ₹130',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'लहसुनी दाल तड़का (Lehsuni Dal Tadka)',
                        'description' => 'Aromatic yellow dal loaded with double roasted golden garlic cloves and Kashmiri chilli tempering.',
                        'price' => 90.00,
                        'price_max' => 150.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹90 | Full ₹150',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'दाल पचरंगा (Dal Pachranga)',
                        'description' => 'Traditional five-lentil wholesome blend simmered with rustic dhaba spices.',
                        'price' => 80.00,
                        'price_max' => 120.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹80 | Full ₹120',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'मिक्स दाल (Mix Dal)',
                        'description' => 'Nutritious melange of lentils tempered with onions, tomatoes, and ground spices.',
                        'price' => 80.00,
                        'price_max' => 120.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹80 | Full ₹120',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'दाल खिचड़ी (Dal Khichdi)',
                        'description' => 'Comforting homestyle preparation of rice and lentils simmered with light cumin tempering.',
                        'price' => 100.00,
                        'price_max' => 180.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹180',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],

            // ---------------------------------------------------------
            // 4. सब्जी एवं मशरूम (Sabji & Mushroom Delights)
            // ---------------------------------------------------------
            [
                'category' => [
                    'name' => 'सब्जी एवं मशरूम (Vegetable & Mushroom)',
                    'slug' => 'sabji-mushroom-krishna-dhaba',
                    'description' => 'Farm fresh vegetables and button mushrooms cooked in traditional North Indian styles.',
                    'sort_order' => 4,
                ],
                'items' => [
                    [
                        'name' => 'मिक्स वेज (Mix Veg)',
                        'description' => 'Medley of seasonal vegetables including cauliflower, carrots, beans, and peas cooked in dry dhaba masala.',
                        'price' => 90.00,
                        'price_max' => 160.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹90 | Full ₹160',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'आलू मटर (Aloo Matar)',
                        'description' => 'Homestyle potato and sweet green peas gravy spiced with ginger, cumin, and coriander.',
                        'price' => 70.00,
                        'price_max' => 120.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹70 | Full ₹120',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'आलू जीरा (Aloo Jeera)',
                        'description' => 'Boiled potatoes sauteed with abundant roasted cumin seeds, turmeric, and fresh green chillies.',
                        'price' => 70.00,
                        'price_max' => 120.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹70 | Full ₹120',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'दम आलू (Dum Aloo)',
                        'description' => 'Baby potatoes slow-cooked on dum in a rich, tangy tomato and yogurt gravy.',
                        'price' => 100.00,
                        'price_max' => 170.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹170',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'दम आलू कश्मीरी (Dum Aloo Kashmiri)',
                        'description' => 'Kashmiri style baby potatoes simmered in a mildly sweet fennel and dry ginger infused red gravy.',
                        'price' => 120.00,
                        'price_max' => 180.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹120 | Full ₹180',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'सेव टमाटर (Sev Tamatar)',
                        'description' => 'Kathiyawadi & Rajasthani dhaba special crispy ratlami sev simmered in a tangy spiced tomato curry.',
                        'price' => 100.00,
                        'price_max' => 160.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹160',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'सेव भाजी (Sev Bhaji)',
                        'description' => 'Crisp savoury sev served with a rich aromatic onion-tomato spiced curry.',
                        'price' => 100.00,
                        'price_max' => 160.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹160',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'मटर मशरूम (Matar Mushroom)',
                        'description' => 'Juicy fresh button mushrooms and sweet green peas simmered in a dhaba style masala gravy.',
                        'price' => 110.00,
                        'price_max' => 170.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹110 | Full ₹170',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'मशरूम मसाला (Mushroom Masala)',
                        'description' => 'Tender mushroom slices tossed in a spicy, thick onion-tomato gravy with aromatic garam masala.',
                        'price' => 110.00,
                        'price_max' => 180.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹110 | Full ₹180',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'कढ़ाई मशरूम (Kadhai Mushroom)',
                        'description' => 'Mushroom slices wok-cooked with crisp bell peppers, onions, and freshly ground kadhai spices.',
                        'price' => 110.00,
                        'price_max' => 180.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹110 | Full ₹180',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'मशरूम दो प्याजा (Mushroom Do Pyaza)',
                        'description' => 'Plump mushrooms prepared with twice the onions—browned and sauteed chunky petals.',
                        'price' => 100.00,
                        'price_max' => 170.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹170',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर मशरूम (Paneer Mushroom)',
                        'description' => 'Special combination of soft paneer cubes and juicy button mushrooms in rich curry.',
                        'price' => 130.00,
                        'price_max' => 200.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹130 | Full ₹200',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],

            // ---------------------------------------------------------
            // 5. सोया चाप स्पेशल (Soya Chaap Specials)
            // ---------------------------------------------------------
            [
                'category' => [
                    'name' => 'सोया चाप स्पेशल (Soya Chaap Specials)',
                    'slug' => 'chaap-specials-krishna-dhaba',
                    'description' => 'Succulent protein-rich soya chaap marinated and cooked in flavorful thick gravies.',
                    'sort_order' => 5,
                ],
                'items' => [
                    [
                        'name' => 'कढ़ाई चाप (Kadhai Chaap)',
                        'description' => 'Juicy soya chaap pieces cooked with crunchy capsicum and onion in a robust coriander-spiced gravy.',
                        'price' => 100.00,
                        'price_max' => 160.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹160',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'मसाला चाप (Masala Chaap)',
                        'description' => 'Marinated soya chaap cooked in a thick spicy onion-tomato gravy with roasted ground spices.',
                        'price' => 100.00,
                        'price_max' => 160.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹160',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'चाप लबाबदार (Chaap Lababdar)',
                        'description' => 'Tender soya chaap simmered in a luscious creamy tomato sauce flavored with melon seeds and fenugreek.',
                        'price' => 100.00,
                        'price_max' => 170.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹170',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'मलाई चाप (Malai Chaap Gravy)',
                        'description' => 'Mild and creamy soya chaap cooked in cashew cream, white pepper, and melted butter.',
                        'price' => 100.00,
                        'price_max' => 180.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹180',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'चाप बटर मसाला (Chaap Butter Masala)',
                        'description' => 'Chef special soya chaap tossed in a rich, buttery makhani gravy garnished with fresh cream.',
                        'price' => 130.00,
                        'price_max' => 190.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹130 | Full ₹190',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],

            // ---------------------------------------------------------
            // 6. चावल एवं पुलाव (Rice & Pulao)
            // ---------------------------------------------------------
            [
                'category' => [
                    'name' => 'चावल एवं पुलाव (Rice & Pulao)',
                    'slug' => 'rice-pulao-krishna-dhaba',
                    'description' => 'Long grain fragrant basmati rice dishes cooked to fluffy perfection.',
                    'sort_order' => 6,
                ],
                'items' => [
                    [
                        'name' => 'प्लेन राईस (Plain Rice)',
                        'description' => 'Steamed long grain aromatic basmati rice.',
                        'price' => 50.00,
                        'price_max' => 90.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹50 | Full ₹90',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'जीरा राईस (Jeera Rice)',
                        'description' => 'Fluffy basmati rice tempered with roasted cumin seeds and fresh green coriander.',
                        'price' => 60.00,
                        'price_max' => 100.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹60 | Full ₹100',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'वेज फ्राई राईस (Veg Fried Rice)',
                        'description' => 'Wok-tossed rice with finely chopped garden vegetables, soy sauce, and mild pepper.',
                        'price' => 80.00,
                        'price_max' => 140.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹80 | Full ₹140',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर फ्राई राईस (Paneer Fried Rice)',
                        'description' => 'Wok-fried rice tossed with crisp cottage cheese cubes, capsicum, and oriental sauces.',
                        'price' => 90.00,
                        'price_max' => 150.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹90 | Full ₹150',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'वेज पुलाव (Veg Pulao)',
                        'description' => 'Fragrant basmati rice gently spiced with whole cardamom, cloves, and mixed vegetables.',
                        'price' => 90.00,
                        'price_max' => 140.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹90 | Full ₹140',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर पुलाव (Paneer Pulao)',
                        'description' => 'Basmati rice cooked with lightly browned paneer cubes, whole spices, and green peas.',
                        'price' => 90.00,
                        'price_max' => 150.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹90 | Full ₹150',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],

            // ---------------------------------------------------------
            // 7. रायता एवं दही (Raita & Dahi)
            // ---------------------------------------------------------
            [
                'category' => [
                    'name' => 'रायता एवं दही (Raita & Dahi)',
                    'slug' => 'raita-dahi-krishna-dhaba',
                    'description' => 'Cooling fresh curd preparations flavored with roasted cumin, mint, and black salt.',
                    'sort_order' => 7,
                ],
                'items' => [
                    [
                        'name' => 'प्लेन रायता (Plain Raita)',
                        'description' => 'Whisked fresh curd lightly seasoned with roasted jeera powder and rock salt.',
                        'price' => 20.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Bowl',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'बूंदी रायता (Boondi Raita)',
                        'description' => 'Crispy fried gram flour boondi soaked in chilled seasoned spiced yogurt.',
                        'price' => 25.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Bowl',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'आलू रायता (Aloo Raita)',
                        'description' => 'Boiled diced potatoes mixed with chilled spiced curd and fresh mint.',
                        'price' => 30.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Bowl',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'मिक्स वेज रायता (Mix Veg Raita)',
                        'description' => 'Refreshing curd blended with finely diced cucumbers, tomatoes, and onions.',
                        'price' => 40.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Bowl',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'दही फ्राई (Dahi Fry / Tadka Dahi)',
                        'description' => 'Thick curd tempered with mustard seeds, curry leaves, garlic, and dried red chillies.',
                        'price' => 70.00,
                        'price_max' => 120.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹70 | Full ₹120',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],

            // ---------------------------------------------------------
            // 8. रोटी, पराठा एवं नान (Tawa & Tandoori Breads)
            // ---------------------------------------------------------
            [
                'category' => [
                    'name' => 'रोटी, पराठा एवं नान (Breads & Parathas)',
                    'slug' => 'breads-parathas-krishna-dhaba',
                    'description' => 'Freshly rolled tawa rotis and clay oven baked tandoori breads brushed with fresh butter.',
                    'sort_order' => 8,
                ],
                'items' => [
                    [
                        'name' => 'तवा रोटी (Tawa Roti)',
                        'description' => 'Freshly puffed whole wheat flatbread made on tawa.',
                        'price' => 6.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'तवा बटर रोटी (Tawa Butter Roti)',
                        'description' => 'Hot whole wheat tawa roti generously brushed with fresh butter.',
                        'price' => 8.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'तन्दूरी रोटी (Tandoori Roti)',
                        'description' => 'Traditional whole wheat bread baked crisp inside charcoal clay tandoor.',
                        'price' => 8.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'तन्दूरी बटर रोटी (Tandoori Butter Roti)',
                        'description' => 'Crisp clay tandoor baked wheat roti finished with melted butter.',
                        'price' => 10.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'लच्छा पराठा (Lachha Paratha)',
                        'description' => 'Multi-layered crispy, flaky whole wheat flatbread baked in tandoor with pure ghee.',
                        'price' => 35.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'प्लेन पराठा (Plain Paratha)',
                        'description' => 'Pan-toasted golden flaky paratha.',
                        'price' => 20.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'आलू पराठा (Aloo Paratha)',
                        'description' => 'Whole wheat paratha stuffed with seasoned mashed spiced potatoes, cooked to golden crisp.',
                        'price' => 50.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'तन्दूरी आलू पराठा (Tandoori Aloo Paratha)',
                        'description' => 'Spiced potato stuffed paratha baked in hot clay tandoor with crispy charred edges.',
                        'price' => 50.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'स्टफ पराठा (Stuffed Mix Paratha)',
                        'description' => 'Flatbread loaded with mixed spiced vegetables and herbs, grilled with golden butter.',
                        'price' => 70.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर पराठा (Paneer Paratha)',
                        'description' => 'Grated seasoned fresh cottage cheese stuffed in whole wheat dough and roasted with butter.',
                        'price' => 90.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'प्लेन नान (Plain Naan)',
                        'description' => 'Traditional leavened soft white flatbread baked against the hot wall of tandoor.',
                        'price' => 25.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'बटर नान (Butter Naan)',
                        'description' => 'Soft, chewy tandoori naan brushed generously with rich melted butter.',
                        'price' => 35.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'गार्लिक नान (Garlic Naan)',
                        'description' => 'Tandoori naan topped with finely minced roasted garlic and fresh coriander leaves.',
                        'price' => 40.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'आलू नान (Aloo Naan)',
                        'description' => 'Soft naan dough filled with spiced mashed potato filling and baked crisp in tandoor.',
                        'price' => 40.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'स्टफ नान (Stuffed Naan)',
                        'description' => 'Leavened flatbread stuffed with spiced mixed vegetables and paneer, served hot with butter.',
                        'price' => 50.00,
                        'price_type' => 'fixed',
                        'serving_info' => '1 Pc',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],

            // ---------------------------------------------------------
            // 9. चाइनीज एवं स्नैक्स (Chinese & Snacks)
            // ---------------------------------------------------------
            [
                'category' => [
                    'name' => 'चाइनीज एवं स्नैक्स (Chinese & Snacks)',
                    'slug' => 'chinese-snacks-krishna-dhaba',
                    'description' => 'Popular Indo-Chinese wok specialities, crispy dumplings, and spicy appetisers.',
                    'sort_order' => 9,
                ],
                'items' => [
                    [
                        'name' => 'वेज नूडल्स (Veg Noodles)',
                        'description' => 'Wok-tossed hakka noodles with sliced crunchy vegetables, soy sauce, and white pepper.',
                        'price' => 70.00,
                        'price_max' => 120.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹70 | Full ₹120',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर नूडल्स (Paneer Noodles)',
                        'description' => 'Stir-fried noodles loaded with golden paneer strips, spring onions, and oriental sauces.',
                        'price' => 90.00,
                        'price_max' => 150.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹90 | Full ₹150',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'वेज मंचूरियन ड्राई (Veg Manchurian Dry)',
                        'description' => 'Crisp mixed vegetable balls tossed with ginger, garlic, green chillies, and dark soya glaze.',
                        'price' => 100.00,
                        'price_max' => 170.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹170',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'वेज मंचूरियन ग्रेवी (Veg Manchurian Gravy)',
                        'description' => 'Savory fried veggie dumplings simmered in a rich garlic-soya sauce with spring onions.',
                        'price' => 100.00,
                        'price_max' => 180.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹180',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'चिल्ली पोटेटो (Chilli Potato)',
                        'description' => 'Crispy fried potato fingers tossed in spicy chili paste, garlic, and toasted sesame seeds.',
                        'price' => 80.00,
                        'price_max' => 120.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹80 | Full ₹120',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'चिल्ली पनीर (Chilli Paneer)',
                        'description' => 'Golden batter-fried paneer cubes wok-tossed with capsicum, onions, and spicy schezwan-soya sauce.',
                        'price' => 120.00,
                        'price_max' => 210.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹120 | Full ₹210',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'फ्रेंच फ्राई (French Fries)',
                        'description' => 'Golden crisp salted potato fries served with tangy tomato ketchup.',
                        'price' => 70.00,
                        'price_max' => 120.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹70 | Full ₹120',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'वेज मोमोज (Veg Momos)',
                        'description' => 'Steamed dumplings filled with finely grated vegetables, served with fiery red chutney.',
                        'price' => 60.00,
                        'price_max' => 100.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹60 | Full ₹100',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b4?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर मोमोज (Paneer Momos)',
                        'description' => 'Steamed thin-wrapper dumplings stuffed with fresh seasoned paneer and mild herbs.',
                        'price' => 70.00,
                        'price_max' => 110.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹70 | Full ₹110',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b4?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर कुरकुरा (Paneer Kurkura)',
                        'description' => 'Super crunchy crumb-coated spiced paneer sticks fried to deep golden perfection.',
                        'price' => 100.00,
                        'price_max' => 190.00,
                        'price_type' => 'range',
                        'serving_info' => 'Half ₹100 | Full ₹190',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],

            // ---------------------------------------------------------
            // 10. साउथ इंडियन एवं पाव भाजी (South Indian & Pav Bhaji)
            // ---------------------------------------------------------
            [
                'category' => [
                    'name' => 'साउथ इंडियन एवं पाव भाजी (South Indian & Pav Bhaji)',
                    'slug' => 'south-indian-pav-bhaji-krishna-dhaba',
                    'description' => 'Crisp fermented rice crepes, piping hot sambar, coconut chutney, and buttery Mumbai pav bhaji.',
                    'sort_order' => 10,
                ],
                'items' => [
                    [
                        'name' => 'पेपर डोसा (Paper Dosa / Plain Dosa)',
                        'description' => 'Ultra-thin, paper-crisp golden dosa served with piping hot dal sambar and fresh coconut chutney.',
                        'price' => 120.00,
                        'price_type' => 'fixed',
                        'serving_info' => 'Full Plate with Sambar & Chutney',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'मसाला डोसा (Masala Dosa)',
                        'description' => 'Golden crisp crepe stuffed with spiced mustard-tempered potato masala, served with sambar & chutney.',
                        'price' => 80.00,
                        'price_type' => 'fixed',
                        'serving_info' => 'Full Plate with Sambar & Chutney',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पनीर मसाला डोसा (Paneer Masala Dosa)',
                        'description' => 'Crispy dosa loaded with spiced mashed potatoes and grated fresh cottage cheese, accompanied by sambar.',
                        'price' => 100.00,
                        'price_type' => 'fixed',
                        'serving_info' => 'Full Plate with Sambar & Chutney',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'पाव भाजी (Pav Bhaji - 2 Pc)',
                        'description' => 'Mashed spiced seasonal vegetables cooked with generous dollops of butter, served with 2 toasted pavs and onions.',
                        'price' => 100.00,
                        'price_type' => 'fixed',
                        'serving_info' => '2 Butter Pavs with Bhaji',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
        ];

        // 4. Seed Categories and Dishes linked to Krishna Fast Food & Family Dhaba
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
                        'slug' => Str::slug($item['name'] . '-krishna-dhaba'),
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

