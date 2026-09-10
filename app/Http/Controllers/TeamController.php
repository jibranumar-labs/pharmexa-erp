<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    /**
     * Display the pharmacy team.
     */
    public function index(): Response
    {
        $user = auth()->user();
        $pharmacyId = $user->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $members = User::query()
            ->where('pharmacy_id', $pharmacyId)
          
            ->orderByRaw("
                CASE role
                    WHEN 'owner' THEN 1
                    WHEN 'admin' THEN 2
                    WHEN 'pharmacist' THEN 3
                    WHEN 'cashier' THEN 4
                    ELSE 5
                END
            ")
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'email',
                'role',
                'created_at',
            ]);

        return Inertia::render('Team/Index', [
            'members' => $members,
        ]);
    }

    /**
     * Create a new staff account for the logged-in pharmacy.
     */
    public function store(Request $request)
    {
        $currentUser = auth()->user();
        $pharmacyId = $currentUser->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'role' => [
                'required',
                Rule::in([
                    UserRole::Admin->value,
                    UserRole::Pharmacist->value,
                    UserRole::Cashier->value,
                ]),
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        User::create([
            'pharmacy_id' => $pharmacyId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Team member added successfully.');
    }

    /**
     * Update a staff member belonging to the logged-in pharmacy.
     */
    public function update(Request $request, User $teamMember)
    {
        $currentUser = auth()->user();
        $pharmacyId = $currentUser->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        abort_unless(
            (int) $teamMember->pharmacy_id === (int) $pharmacyId,
            403
        );

        abort_if($teamMember->isSuperOwner(), 403);
        abort_if($teamMember->isOwner(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($teamMember->id),
            ],
            'role' => [
                'required',
                Rule::in([
                    UserRole::Admin->value,
                    UserRole::Pharmacist->value,
                    UserRole::Cashier->value,
                ]),
            ],
            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $teamMember->name = $validated['name'];
        $teamMember->email = $validated['email'];
        $teamMember->role = $validated['role'];

        if (! empty($validated['password'])) {
            $teamMember->password = Hash::make($validated['password']);
        }

        $teamMember->save();

        return back()->with('success', 'Team member updated successfully.');
    }

    /**
     * Remove a staff member belonging to the logged-in pharmacy.
     */
    public function destroy(User $teamMember)
    {
        $currentUser = auth()->user();
        $pharmacyId = $currentUser->pharmacy_id;

        abort_if(! $pharmacyId, 403);

        abort_unless(
            (int) $teamMember->pharmacy_id === (int) $pharmacyId,
            403
        );

        abort_if($teamMember->isSuperOwner(), 403);
        abort_if($teamMember->isOwner(), 403);

        $teamMember->delete();

        return back()->with('success', 'Team member removed successfully.');
    }
}