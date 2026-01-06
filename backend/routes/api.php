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
    Route::post('/booking/{slug}/appointments', [BookingController::class, 'bookAppointment']);
    Route::get('/client/appointments', [BookingController::class, 'myAppointments']);
    Route::delete('/client/appointments/{appointment}', [BookingController::class, 'cancelAppointment']);
});
