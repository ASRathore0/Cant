<?php

namespace Database\Seeders;

use App\Models\Canteen;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MadanSweetsSeeder extends Seeder
{
    /**
     * Run the database seeds for Madan Sweets & Restaurant.
     */
    public function run(): void
    {
        // 1. Create or update Madan Sweets & Restaurant Canteen Entity
        $canteen = Canteen::updateOrCreate(
            ['slug' => 'madan-sweets-restaurant'],
            [
                'name' => 'Madan Sweets & Restaurant',
                'page_title' => 'Madan Sweets & Restaurant | Sweets, Restaurant & Bakery Since 1985',
                'tagline' => 'Log Anek Swad Ek - The traditional taste of India',
                'logo_url' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=300&q=80',
                'favicon_url' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=64&q=80',
                'primary_color' => '#8B1E1E',
                'secondary_color' => '#6B1414',
                'accent_color' => '#D97706',
                'bg_color' => '#FDFBF7',
                'theme_preset' => 'burgundy',
                'dietary_type' => 'pure_veg',
                'pure_veg_label' => '100% Pure Vegetarian & Sweets',
                'address' => 'Sector-4, Central Plaza Market, Shahberi Road, Greater Noida West - 201009, G.B. Nagar',
                'location_landmark' => 'Central Plaza Market, Shahberi Road, Sector-4',
                'phone' => '+91 77718 68686',
                'whatsapp' => '+91 77738 68686',
                'opening_hours' => '08:00 AM – 11:00 PM (Everyday)',
                'hero_heading' => 'Log Anek Swad Ek — Authentic Desi Taste Since 1985',
                'hero_subheading' => 'Legendary desi ghee sweets, fresh morning puri sabji, tandoori delicacies, live eggless bakery cakes, and homestyle North Indian thalis served with authentic heritage since 1985.',
                'hero_badge' => 'Since 1985',
                'hero_trio' => [
                    ['name' => 'Desi Ghee Jalebi', 'price' => '₹56 / 100g', 'tag' => 'Morning Special'],
                    ['name' => 'Choley Bhature', 'price' => '₹149', 'tag' => 'Bestseller'],
                    ['name' => 'Special Royal Thali', 'price' => '₹355', 'tag' => 'Royal Meal'],
                ],
                'announcement_enabled' => true,
                'announcement_text' => 'Morning Happy Hour (8:30 AM - 11:45 AM): Special pricing on Puri Sabji, Choley Bhature, Dosas & Sandwiches! Free Home Delivery within 3km on orders above ₹400.',
                'discount_badge_enabled' => true,
                'discount_badge_title' => 'Free Home Delivery',
                'discount_badge_text' => 'Free Home Delivery within 3 km radius on orders above ₹400. Enquiries: 7771868686 / 7773868686.',
                'qr_target_url' => 'http://localhost:5173/menu?canteen=madan-sweets-restaurant',
                'is_active' => true,
                'is_default' => false,
            ]
        );

        // 2. Manager Account for Madan Sweets
        User::updateOrCreate(
            ['email' => 'madan@sweets.com'],
            [
                'name' => 'Madan Sweets Manager',
                'password' => 'Password@123',
                'role' => 'manager',
                'canteen_id' => $canteen->id,
                'email_verified_at' => now(),
            ]
        );

        // 3. Categories and Menu Items extracted directly from the physical menu brochure
        $menuData = [
            [
                'category' => [
                    'name' => 'Morning Specials & Breakfast (8:30 AM - 12:00 PM)',
                    'slug' => 'morning-specials-breakfast-madan',
                    'description' => 'Hot morning breakfast featuring bedmi puris, crispy kachoris, and fluffy choley bhature with Morning Happy Hour deals.',
                    'sort_order' => 1,
                ],
                'items' => [
                    [
                        'name' => 'Puri Sabji (4 Pcs)',
                        'description' => 'Crispy golden fried bedmi puris served with piping hot spiced potato curry and pickle. (Happy Hour: ₹58)',
                        'price' => 78.00,
                        'serving_info' => '4 Pcs with Aloo Sabji',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Puri Sabji with Raita',
                        'description' => 'Four freshly puffed puris accompanied by seasoned aloo sabji and cooling boondi raita. (Happy Hour: ₹80)',
                        'price' => 94.00,
                        'serving_info' => '4 Pcs with Raita & Sabji',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Sabji Kachori (2 Pcs)',
                        'description' => 'Crisp flaky dal kachoris crushed and topped with tangy hing-scented potato gravy.',
                        'price' => 56.00,
                        'serving_info' => '2 Pcs with Spicy Aloo Jhol',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Choley Bhature (Full Plate)',
                        'description' => 'Two signature paneer-stuffed jumbo bhature served with slow-cooked pindi choley, pickled onions, and mint dip. (Happy Hour: ₹135)',
                        'price' => 149.00,
                        'serving_info' => '2 Large Bhature + Choley',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Choley Bhature (Half Plate)',
                        'description' => 'Single jumbo bhatura served with authentic spiced chole and pickled chilies.',
                        'price' => 105.00,
                        'serving_info' => '1 Bhatura + Choley',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Pav Bhaji',
                        'description' => 'Mashed spiced seasonal vegetables simmered with Amul butter, served with two toasted soft pavs and lemon onion garnish. (Happy Hour: ₹140)',
                        'price' => 155.00,
                        'serving_info' => '2 Butter Pavs + Spiced Bhaji',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Grilled Sandwich',
                        'description' => 'Freshly buttered bread stuffed with spiced bell peppers, cucumbers, tomatoes and grilled crisp. (Happy Hour: ₹120)',
                        'price' => 135.00,
                        'serving_info' => '2 Jumbo Halves with Wafers',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Traditional Sweets & Desserts',
                    'slug' => 'traditional-sweets-desserts-madan',
                    'description' => 'Famous pure desi ghee Indian mithai, hot jalebi, rich halwas, and signature chenna sweets prepared daily.',
                    'sort_order' => 2,
                ],
                'items' => [
                    [
                        'name' => 'Desi Ghee Jalebi (100g)',
                        'description' => 'Freshly spiraled crispy jalebis fried in pure desi ghee and immersed in saffron sugar syrup. (Available 8-10:30am & 4-8pm)',
                        'price' => 56.00,
                        'serving_info' => '100g Hot Crisp Jalebi',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Gulab Jamun Desi Ghee (2 Pcs)',
                        'description' => 'Soft melt-in-the-mouth khoya dumplings fried in pure desi ghee and soaked in warm rose-cardamom syrup.',
                        'price' => 60.00,
                        'serving_info' => '2 Warm Pcs',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Rasmalai (2 Pcs)',
                        'description' => 'Delicate soft cottage cheese discs steeped in thickened saffron, pistachio, and cardamom infused milk.',
                        'price' => 90.00,
                        'serving_info' => '2 Chilled Pcs in Kesar Milk',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Rabdi Rasmalai (2 Pcs)',
                        'description' => 'Luxurious rasmalai layered with thick malai rabdi and toasted almond slivers.',
                        'price' => 120.00,
                        'serving_info' => '2 Pcs with Rich Malai Rabdi',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Rasgulla (2 Pcs)',
                        'description' => 'Classic spongy Kolkata-style chenna dumplings soaked in light aromatic sugar nectar.',
                        'price' => 40.00,
                        'serving_info' => '2 Spongy Chenna Pcs',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Raj Bhog (2 Pcs)',
                        'description' => 'Large saffron-infused chenna balls stuffed with dry fruits and hint of cardamom.',
                        'price' => 72.00,
                        'serving_info' => '2 Royal Stuffed Pcs',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Gajar Ka Halwa (100g)',
                        'description' => 'Seasonal red carrots slow cooked with whole milk mawa, pure desi ghee, cashews, and raisins.',
                        'price' => 64.00,
                        'serving_info' => '100g Desi Ghee Halwa',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Moong Dal Halwa (100g)',
                        'description' => 'Rich Rajasthani delicacy of roasted yellow lentils simmered in desi ghee with almond flakes.',
                        'price' => 64.00,
                        'serving_info' => '100g Rich Halwa',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Kulhar Wala Kesar Doodh',
                        'description' => 'Thick boiling milk reduced with saffron, pistachios, and almonds served hot in earthen kulhad.',
                        'price' => 80.00,
                        'serving_info' => '1 Hot Kulhad Milk',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Chaat Bhandar & Snacks',
                    'slug' => 'chaat-bhandar-snacks-madan',
                    'description' => 'Delhi-style street chaat, savory kachoris, hot samosas, and Gujarati dhokla preparations.',
                    'sort_order' => 3,
                ],
                'items' => [
                    [
                        'name' => 'Raj Kachori',
                        'description' => 'Crisp king-size kachori filled with spiced potatoes, sprouts, sweetened curd, tamarind saunth, and mint chutney.',
                        'price' => 135.00,
                        'serving_info' => '1 King Size Stuffed Kachori',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Dahi Bhalle',
                        'description' => 'Soft melt-in-mouth lentil dumplings immersed in velvety chilled curd, roasted cumin, and sweet dates chutney.',
                        'price' => 120.00,
                        'serving_info' => '1 Plate Chilled Curd Dumplings',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Bhalla Papdi Chaat',
                        'description' => 'Combination of soft bhalla and crisp flour papdis drizzled with sweet yogurt and spicy tangy chutneys.',
                        'price' => 120.00,
                        'serving_info' => '1 Full Plate Mix Chaat',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Aloo Tikki (Per Plate)',
                        'description' => 'Pan-fried golden crispy potato patties shallow-fried in desi ghee, served with curd and house chutneys.',
                        'price' => 105.00,
                        'serving_info' => '2 Desi Ghee Crisp Tikkis',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Pani Puri (6 Pcs)',
                        'description' => 'Crispy suji puris served with spiced potato and chickpea filling with chilled mint-coriander and sweet tamarind waters.',
                        'price' => 60.00,
                        'serving_info' => '6 Puris with Tangy Water',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Samosa (Per Pc)',
                        'description' => 'Iconic pyramid pastry packed with spiced potatoes, green peas, and cashews.',
                        'price' => 18.00,
                        'serving_info' => '1 Pc with Chutneys',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Khasta Kachori (Per Pc)',
                        'description' => 'Flaky crisp round kachori filled with seasoned urad dal and aromatic spices.',
                        'price' => 18.00,
                        'serving_info' => '1 Pc with Chutneys',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Paneer Pakora (Per Pc)',
                        'description' => 'Thick slab of fresh malai paneer sandwiching green chutney, dipped in spiced gram flour batter and fried golden.',
                        'price' => 33.00,
                        'serving_info' => '1 Large Paneer Pakora',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Bread Pakoda (Per Pc)',
                        'description' => 'Triangular bread stuffed with potato masala and fried with gram flour crust.',
                        'price' => 28.00,
                        'serving_info' => '1 Large Triangle',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Sandwich Dhokla (Per Kg)',
                        'description' => 'Steamed spongy savory gram flour cake layered with coriander chutney and mustard tempering.',
                        'price' => 320.00,
                        'serving_info' => '1 Kg Box Gujarati Style',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Tandoori Starters & Snacks (11:00 AM - 10:30 PM)',
                    'slug' => 'tandoori-starters-snacks-madan',
                    'description' => 'Smoky clay oven tandoori soya chaap varieties, marinated paneer tikkas, and sizzling platters.',
                    'sort_order' => 4,
                ],
                'items' => [
                    [
                        'name' => 'Malai Chaap',
                        'description' => 'Succulent soya chaap chunks marinated in rich cream, cashew paste, mild cheese, and grilled over charcoal.',
                        'price' => 280.00,
                        'serving_info' => 'Creamy Roasted Chaap Plate',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Achari Chaap',
                        'description' => 'Soya chaap tossed in zesty pickling spices and mustard oil, charred to smoky perfection.',
                        'price' => 280.00,
                        'serving_info' => 'Tangy Spiced Chaap',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Afgani Chaap',
                        'description' => 'Mildly spiced soya chaap steeped in yogurt, white pepper, and roasted garlic emulsion.',
                        'price' => 290.00,
                        'serving_info' => 'Rich Cashew Cream Chaap',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Paneer Tikka',
                        'description' => 'Cubed fresh cottage cheese, diced onions, and crunchy capsicum marinated in spiced hung curd and ajwain.',
                        'price' => 280.00,
                        'serving_info' => '6 Charred Cottage Cheese Cubes',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Mushroom Tikka',
                        'description' => 'Button mushrooms stuffed with spiced cottage cheese and roasted in clay tandoor.',
                        'price' => 310.00,
                        'serving_info' => 'Stuffed Button Mushrooms',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Veg Seekh Kabab',
                        'description' => 'Finely minced garden vegetables and herbs molded onto skewers and char-grilled.',
                        'price' => 245.00,
                        'serving_info' => '4 Skewered Vegetable Kababs',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Tandoori Sizzling Platter',
                        'description' => 'Grand combination of Malai Chaap, Paneer Tikka, Veg Seekh Kabab, and Stuffed Mushroom served with butter naan.',
                        'price' => 349.00,
                        'serving_info' => 'Assorted Tandoori Mix',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'North Indian Curries & Royal Thalis',
                    'slug' => 'north-indian-curries-thalis-madan',
                    'description' => 'Rich paneer curries, slow-simmered dal makhani, fragrant basmati rice, and wholesome royal thalis.',
                    'sort_order' => 5,
                ],
                'items' => [
                    [
                        'name' => 'Shahi Paneer',
                        'description' => 'Fresh cottage cheese simmered in a royal velvety cashew nut and tomato gravy scented with shahi jeera.',
                        'price' => 290.00,
                        'serving_info' => 'Rich Royal Gravy Bowl',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Kadahi Paneer',
                        'description' => 'Paneer tossed in an iron wok with fresh ground coriander seeds, dry red chilies, bell peppers, and diced onions.',
                        'price' => 290.00,
                        'serving_info' => 'Wok Tossed Spiced Paneer',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Dal Makhani',
                        'description' => 'Signature whole black lentils and kidney beans slow-cooked overnight with white butter and rich cream.',
                        'price' => 275.00,
                        'serving_info' => 'Slow Simmered Creamy Dal',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Dal Tadka',
                        'description' => 'Yellow arhar lentils tempered with desi ghee, cumin seeds, garlic, and Kashmiri whole red chilies.',
                        'price' => 250.00,
                        'serving_info' => 'Desi Ghee Tempered Dal',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Malai Kofta',
                        'description' => 'Crispy paneer and dry-fruit stuffed dumplings bathed in a delicate mild golden cashew gravy.',
                        'price' => 285.00,
                        'serving_info' => 'Velvet Creamy Kofta',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Choley Masala',
                        'description' => 'Authentic Punjabi chickpeas cooked in a dark tea-leaf infusion with pomegranate seeds and garam masala.',
                        'price' => 210.00,
                        'serving_info' => 'Traditional Pindi Chana',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Special Royal Thali',
                        'description' => 'Complete feast: Shahi Paneer, Dal Makhani, Seasonal Mix Veg, Raita, Jeera Rice, 1 Butter Naan, 1 Lachha Paratha, Desi Ghee Sweet & Salad.',
                        'price' => 355.00,
                        'serving_info' => 'Grand 9-Item Royal Platter',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Deluxe Thali',
                        'description' => 'Shahi Paneer, Dal Makhani, Steamed Basmati Rice, Boondi Raita, 2 Tandoori Breads, Sweet & Salad.',
                        'price' => 305.00,
                        'serving_info' => 'Wholesome Deluxe Thali',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Normal Homestyle Thali',
                        'description' => 'Dal Makhani, Seasonal Dry Vegetable, Rice, Boondi Raita, 2 Lachha Parathas & Pickle.',
                        'price' => 285.00,
                        'serving_info' => 'Daily Homestyle Meal',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'South Indian Delicacies (11:00 AM - 10:30 PM)',
                    'slug' => 'south-indian-delicacies-madan',
                    'description' => 'Crispy fermented rice-lentil dosas, fluffy steamed idlis, medu vadas, and authentic drumstick sambhar.',
                    'sort_order' => 6,
                ],
                'items' => [
                    [
                        'name' => 'Masala Dosa',
                        'description' => 'Paper-thin golden crepe filled with mustard-tempered potato masala, served with piping hot sambhar and dual chutneys. (Happy Hour: ₹185)',
                        'price' => 195.00,
                        'serving_info' => 'Crisp Dosa with Sambhar & Chutneys',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Plain Dosa',
                        'description' => 'Classic crisp fermented crepe made on tawa, served with coconut chutney and fresh sambhar. (Happy Hour: ₹145)',
                        'price' => 160.00,
                        'serving_info' => 'Crisp Plain Crepe',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Onion Masala Dosa',
                        'description' => 'Crispy dosa loaded with roasted onions, fresh green chilies, and potato masala filling.',
                        'price' => 205.00,
                        'serving_info' => 'Caramelized Onion Dosa',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Paneer Dosa',
                        'description' => 'Crispy crepe stuffed with generous seasoned malai paneer shredding and coriander.',
                        'price' => 220.00,
                        'serving_info' => 'Paneer Stuffed Dosa',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Idli Sambhar (2 Pcs)',
                        'description' => 'Steamed fluffy rice cakes served immersed in spicy tamarind and drumstick sambhar with coconut chutney. (Happy Hour: ₹115)',
                        'price' => 130.00,
                        'serving_info' => '2 Steamed Idlis with Sambhar',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Vada Sambhar (2 Pcs)',
                        'description' => 'Crispy golden fried lentil donuts with a soft fluffy interior, accompanied by hot sambhar. (Happy Hour: ₹115)',
                        'price' => 130.00,
                        'serving_info' => '2 Crispy Medu Vadas',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'South Indian Platter',
                        'description' => 'Grand sampler containing 1 Mini Masala Dosa, 1 Mini Veg Uttapam, 1 Steamed Idli, and 1 Medu Vada.',
                        'price' => 299.00,
                        'serving_info' => '4-in-1 South Indian Platter',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Indo-Chinese & Steamed Momos',
                    'slug' => 'indo-chinese-momos-madan',
                    'description' => 'Wok-tossed noodles, crunchy momos, honey chilli potato, and sizzled Manchurian favorites.',
                    'sort_order' => 7,
                ],
                'items' => [
                    [
                        'name' => 'Veg Hakka Noodles',
                        'description' => 'Chinese-style wok-tossed noodles with shredded cabbage, carrots, bell peppers, and scallions.',
                        'price' => 149.00,
                        'serving_info' => '1 Bowl Wok Noodles',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Chilli Paneer (Dry / Gravy)',
                        'description' => 'Crispy fried cottage cheese cubes tossed in spicy soy chili sauce with crunchy onions and capsicum.',
                        'price' => 260.00,
                        'serving_info' => 'Paneer in Chili Glaze',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Honey Chilli Potato',
                        'description' => 'Crispy potato batons coated with sweet honey, spicy chili garlic paste, and toasted sesame seeds.',
                        'price' => 205.00,
                        'serving_info' => 'Crispy Sesame Potatoes',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Veg Manchurian Gravy',
                        'description' => 'Minced vegetable dumplings simmered in an aromatic dark garlic and scallion broth.',
                        'price' => 245.00,
                        'serving_info' => 'Vegetable Balls in Sauce',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Steamed Veg Momos (6 Pcs)',
                        'description' => 'Thin pastry pockets stuffed with cabbage, carrots, and onions, served with blazing spicy red garlic chutney.',
                        'price' => 90.00,
                        'serving_info' => '6 Steamed Dumplings',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Kurkure Paneer Momos (6 Pcs)',
                        'description' => 'Seasoned paneer dumplings coated in crunchy cornflake crust and fried golden.',
                        'price' => 115.00,
                        'serving_info' => '6 Crunchy Fried Momos',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
            [
                'category' => [
                    'name' => 'Beverages, Shakes & Waffles',
                    'slug' => 'beverages-shakes-waffles-madan',
                    'description' => 'Kulhad tea, premium ice cream milkshakes, refreshing mojitos, ice cream sodas, and Belgian waffles.',
                    'sort_order' => 8,
                ],
                'items' => [
                    [
                        'name' => 'Hot Masala Tea',
                        'description' => 'Traditional tea boiled with fresh crushed ginger, green cardamom, and cloves served in earthen cup.',
                        'price' => 42.00,
                        'serving_info' => '1 Kulhad Cup',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Madan Special Dryfruit Shake',
                        'description' => 'Signature rich thick shake blended with almonds, pistachios, saffron, and cream.',
                        'price' => 165.00,
                        'serving_info' => '350ml Signature Glass',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Chocolate Cold Coffee with Ice Cream',
                        'description' => 'Creamy blended coffee infused with dark chocolate syrup and topped with rich vanilla ice cream.',
                        'price' => 155.00,
                        'serving_info' => 'Tall Chilled Glass',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Mint Mojito',
                        'description' => 'Crisp chilled cooler with crushed mint leaves, fresh lime wedges, simple syrup, and fizz.',
                        'price' => 110.00,
                        'serving_info' => 'Refreshing Chilled Cooler',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Rabri Kulfi Faluda',
                        'description' => 'Traditional matka kulfi cut and topped with rich chilled malai rabri, cornstarch sev faluda, and rose syrup.',
                        'price' => 90.00,
                        'serving_info' => 'Royal Sundae Cup',
                        'is_featured' => true,
                        'image_path' => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
                    ],
                    [
                        'name' => 'Nutella Fudge Waffle',
                        'description' => 'Crisp warm Belgian waffle slathered with genuine Nutella spread and rich chocolate fudge.',
                        'price' => 185.00,
                        'serving_info' => 'Full Warm Waffle Plate',
                        'is_featured' => false,
                        'image_path' => 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80',
                    ],
                ],
            ],
        ];

        // 4. Seed each category and its menu items strictly bound to this Canteen entity
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
                        'slug' => Str::slug($item['name']) . '-madan',
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
