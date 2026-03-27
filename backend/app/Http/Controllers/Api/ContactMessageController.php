<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
use App\Mail\ContactReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;

class ContactMessageController extends Controller
{
    /**
     * Store a new contact message (Public)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contactMessage = ContactMessage::create($request->all());

        // TODO: Send notification email to admin
        // Mail::to(config('mail.admin_email'))->send(new NewContactMessage($contactMessage));

        return response()->json([
            'message' => 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
            'data' => $contactMessage
        ], 201);
    }

    /**
     * Get all contact messages (Admin)
     */
    public function index(Request $request)
    {
        $status = $request->query('status');
        $perPage = $request->query('per_page', 15);

        $query = ContactMessage::query()->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        $messages = $query->paginate($perPage);

        return response()->json($messages);
    }

    /**
     * Get a single message (Admin)
     */
    public function show($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->markAsRead();

        return response()->json($message);
    }

    /**
     * Reply to a message (Admin)
     */
    public function reply(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'reply' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $message = ContactMessage::findOrFail($id);
        $message->markAsReplied($request->reply);

        // Configure mail settings from database
        $this->configureMailFromSettings();

        // Send reply email to customer
        try {
            Mail::to($message->email)->send(new ContactReply($message, $request->reply));
            
            return response()->json([
                'message' => 'Réponse envoyée avec succès par email',
                'data' => $message
            ]);
        } catch (\Exception $e) {
            // Rollback status if email fails
            $message->update(['status' => 'read']);
            
            return response()->json([
                'message' => 'Erreur lors de l\'envoi de l\'email',
                'error' => $e->getMessage(),
                'hint' => 'Vérifiez la configuration email dans les paramètres du site'
            ], 500);
        }
    }

    /**
     * Configure mail settings from database
     */
    private function configureMailFromSettings()
    {
        $settings = SiteSetting::whereIn('key', [
            'mail_host',
            'mail_port',
            'mail_username',
            'mail_password',
            'mail_encryption',
            'mail_from_address',
            'mail_from_name'
        ])->pluck('value', 'key');

        if ($settings->isNotEmpty()) {
            Config::set('mail.mailers.smtp.host', $settings->get('mail_host', 'smtp.gmail.com'));
            Config::set('mail.mailers.smtp.port', $settings->get('mail_port', 587));
            Config::set('mail.mailers.smtp.username', $settings->get('mail_username'));
            Config::set('mail.mailers.smtp.password', $settings->get('mail_password'));
            Config::set('mail.mailers.smtp.encryption', $settings->get('mail_encryption', 'tls'));
            Config::set('mail.from.address', $settings->get('mail_from_address', 'noreply@elsacoiffure.com'));
            Config::set('mail.from.name', $settings->get('mail_from_name', 'Elsa Coiffure'));
            Config::set('mail.default', 'smtp');
        }
    }

    /**
     * Update message status (Admin)
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:new,read,replied,archived',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $message = ContactMessage::findOrFail($id);
        $message->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Statut mis à jour',
            'data' => $message
        ]);
    }

    /**
     * Delete a message (Admin)
     */
    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json([
            'message' => 'Message supprimé'
        ]);
    }

    /**
     * Get statistics (Admin)
     */
    public function stats()
    {
        $stats = [
            'total' => ContactMessage::count(),
            'new' => ContactMessage::where('status', 'new')->count(),
            'read' => ContactMessage::where('status', 'read')->count(),
            'replied' => ContactMessage::where('status', 'replied')->count(),
            'archived' => ContactMessage::where('status', 'archived')->count(),
        ];

        return response()->json($stats);
    }
}
