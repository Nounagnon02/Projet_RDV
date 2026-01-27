<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Booking Routes
Route::get('/providers', [BookingController::class, 'getAllProviders']);
Route::get('/booking/{slug}', [BookingController::class, 'getProviderPublic']);
Route::get('/booking/{slug}/services', [BookingController::class, 'getServicesPublic']);
Route::get('/booking/{slug}/slots', [BookingController::class, 'getAvailableSlots']);
Route::post('/booking/{slug}/appointments', [BookingController::class, 'bookAppointment']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Provider Profile
    Route::get('/provider/profile', [App\Http\Controllers\ProviderController::class, 'profile']);
    Route::put('/provider/profile', [App\Http\Controllers\ProviderController::class, 'update']);

    // Services
    Route::get('/provider/services', [App\Http\Controllers\ServiceController::class, 'index']);
    Route::post('/provider/services', [App\Http\Controllers\ServiceController::class, 'store']);
    Route::put('/provider/services/{service}', [App\Http\Controllers\ServiceController::class, 'update']);
    Route::delete('/provider/services/{service}', [App\Http\Controllers\ServiceController::class, 'destroy']);

    // Availabilities
    Route::get('/provider/availabilities', [App\Http\Controllers\AvailabilityController::class, 'index']);
    Route::post('/provider/availabilities', [App\Http\Controllers\AvailabilityController::class, 'store']);

    // Appointments (Provider View)
    Route::get('/provider/appointments', [App\Http\Controllers\AppointmentController::class, 'index']);
    Route::post('/provider/appointments', [App\Http\Controllers\AppointmentController::class, 'store']);
    Route::put('/provider/appointments/{appointment}', [App\Http\Controllers\AppointmentController::class, 'update']);

    // Client Space
    Route::get('/client/appointments', [BookingController::class, 'myAppointments']);
    Route::delete('/client/appointments/{appointment}', [BookingController::class, 'cancelAppointment']);

    // Loyalty System
    Route::get('/loyalty/account', [App\Http\Controllers\Api\LoyaltyController::class, 'getAccount']);
    Route::get('/loyalty/transactions', [App\Http\Controllers\Api\LoyaltyController::class, 'getTransactions']);
    Route::get('/loyalty/vouchers', [App\Http\Controllers\Api\LoyaltyController::class, 'getVouchers']);

    // Consultations
    Route::post('/consultations', [App\Http\Controllers\Api\ConsultationController::class, 'store']);
    Route::get('/consultations/{id}', [App\Http\Controllers\Api\ConsultationController::class, 'show']);
    Route::get('/consultations/{id}/recommendations', [App\Http\Controllers\Api\ConsultationController::class, 'recommendations']);

    // Products (Public but potentially personalized)
    Route::get('/products', [App\Http\Controllers\Api\ProductController::class, 'index']);
    Route::get('/products/recommended', [App\Http\Controllers\Api\ProductController::class, 'recommended']);
    Route::get('/products/{id}', [App\Http\Controllers\Api\ProductController::class, 'show']);

    // Orders
    Route::get('/orders', [App\Http\Controllers\Api\OrderController::class, 'index']);
    Route::post('/orders', [App\Http\Controllers\Api\OrderController::class, 'store']);
});
