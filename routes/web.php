<?php
use Inertia\Inertia;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\BarcodeLabelController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\MedicineImportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Platform\DashboardController as PlatformDashboardController;
use App\Http\Controllers\Platform\GlobalMedicineController;
use App\Http\Controllers\Platform\GlobalMedicineContributionController;
use App\Http\Controllers\Platform\PharmacyController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\PrintController;
use App\Http\Controllers\ProfitLossController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\PurchaseReturnController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReportExportController;
use App\Http\Controllers\DailyCashRecordController;
use App\Http\Controllers\SaleReturnController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\Admin\Traceability\DashboardController as TraceabilityDashboardController;
use App\Http\Controllers\Admin\Traceability\SettingsController as TraceabilitySettingsController;
use App\Http\Controllers\Admin\Traceability\TransactionController;
use App\Http\Controllers\Admin\Traceability\StockMatchController;
use App\Http\Controllers\Admin\Traceability\DrugController;
use App\Http\Controllers\Admin\Traceability\LogController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Root
|--------------------------------------------------------------------------
*/

Route::get('/', function () {

    // Guest → Public Pharmexa Landing Page
    if (!auth()->check()) {
        return Inertia::render('Welcome');
    }

    // Super Owner → Platform Dashboard
    if (auth()->user()->isSuperOwner()) {
        return redirect()->route('platform.dashboard');
    }

    // Normal authenticated users → Pharmacy Dashboard
    return redirect()->route('dashboard');

})->name('home');

/*
|--------------------------------------------------------------------------
| Authenticated + Verified Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Profile
    |--------------------------------------------------------------------------
    |
    | Available to Super Owner and pharmacy users.
    |
    */

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    /*
    |--------------------------------------------------------------------------
    | Platform / Super Owner
    |--------------------------------------------------------------------------
    */

   Route::middleware('role:super_owner')->group(function () {

    Route::get('/platform/dashboard', PlatformDashboardController::class)
        ->name('platform.dashboard');

    Route::prefix('platform')
        ->name('platform.')
        ->group(function () {

            Route::resource(
                'pharmacies',
                PharmacyController::class
            );

            Route::resource(
                'medicines',
                GlobalMedicineController::class
            )->names('medicines');

          Route::resource(
    'global-medicine-contributions',
    GlobalMedicineContributionController::class
)->only([
    'index',
    'show',
])->parameters([
    'global-medicine-contributions' => 'contribution',
]);

            Route::post(
                'global-medicine-contributions/{contribution}/approve',
                [GlobalMedicineContributionController::class, 'approve']
            )->name('global-medicine-contributions.approve');

            Route::post(
                'global-medicine-contributions/{contribution}/reject',
                [GlobalMedicineContributionController::class, 'reject']
            )->name('global-medicine-contributions.reject');
        });
});

    /*
    |--------------------------------------------------------------------------
    | Pharmacy ERP
    |--------------------------------------------------------------------------
    |
    | Super Owner is intentionally excluded.
    |
    */

    Route::middleware('role:owner,admin,pharmacist,cashier')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        Route::get('/dashboard', DashboardController::class)
            ->name('dashboard');

        /*
        |--------------------------------------------------------------------------
        | POS
        |--------------------------------------------------------------------------
        */

        Route::get('/pos', [PosController::class, 'index'])
            ->name('pos.index');

        Route::post('/pos', [PosController::class, 'store'])
            ->name('pos.store');

        /*
        |--------------------------------------------------------------------------
        | Sales
        |--------------------------------------------------------------------------
        */

        Route::get('/sales', [SalesController::class, 'index'])
            ->name('sales.index');

        Route::get('/sales/{sale}', [SalesController::class, 'show'])
            ->name('sales.show');

        Route::get('/sales/{sale}/print', [PrintController::class, 'sale'])
            ->name('sales.print');

        Route::get('/sales/{sale}/thermal', [PrintController::class, 'thermalReceipt'])
            ->name('sales.thermal');

        Route::get('/sales/{sale}/dosage-stickers', [PrintController::class, 'allDosageStickers'])
            ->name('sales.dosage-stickers');

        Route::get('/print/dosage-sticker/{saleItem}', [PrintController::class, 'dosageSticker'])
            ->name('print.dosage-sticker');

        /*
        |--------------------------------------------------------------------------
        | Customers
        |--------------------------------------------------------------------------
        */

        Route::resource('customers', CustomerController::class);

        /*
        |--------------------------------------------------------------------------
        | Notifications
        |--------------------------------------------------------------------------
        */

        Route::get('/notifications', [NotificationController::class, 'index'])
            ->name('notifications.index');

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        Route::get('/search', SearchController::class)
            ->name('search');
    });

    /*
    |--------------------------------------------------------------------------
    | Inventory / Pharmacist Operations
    |--------------------------------------------------------------------------
    |
    | Owner + Admin + Pharmacist
    |
    */

    Route::middleware('role:owner,admin,pharmacist')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Inventory
        |--------------------------------------------------------------------------
        */

        Route::get('/inventory', InventoryController::class)
            ->name('inventory.index');
/*
|--------------------------------------------------------------------------
| Daily Cash Records
|--------------------------------------------------------------------------
*/

Route::resource('daily-cash-records', DailyCashRecordController::class)
    ->except(['show']);
        /*
        |--------------------------------------------------------------------------
        | Medicines
        |--------------------------------------------------------------------------
        */

    Route::get('/medicines/scan', [MedicineController::class, 'scan'])
    ->name('medicines.scan');
Route::post(
    '/medicines/search-barcode',
    [MedicineController::class, 'searchBarcode']
)->name('medicines.search-barcode');
Route::get(
    '/medicines/search-existing',
    [MedicineController::class, 'searchExisting']
)->name('medicines.search-existing');

Route::post(
    '/medicines/link-barcode',
    [MedicineController::class, 'linkBarcode']
)->name('medicines.link-barcode');
Route::post(
    '/medicines/{medicine}/submit-to-global-catalogue',
    [MedicineController::class, 'submitToGlobalCatalogue']
)->name('medicines.submit-to-global-catalogue');

Route::get(
    '/medicines/{medicine}/export-new-product',
    [MedicineController::class, 'exportNewProduct']
)->name('medicines.export-new-product');

Route::resource('medicines', MedicineController::class);

Route::get('/medicines/{medicine}/label', [BarcodeLabelController::class, 'show'])
    ->name('medicines.label');

        /*
        |--------------------------------------------------------------------------
        | Medicine Import
        |--------------------------------------------------------------------------
        */

        Route::get('/medicines/import', [MedicineImportController::class, 'index'])
            ->name('medicines.import');

        Route::post('/medicines/import', [MedicineImportController::class, 'store'])
            ->name('medicines.import.store');

        /*
        |--------------------------------------------------------------------------
        | Stock
        |--------------------------------------------------------------------------
        */

        Route::get('/medicines/{medicine}/stock', [StockMovementController::class, 'create'])
            ->name('medicines.stock.create');

        Route::post('/medicines/{medicine}/stock', [StockMovementController::class, 'store'])
            ->name('medicines.stock.store');

        Route::get('/stock-history', [StockMovementController::class, 'index'])
            ->name('stock.history');

        /*
        |--------------------------------------------------------------------------
        | Expiry Management
        |--------------------------------------------------------------------------
        */

        Route::get('/expiry-management', [MedicineController::class, 'expiryManagement'])
            ->name('medicines.expiry');

        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        Route::resource('categories', CategoryController::class);

        /*
        |--------------------------------------------------------------------------
        | Suppliers
        |--------------------------------------------------------------------------
        */

        Route::resource('suppliers', SupplierController::class);

        /*
        |--------------------------------------------------------------------------
        | Purchases
        |--------------------------------------------------------------------------
        */

        Route::resource('purchases', PurchaseController::class);

        Route::get('/purchases/{purchase}/print', [PrintController::class, 'purchase'])
            ->name('purchases.print');

        /*
        |--------------------------------------------------------------------------
        | Purchase Returns
        |--------------------------------------------------------------------------
        */

        Route::resource('purchase-returns', PurchaseReturnController::class);

        Route::get('/purchase-returns/{purchaseReturn}/print', [PrintController::class, 'purchaseReturn'])
            ->name('purchase-returns.print');

        /*
        |--------------------------------------------------------------------------
        | Sales Returns
        |--------------------------------------------------------------------------
        */

        Route::resource('sale-returns', SaleReturnController::class);

        Route::get('/sale-returns/{saleReturn}/print', [PrintController::class, 'saleReturn'])
            ->name('sale-returns.print');
    });

    /*
    |--------------------------------------------------------------------------
    | Management
    |--------------------------------------------------------------------------
    |
    | Owner + Admin
    |
    */
Route::middleware('role:owner,admin')
    ->prefix('admin/traceability')
    ->name('admin.traceability.')
    ->group(function () {

        Route::get('/', TraceabilityDashboardController::class)
            ->name('dashboard');

        Route::get('/settings', [TraceabilitySettingsController::class, 'index'])
            ->name('settings');

        Route::post('/settings', [TraceabilitySettingsController::class, 'store'])
            ->name('settings.save');

        Route::get('/transactions', [TransactionController::class, 'index'])
            ->name('transactions');
        Route::get('/stock-match/export', [StockMatchController::class, 'export'])
    ->name('stock-match.export');
        Route::get('/failed', [TransactionController::class, 'failed'])
            ->name('failed');

        Route::get('/logs', [LogController::class, 'index'])
            ->name('logs');

        Route::post('/sync-drugs', [DrugController::class, 'sync'])
            ->name('sync.drugs');
    });
    Route::middleware('role:owner,admin')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Expenses
        |--------------------------------------------------------------------------
        */

        Route::resource('expenses', ExpenseController::class);

        /*
        |--------------------------------------------------------------------------
        | Profit & Loss
        |--------------------------------------------------------------------------
        */

        Route::get('/profit-loss', [ProfitLossController::class, 'index'])
            ->name('profit-loss.index');

        Route::get('/profit-loss/print', [ProfitLossController::class, 'print'])
            ->name('profit-loss.print');

        Route::get('/profit-loss/pdf', [ProfitLossController::class, 'pdf'])
            ->name('profit-loss.pdf');

        /*
        |--------------------------------------------------------------------------
        | Reports
        |--------------------------------------------------------------------------
        */

        Route::get('/reports', [ReportController::class, 'index'])
            ->name('reports.index');

        Route::get('/reports/export/pdf', [ReportExportController::class, 'pdf'])
            ->name('reports.export.pdf');

        Route::get('/reports/export/excel', [ReportExportController::class, 'excel'])
            ->name('reports.export.excel');

        Route::get('/reports/export/csv', [ReportExportController::class, 'csv'])
            ->name('reports.export.csv');

        /*
        |--------------------------------------------------------------------------
        | Activity Logs
        |--------------------------------------------------------------------------
        */

        Route::get('/activity-logs', [ActivityLogController::class, 'index'])
            ->name('activity-logs.index');

        /*
        |--------------------------------------------------------------------------
        | Settings
        |--------------------------------------------------------------------------
        */

        Route::get('/settings', [SettingsController::class, 'index'])
            ->name('settings.index');

        Route::put('/settings', [SettingsController::class, 'update'])
            ->name('settings.update');
    });

    /*
    |--------------------------------------------------------------------------
    | Owner Only
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:owner')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Team & Access
        |--------------------------------------------------------------------------
        */

        Route::get('/team', [TeamController::class, 'index'])
            ->name('team.index');

        Route::post('/team', [TeamController::class, 'store'])
            ->name('team.store');

        Route::put('/team/{teamMember}', [TeamController::class, 'update'])
            ->name('team.update');

        Route::delete('/team/{teamMember}', [TeamController::class, 'destroy'])
            ->name('team.destroy');

        /*
        |--------------------------------------------------------------------------
        | Backup
        |--------------------------------------------------------------------------
        */

        Route::get('/backup', [BackupController::class, 'index'])
            ->name('backup.index');

        Route::get('/backup/download', [BackupController::class, 'download'])
            ->name('backup.download');
    });
});

require __DIR__.'/auth.php';