<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CanteenSeeder::class,
            AdminUserSeeder::class,
            CategorySeeder::class,
            MenuItemSeeder::class,
            RestaurantSettingSeeder::class,
            MadanSweetsSeeder::class,
            HiraSweetsSeeder::class,
            ChaiTadkaSeeder::class,
            KrishnaDhabaSeeder::class,
        ]);
    }
}
