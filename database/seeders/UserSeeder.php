<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [

            // ==========================
            // OWNER (YOU)
            // ==========================
            [
                'name' => 'Jibran Umar',
                'email' => 'jibranumar555@gmail.com',
                'password' => '11223344',
                'role' => UserRole::Owner,
            ],

            // ==========================
            // ADMIN
            // ==========================
            [
                'name' => 'System Admin',
                'email' => 'admin@pharmexa.com',
                'password' => 'password',
                'role' => UserRole::Admin,
            ],

            // ==========================
            // PHARMACIST
            // ==========================
            [
                'name' => 'Senior Pharmacist',
                'email' => 'pharmacist@pharmexa.com',
                'password' => 'password',
                'role' => UserRole::Pharmacist,
            ],

            // ==========================
            // CASHIER
            // ==========================
            [
                'name' => 'Cashier',
                'email' => 'cashier@pharmexa.com',
                'password' => 'password',
                'role' => UserRole::Cashier,
            ],

        ];

        foreach ($users as $user) {

            User::updateOrCreate(

                [
                    'email' => $user['email'],
                ],

                [
                    'name' => $user['name'],
                    'password' => Hash::make($user['password']),
                    'role' => $user['role'],
                    'email_verified_at' => now(),
                ]

            );

        }
    }
}