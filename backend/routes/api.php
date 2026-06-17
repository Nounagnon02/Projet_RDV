<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\SetupController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Setup & Diagnostic Routes (Public with secret)
Route::get('/setup/diagnostic', [SetupController::class, 'diagnostic']);
Route::post('/setup/seed', [SetupController::class, 'runSeeders']);
Route::post('/setup/fresh', [SetupController::class, 'freshMigrate']);
Route::post('/setup/create-admin', [SetupController::class, 'createAdmin']);

// Public Site Settings
Route::get('/site-settings', [App\Http\Controllers\Api\SiteSettingController::class, 'index']);
Route::get('/help-center/content', [App\Http\Controllers\Api\SiteSettingController::class, 'helpCenterContent']);

// Public Opening Hours
Route::get('/opening-hours', [App\Http\Controllers\AvailabilityController::class, 'getOpeningHours']);

// FedaPay Public Key
Route::get('/payments/public-key', [App\Http\Controllers\Api\PaymentController::class, 'getPublicKey']);

// Public Contact Form
Route::post('/contact', [App\Http\Controllers\Api\ContactMessageController::class, 'store']);

// FedaPay Webhook (Public)
Route::post('/payments/webhook', [App\Http\Controllers\Api\PaymentController::class, 'webhook']);

// Public Booking Routes
Route::get('/providers', [BookingController::class, 'getAllProviders']);
Route::get('/services', [BookingController::class, 'getAllServices']);
Route::get('/booking/{slug}', [BookingController::class, 'getProviderPublic']);
Route::get('/booking/{slug}/services', [BookingController::class, 'getServicesPublic']);
Route::get('/booking/{slug}/slots', [BookingController::class, 'getAvailableSlots']);
Route::post('/booking/{slug}/appointments', [BookingController::class, 'bookAppointment']);

// Option C — Réservation globale (tous prestataires)
Route::get('/global-slots', [BookingController::class, 'getGlobalAvailableSlots']);
Route::post('/global-book', [BookingController::class, 'globalBookAppointment']);
Route::post('/booking/confirm-payment', [BookingController::class, 'confirmBookingPayment']);

// Public Products & Guest Order
Route::get('/products', [App\Http\Controllers\Api\ProductController::class, 'index']);
Route::get('/products/{id}', [App\Http\Controllers\Api\ProductController::class, 'show']);
Route::post('/orders', [App\Http\Controllers\Api\OrderController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateMe']);

    // Provider Profile
    Route::get('/provider/profile', [App\Http\Controllers\ProviderController::class, 'profile']);
    Route::put('/provider/profile', [App\Http\Controllers\ProviderController::class, 'update']);
    // amazonq-ignore-next-line
    Route::get('/provider/clients', [App\Http\Controllers\ProviderController::class, 'clients']);
    Route::post('/provider/clients', [App\Http\Controllers\ProviderController::class, 'storeClient']);

    // Services
    // amazonq-ignore-next-line
    Route::get('/provider/services', [App\Http\Controllers\ServiceController::class, 'index']);
    // amazonq-ignore-next-line
    Route::post('/provider/services', [App\Http\Controllers\ServiceController::class, 'store']);
    // amazonq-ignore-next-line
    Route::put('/provider/services/{service}', [App\Http\Controllers\ServiceController::class, 'update']);
    // amazonq-ignore-next-line
    // amazonq-ignore-next-line
    Route::delete('/provider/services/{service}', [App\Http\Controllers\ServiceController::class, 'destroy']);

    // Availabilities
    // amazonq-ignore-next-line
    Route::get('/provider/availabilities', [App\Http\Controllers\AvailabilityController::class, 'index']);
    // amazonq-ignore-next-line
    Route::post('/provider/availabilities', [App\Http\Controllers\AvailabilityController::class, 'store']);

    // Appointments (Provider View)
    // amazonq-ignore-next-line
    // amazonq-ignore-next-line
    Route::get('/provider/appointments', [App\Http\Controllers\AppointmentController::class, 'index']);
    // amazonq-ignore-next-line
    Route::post('/provider/appointments', [App\Http\Controllers\AppointmentController::class, 'store']);
    // amazonq-ignore-next-line
    Route::put('/provider/appointments/{appointment}', [App\Http\Controllers\AppointmentController::class, 'update']);

    // Client Space
    // amazonq-ignore-next-line
    Route::get('/client/appointments', [BookingController::class, 'myAppointments']);
    // amazonq-ignore-next-line
    Route::delete('/client/appointments/{appointment}', [BookingController::class, 'cancelAppointment']);

    // Loyalty System (Client)
    Route::get('/loyalty/account', [App\Http\Controllers\Api\LoyaltyController::class, 'getAccount']);
    Route::get('/loyalty/transactions', [App\Http\Controllers\Api\LoyaltyController::class, 'getTransactions']);
    Route::get('/loyalty/vouchers', [App\Http\Controllers\Api\LoyaltyController::class, 'getVouchers']);

    // Loyalty System (Provider)
    Route::get('/provider/loyalty/stats', [App\Http\Controllers\ProviderLoyaltyController::class, 'getStats']);
    // amazonq-ignore-next-line
    Route::get('/provider/loyalty/offers', [App\Http\Controllers\ProviderLoyaltyController::class, 'getOffers']);
    Route::post('/provider/loyalty/offers', [App\Http\Controllers\ProviderLoyaltyController::class, 'storeOffer']);
    // amazonq-ignore-next-line
    Route::post('/provider/loyalty/bonus-points', [App\Http\Controllers\ProviderLoyaltyController::class, 'addBonusPoints']);

    // Consultations
    Route::post('/consultations', [App\Http\Controllers\Api\ConsultationController::class, 'store']);
    // amazonq-ignore-next-line
    Route::get('/consultations/{id}', [App\Http\Controllers\Api\ConsultationController::class, 'show']);
    // amazonq-ignore-next-line
    Route::get('/consultations/{id}/recommendations', [App\Http\Controllers\Api\ConsultationController::class, 'recommendations']);

    // Products (Personalized)
    // amazonq-ignore-next-line
    Route::get('/products/recommended', [App\Http\Controllers\Api\ProductController::class, 'recommended']);

    // Products Management (Provider)
    // amazonq-ignore-next-line
    Route::post('/provider/products', [App\Http\Controllers\Api\ProductController::class, 'store']);
    // amazonq-ignore-next-line
    Route::put('/provider/products/{id}', [App\Http\Controllers\Api\ProductController::class, 'update']);
    Route::delete('/provider/products/{id}', [App\Http\Controllers\Api\ProductController::class, 'destroy']);

    // Orders
    Route::get('/orders', [App\Http\Controllers\Api\OrderController::class, 'index']);

    // Payments
    Route::post('/payments/create', [App\Http\Controllers\Api\PaymentController::class, 'createPayment']);
    Route::get('/payments/verify/{transactionId}', [App\Http\Controllers\Api\PaymentController::class, 'verifyPayment']);

    // Site Settings (Admin only)
    Route::get('/admin/site-settings', [App\Http\Controllers\Api\SiteSettingController::class, 'adminIndex']);
    Route::put('/admin/site-settings', [App\Http\Controllers\Api\SiteSettingController::class, 'update']);
    Route::put('/admin/site-settings/{key}', [App\Http\Controllers\Api\SiteSettingController::class, 'updateSingle']);

    // Contact Messages (Admin only)
    Route::get('/admin/contact-messages', [App\Http\Controllers\Api\ContactMessageController::class, 'index']);
    Route::get('/admin/contact-messages/stats', [App\Http\Controllers\Api\ContactMessageController::class, 'stats']);
    Route::get('/admin/contact-messages/{id}', [App\Http\Controllers\Api\ContactMessageController::class, 'show']);
    Route::post('/admin/contact-messages/{id}/reply', [App\Http\Controllers\Api\ContactMessageController::class, 'reply']);
    Route::patch('/admin/contact-messages/{id}/status', [App\Http\Controllers\Api\ContactMessageController::class, 'updateStatus']);
    Route::delete('/admin/contact-messages/{id}', [App\Http\Controllers\Api\ContactMessageController::class, 'destroy']);
});
