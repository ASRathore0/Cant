<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@annapoornacanteen.com'],
            [
                'name' => 'Annapoorna Super Admin',
                'password' => 'Annapoorna@2026',
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@canteen.com'],
            [
                'name' => 'Platform Super Admin',
                'password' => 'canteen@2026',
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
