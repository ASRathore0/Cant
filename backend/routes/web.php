<?php

use Illuminate\Support\Facades\Route;

// Serve React SPA index.html for root and all frontend routes
Route::get('/', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }
    return view('welcome');
});

// Fallback for storage files (prevents 403 Forbidden if webserver symlinks are disabled)
Route::get('/storage/{any}', function ($any) {
    // 1. Try public storage app directory
    $path = storage_path('app/public/' . $any);
    if (file_exists($path) && is_file($path)) {
        return response()->file($path, [
            'Access-Control-Allow-Origin' => '*',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    // 2. Try public_path/storage
    $path = public_path('storage/' . $any);
    if (file_exists($path) && is_file($path)) {
        return response()->file($path, [
            'Access-Control-Allow-Origin' => '*',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    // 3. Try direct public path
    $path = public_path($any);
    if (file_exists($path) && is_file($path)) {
        return response()->file($path, [
            'Access-Control-Allow-Origin' => '*',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    abort(404);
})->where('any', '.*');

Route::get('/{any}', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }
    return view('welcome');
})->where('any', '^(?!api|storage).*$');
