<?php

namespace App\Services\Traceability;

use App\Models\TraceabilityTransaction;
use Illuminate\Database\Eloquent\Collection;

class QueueService
{
    /**
     * Get all pending transactions.
     */
    public function pending(): Collection
    {
        return TraceabilityTransaction::with('sale')
            ->where('status', 'pending')
            ->orderBy('id')
            ->get();
    }

    /**
     * Get all processing transactions.
     */
    public function processing(): Collection
    {
        return TraceabilityTransaction::with('sale')
            ->where('status', 'processing')
            ->orderBy('id')
            ->get();
    }

    /**
     * Get all failed transactions.
     */
    public function failed(): Collection
    {
        return TraceabilityTransaction::with('sale')
            ->where('status', 'failed')
            ->latest()
            ->get();
    }

    /**
     * Find transaction by ID.
     */
    public function find(int $id): ?TraceabilityTransaction
    {
        return TraceabilityTransaction::with([
            'items',
            'sale',
        ])->find($id);
    }

    /**
     * Pending transaction count.
     */
    public function pendingCount(): int
    {
        return TraceabilityTransaction::where(
            'status',
            'pending'
        )->count();
    }

    /**
     * Processing transaction count.
     */
    public function processingCount(): int
    {
        return TraceabilityTransaction::where(
            'status',
            'processing'
        )->count();
    }

    /**
     * Failed transaction count.
     */
    public function failedCount(): int
    {
        return TraceabilityTransaction::where(
            'status',
            'failed'
        )->count();
    }

    /**
     * Sent transaction count.
     */
    public function sentCount(): int
    {
        return TraceabilityTransaction::where(
            'status',
            'sent'
        )->count();
    }

    /**
     * Total transaction count.
     */
    public function totalCount(): int
    {
        return TraceabilityTransaction::count();
    }
}