<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réponse à votre message</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 5px 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #8B4513;
            margin-bottom: 20px;
        }
        .message-box {
            background-color: #f9f9f9;
            border-left: 4px solid #D4AF37;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .original-message {
            background-color: #f0f0f0;
            padding: 15px;
            margin-top: 30px;
            border-radius: 5px;
            font-size: 14px;
        }
        .original-message h3 {
            margin: 0 0 10px;
            font-size: 12px;
            text-transform: uppercase;
            color: #666;
            letter-spacing: 1px;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }
        .footer p {
            margin: 5px 0;
            font-size: 13px;
            color: #666;
        }
        .contact-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
        }
        .contact-info a {
            color: #D4AF37;
            text-decoration: none;
        }
        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
            font-style: italic;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>✨ Elsa Coiffure</h1>
            <p>L'Excellence Capillaire à Votre Service</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Bonjour {{ $contactMessage->name }},
            </div>

            <p>Merci d'avoir pris le temps de nous contacter. Voici notre réponse à votre message :</p>

            <!-- Reply Message -->
            <div class="message-box">
                {!! nl2br(e($replyText)) !!}
            </div>

            <div class="signature">
                <p>Cordialement,<br>
                <strong>L'équipe Elsa Coiffure</strong></p>
            </div>

            <!-- Original Message -->
            <div class="original-message">
                <h3>📧 Votre message original</h3>
                <p><strong>Date :</strong> {{ $contactMessage->created_at->format('d/m/Y à H:i') }}</p>
                @if($contactMessage->subject)
                <p><strong>Sujet :</strong> {{ $contactMessage->subject }}</p>
                @endif
                <p style="margin-top: 15px;">{{ $contactMessage->message }}</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="contact-info">
                <p><strong>📍 Adresse</strong><br>
                75 Rue. derrière stade de l'amitié, Cotonou</p>
                
                <p><strong>📞 Téléphone</strong><br>
                <a href="tel:+22901234567">+229 01 23 45 67 89</a></p>
                
                <p><strong>📧 Email</strong><br>
                <a href="mailto:concierge@elsacoiffure.com">concierge@elsacoiffure.com</a></p>
            </div>

            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                © {{ date('Y') }} Elsa Coiffure. Tous droits réservés.
            </p>
        </div>
    </div>
</body>
</html>
