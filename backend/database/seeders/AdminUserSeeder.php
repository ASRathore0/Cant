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
                'password' => 'Annapoorna@2026',
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );

        $annapoorna = \App\Models\Canteen::where('slug', 'annapoorna-canteen')->first();
        User::updateOrCreate(
            ['email' => 'amit.btechcse@gmail.com'],
            [
                'name' => 'Amit Singh',
                'password' => 'Password@123',
                'role' => 'manager',
                'canteen_id' => $annapoorna?->id ?? 1,
                'email_verified_at' => now(),
            ]
        );

        $techCafe = \App\Models\Canteen::where('slug', 'chai-bytes-cafe')->first();
        User::updateOrCreate(
            ['email' => 'Abhi@gmail.com'],
            [
                'name' => 'Abhishek',
                'password' => 'Password@123',
                'role' => 'manager',
                'canteen_id' => $techCafe?->id ?? 2,
                'email_verified_at' => now(),
            ]
        );
    }
}
