<?php

namespace App\Http\Controllers\Platform;

use App\Exceptions\DuplicateGlobalMedicineException;
use App\Http\Controllers\Controller;
use App\Models\GlobalMedicineContribution;
use App\Services\GlobalMedicineUpdateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class GlobalMedicineContributionController extends Controller
{
    /**
     * Display pending global medicine contributions.
     *
     * Only the Pharmexa Super Owner should review and publish
     * global catalogue corrections.
     */
    public function index(Request $request): Response
    {
        $status = $request->input('status', 'pending');
        $search = trim((string) $request->input('search'));

        $allowedStatuses = [
            'pending',
            'approved',
            'rejected',
        ];

        if (! in_array($status, $allowedStatuses, true)) {
            $status = 'pending';
        }

        $contributions = GlobalMedicineContribution::query()
            ->with([
                'pharmacy',
                'user',
                'medicine',
                'reviewedBy',
            ])
            ->where('status', $status)
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('gtin', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%")
                        ->orWhere('field_name', 'like', "%{$search}%")
                        ->orWhere('proposed_value', 'like', "%{$search}%")
                        ->orWhere('raw_gs1_data', 'like', "%{$search}%")
                        ->orWhere('payload->name', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render(
            'Platform/GlobalMedicineContributions/Index',
            [
                'contributions' => $contributions,

                'filters' => [
                    'status' => $status,
                    'search' => $search,
                ],

                'stats' => [
                    'pending' => GlobalMedicineContribution::where(
                        'status',
                        'pending'
                    )->count(),

                    'approved' => GlobalMedicineContribution::where(
                        'status',
                        'approved'
                    )->count(),

                    'rejected' => GlobalMedicineContribution::where(
                        'status',
                        'rejected'
                    )->count(),
                ],
            ]
        );
    }

    /**
     * Show one contribution in detail before approval/rejection.
     */
    public function show(
        GlobalMedicineContribution $contribution
    ): Response {
        $contribution->load([
            'pharmacy',
            'user',
            'medicine',
            'reviewedBy',
        ]);

        return Inertia::render(
            'Platform/GlobalMedicineContributions/Show',
            [
                'contribution' => $contribution,
            ]
        );
    }

    /**
     * Approve a pending contribution.
     *
     * The service performs the actual global update,
     * pharmacy synchronization and version-history creation.
     */
    public function approve(
        Request $request,
        GlobalMedicineContribution $contribution,
        GlobalMedicineUpdateService $updateService
    ): RedirectResponse {
        $validated = $request->validate([
            'review_note' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        try {
            $updateService->approveContribution(
                $contribution->id,
                auth()->id(),
                $validated['review_note'] ?? null
            );
        } catch (DuplicateGlobalMedicineException $exception) {
            return redirect()
                ->route(
                    'platform.global-medicine-contributions.show',
                    $contribution
                )
                ->with('error', $exception->getMessage());
        } catch (RuntimeException $exception) {
            return redirect()
                ->route(
                    'platform.global-medicine-contributions.show',
                    $contribution
                )
                ->with('error', $exception->getMessage());
        }

        return redirect()
            ->route(
                'platform.global-medicine-contributions.show',
                $contribution
            )
            ->with(
                'success',
                'The contribution was approved and the global medicine catalogue was updated successfully.'
            );
    }

    /**
     * Reject a pending contribution.
     */
    public function reject(
        Request $request,
        GlobalMedicineContribution $contribution,
        GlobalMedicineUpdateService $updateService
    ): RedirectResponse {
        $validated = $request->validate([
            'review_note' => [
                'required',
                'string',
                'max:5000',
            ],
        ]);

        try {
            $updateService->rejectContribution(
                $contribution->id,
                auth()->id(),
                $validated['review_note']
            );
        } catch (RuntimeException $exception) {
            return redirect()
                ->route(
                    'platform.global-medicine-contributions.show',
                    $contribution
                )
                ->with('error', $exception->getMessage());
        }

        return redirect()
            ->route(
                'platform.global-medicine-contributions.show',
                $contribution
            )
            ->with(
                'success',
                'The contribution was rejected and kept in the verification history.'
            );
    }
}