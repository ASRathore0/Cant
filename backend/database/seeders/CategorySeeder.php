<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Breakfast Specials',
                'slug' => 'breakfast-specials',
                'description' => 'Crispy snacks, quick bites, hot noodles, and freshly prepared morning savouries.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Breakfast & Parathas',
                'slug' => 'breakfast-parathas',
                'description' => 'Stuffed tawa parathas served with creamy curd, spicy kachori sabji, and refreshing raita.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Lunch & Thalis',
                'slug' => 'lunch-thalis',
                'description' => 'Homestyle Indian meals, fragrant rice combinations, and complete wholesome thalis.',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Sandwiches',
                'slug' => 'sandwiches',
                'description' => 'Toasted rolls, sweet treats, and hearty grilled vegetable sandwiches.',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Shakes & Beverages',
                'slug' => 'shakes-beverages',
                'description' => 'Chilled milkshakes, thick Punjabi lassi, spiced sikanji, and freshly brewed hot tea.',
                'sort_order' => 5,
                'is_active' => true,
            ],
        ];

        $defaultCanteenId = \App\Models\Canteen::where('slug', 'annapoorna-canteen')->value('id') ?? 1;
        foreach ($categories as $cat) {
            $cat['canteen_id'] = $defaultCanteenId;
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
