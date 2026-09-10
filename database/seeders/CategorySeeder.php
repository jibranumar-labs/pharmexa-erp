<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [

            // Medicines
            'Pain Relief',
            'Antibiotics',
            'Antifungals',
            'Antivirals',
            'Antihistamines',
            'Diabetes Care',
            'Cardiovascular',
            'Respiratory',
            'Gastrointestinal',
            'Dermatology',
            'Eye Care',
            'Ear, Nose & Throat',
            'Hormones',
            'Vitamins & Supplements',

            // Pharmacy Products
            'Baby Care',
            'Personal Care',
            'Hair Care',
            'Skin Care',
            'Oral Care',
            'Cosmetics',

            // Equipment
            'Medical Devices',
            'Diagnostics',
            'First Aid',

            // General
            'Nutrition',
            'Prescription Medicines',
            'Over-the-Counter (OTC)',
            'General Merchandise',
        ];

        foreach ($categories as $category) {

            Category::firstOrCreate([
                'name' => $category,
            ]);

        }
    }
}