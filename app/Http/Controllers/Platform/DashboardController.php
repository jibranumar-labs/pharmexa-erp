<?php

namespace App\Http\Controllers\Platform;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Pharmacy Statistics
        |--------------------------------------------------------------------------
        */

        $totalPharmacies = Pharmacy::count();

        $activePharmacies = Pharmacy::where('status', true)->count();

        $inactivePharmacies = Pharmacy::where('status', false)->count();

        /*
        |--------------------------------------------------------------------------
        | Pharmacy User Statistics
        |--------------------------------------------------------------------------
        |
        | Only users attached to a pharmacy are counted here.
        | The platform Super Owner is NOT counted as a pharmacy user.
        |
        */

        $pharmacyUsers = User::query()
            ->whereNotNull('pharmacy_id');

        $totalUsers = (clone $pharmacyUsers)->count();

        $owners = (clone $pharmacyUsers)
            ->where('role', UserRole::Owner->value)
            ->count();

        $pharmacists = (clone $pharmacyUsers)
            ->where('role', UserRole::Pharmacist->value)
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Recent Pharmacies
        |--------------------------------------------------------------------------
        */

        $recentPharmacies = Pharmacy::query()
            ->latest()
            ->take(5)
            ->get([
                'id',
                'name',
                'owner_name',
                'email',
                'status',
                'created_at',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Recent Pharmacy Users
        |--------------------------------------------------------------------------
        |
        | Again, exclude platform-level accounts such as Super Owner.
        |
        */

        $recentUsers = User::query()
            ->whereNotNull('pharmacy_id')
            ->latest()
            ->take(5)
            ->get([
                'id',
                'pharmacy_id',
                'name',
                'email',
                'role',
                'created_at',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Render Platform Dashboard
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Platform/Dashboard', [
            'stats' => [
                'totalPharmacies' => $totalPharmacies,
                'activePharmacies' => $activePharmacies,
                'inactivePharmacies' => $inactivePharmacies,
                'totalUsers' => $totalUsers,
                'owners' => $owners,
                'pharmacists' => $pharmacists,
            ],

            'recentPharmacies' => $recentPharmacies,

            'recentUsers' => $recentUsers,
        ]);
    }
}