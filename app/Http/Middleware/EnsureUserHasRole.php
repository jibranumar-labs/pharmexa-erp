<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(
        Request $request,
        Closure $next,
        string ...$roles
    ): Response {
        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | Require authenticated user
        |--------------------------------------------------------------------------
        */

        if (! $user) {
            abort(403, 'You must be logged in to access this resource.');
        }

        /*
        |--------------------------------------------------------------------------
        | Normalize allowed roles
        |--------------------------------------------------------------------------
        |
        | Examples:
        |
        | role:owner
        | role:owner,admin
        | role:owner,admin,pharmacist
        |
        */

        $allowedRoles = array_map(
            function (string $role): string {
                return UserRole::tryFrom($role)?->value ?? $role;
            },
            $roles
        );

        /*
        |--------------------------------------------------------------------------
        | Check permission
        |--------------------------------------------------------------------------
        */

        if (! $user->hasAnyRole($allowedRoles)) {
            abort(
                403,
                'You do not have permission to access this resource.'
            );
        }

        return $next($request);
    }
}