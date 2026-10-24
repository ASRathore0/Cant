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
                'name' => 'Annapoorna Admin',
                'password' => 'Annapoorna@2026',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
