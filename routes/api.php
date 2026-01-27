<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Midtrans Payment Callback
Route::post('/payment/callback', [\App\Http\Controllers\MidtransController::class, 'notification'])->name('api.payment.callback');

// Product Reviews API
Route::get('/produk/{id}/reviews', [\App\Http\Controllers\UlasanController::class, 'productReviews'])->name('api.produk.reviews');
