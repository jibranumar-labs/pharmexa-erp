<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperOwnerSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@pharmexa.com'],
            [
                'name' => 'Super Owner',
                'password' => Hash::make('Admin@123'),
                'role' => UserRole::SuperOwner,
                'pharmacy_id' => null,
            ]
        );
    }
}