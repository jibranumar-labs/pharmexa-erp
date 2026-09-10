<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();

        abort_if(! $user, 403);

        $search = trim((string) $request->input('search', ''));

        $query = ActivityLog::query()
            ->with('user');

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Isolation
        |--------------------------------------------------------------------------
        |
        | Normal pharmacy users can only see their pharmacy's activity.
        |
        | Super Owner can see all logs.
        |
        */

        if (! $this->isSuperOwner($user)) {
            abort_if(! $user->pharmacy_id, 403);

            $query->where(
                'pharmacy_id',
                $user->pharmacy_id
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where(
                    'module',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'action',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'record_name',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'description',
                    'like',
                    "%{$search}%"
                )
                ->orWhereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where(
                        'name',
                        'like',
                        "%{$search}%"
                    );
                });
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Logs
        |--------------------------------------------------------------------------
        */

        $logs = $query
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('ActivityLogs/Index', [
            'logs' => $logs,

            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Super Owner Check
    |--------------------------------------------------------------------------
    */

    private function isSuperOwner($user): bool
    {
        if (method_exists($user, 'isSuperOwner')) {
            return $user->isSuperOwner();
        }

        return false;
    }
}