<?php

use App\Http\Controllers\Api\AdminCategoryController;
use App\Http\Controllers\Api\AdminCanteenController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminMenuItemController;
use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AdminSettingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicMenuController;
use App\Http\Controllers\Api\PublicOrderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (Customer QR Menu & Info)
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {
    Route::get('/menu', [PublicMenuController::class, 'menu']);
    Route::get('/categories', [PublicMenuController::class, 'categories']);
    Route::get('/restaurant', [PublicMenuController::class, 'restaurant']);
    Route::get('/canteens', [PublicMenuController::class, 'canteens']);
    Route::post('/qr-scans', [PublicMenuController::class, 'recordScan']);

    // Customer QR Ordering Routes
    Route::post('/orders', [PublicOrderController::class, 'store']);
    Route::get('/orders/{orderNumber}', [PublicOrderController::class, 'show']);

    // Admin Authentication (Public login)
    Route::post('/admin/login', [AuthController::class, 'login']);

    /*
    |--------------------------------------------------------------------------
    | Protected Admin Routes (Sanctum Authenticated)
    |--------------------------------------------------------------------------
    */
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Menu Items Management
        Route::get('/menu-items', [AdminMenuItemController::class, 'index']);
        Route::post('/menu-items', [AdminMenuItemController::class, 'store']);
        Route::get('/menu-items/{id}', [AdminMenuItemController::class, 'show']);
        Route::post('/menu-items/{id}', [AdminMenuItemController::class, 'update']);
        Route::put('/menu-items/{id}', [AdminMenuItemController::class, 'update']);
        Route::delete('/menu-items/{id}', [AdminMenuItemController::class, 'destroy']);
        Route::patch('/menu-items/{id}/availability', [AdminMenuItemController::class, 'toggleAvailability']);
        Route::patch('/menu-items/{id}/featured', [AdminMenuItemController::class, 'toggleFeatured']);
        Route::post('/menu-items/reorder', [AdminMenuItemController::class, 'reorder']);

        // Categories Management
        Route::get('/categories', [AdminCategoryController::class, 'index']);
        Route::post('/categories', [AdminCategoryController::class, 'store']);
        Route::get('/categories/{id}', [AdminCategoryController::class, 'show']);
        Route::put('/categories/{id}', [AdminCategoryController::class, 'update']);
        Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);
        Route::post('/categories/reorder', [AdminCategoryController::class, 'reorder']);

        // Super Admin: Canteens Onboarding & Theme Management
        Route::post('/canteens/upload-media', [AdminCanteenController::class, 'uploadMedia']);
        Route::get('/canteens', [AdminCanteenController::class, 'index']);
        Route::post('/canteens', [AdminCanteenController::class, 'store']);
        Route::get('/canteens/{id}', [AdminCanteenController::class, 'show']);
        Route::post('/canteens/{id}', [AdminCanteenController::class, 'update']);
        Route::put('/canteens/{id}', [AdminCanteenController::class, 'update']);
        Route::delete('/canteens/{id}', [AdminCanteenController::class, 'destroy']);
        Route::post('/canteens/{id}/set-default', [AdminCanteenController::class, 'setDefault']);
        Route::post('/canteens/{id}/clone-menu', [AdminCanteenController::class, 'cloneMenu']);
        Route::post('/canteens/{id}/manager', [AdminCanteenController::class, 'upsertManager']);
        Route::post('/canteens/{id}/emulate-manager', [AdminCanteenController::class, 'emulateManager']);
        Route::post('/users/{id}/emulate', [AdminCanteenController::class, 'emulateUser']);

        // Settings Management
        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::post('/settings', [AdminSettingController::class, 'update']);
        Route::put('/settings', [AdminSettingController::class, 'update']);

        // Orders & POS Billing Management
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::post('/orders', [AdminOrderController::class, 'store']);
        Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
        Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
        Route::get('/orders/{id}/receipt', [AdminOrderController::class, 'receipt']);
        Route::post('/orders/{id}/whatsapp', [AdminOrderController::class, 'sendWhatsApp']);
        Route::delete('/orders/{id}', [AdminOrderController::class, 'destroy']);
    });
});
