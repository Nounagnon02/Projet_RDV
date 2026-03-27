<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactReply extends Mailable
{
    use Queueable, SerializesModels;

    public $contactMessage;
    public $replyText;

    public function __construct(ContactMessage $contactMessage, $replyText)
    {
        $this->contactMessage = $contactMessage;
        $this->replyText = $replyText;
    }

    public function build()
    {
        return $this->subject('Réponse à votre message - ' . ($this->contactMessage->subject ?? 'Contact'))
                    ->view('emails.contact-reply');
    }
}
