<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BackupController extends Controller
{
    /**
     * Backup management page.
     *
     * Only the platform Super Owner may access database backups.
     */
    public function index(): Response
    {
        $this->authorizeSuperOwner();

        return Inertia::render('Backup/Index', [
            'database' => config('database.default'),

            'backupAvailable' => false,

            'message' => 'Production database backup will be available to the Super Owner only.',
        ]);
    }

    /**
     * Database download.
     *
     * Disabled until the production MySQL/MariaDB backup
     * implementation is configured.
     */
    public function download(): RedirectResponse
    {
        $this->authorizeSuperOwner();

        ActivityLog::record(
            'Backup',
            'Download Attempt',
            'Database Backup',
            'Database backup download requested, but production backup is not configured yet.'
        );

        return redirect()
            ->route('backup.index')
            ->with(
                'error',
                'Database backup is not configured yet.'
            );
    }

    /**
     * Ensure only the platform Super Owner can access backups.
     */
    private function authorizeSuperOwner(): void
    {
        $user = auth()->user();

        abort_if(! $user, 403);

        $isSuperOwner = method_exists($user, 'isSuperOwner')
            && $user->isSuperOwner();

        abort_unless($isSuperOwner, 403);
    }
}