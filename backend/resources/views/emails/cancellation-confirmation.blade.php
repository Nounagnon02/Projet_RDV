<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Annulation de Réservation - Elsa Coiffure</title>
    <style>
        body { font-family: 'Newsreader', serif; background-color: #fbfaf9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid rgba(220, 38, 38, 0.1); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { background-color: #422927; padding: 40px; text-align: center; }
        .header h2 { color: #ca8349; text-transform: uppercase; letter-spacing: 0.2em; margin: 0; font-size: 24px; }
        .content { padding: 40px; text-align: center; }
        .headline { color: #422927; font-size: 28px; line-height: 1.2; margin-bottom: 20px; }
        .subheadline { color: #8c705a; font-size: 16px; margin-bottom: 40px; }
        .card { background-color: #fef2f2; border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 12px; padding: 30px; text-align: left; margin-bottom: 40px; }
        .card-title { color: #b91c1c; font-size: 18px; font-weight: bold; margin: 0; }
        .divider { height: 1px; background-color: rgba(220, 38, 38, 0.1); margin: 20px 0; }
        .details-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .details-label { color: #8c705a; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .details-value { color: #422927; font-size: 14px; font-weight: bold; }
        .btn { padding: 15px 25px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; letter-spacing: 0.05em; display: inline-block; background-color: #ca8349; color: #ffffff; }
        .footer { background-color: #422927; padding: 40px; text-align: center; color: #ca8349; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Elsa Coiffure</h2>
        </div>
        <div class="content">
            <h1 class="headline">Votre rendez-vous a été annulé, {{ $appointment->client->name }}</h1>
            <p class="subheadline">Cette annulation est bien prise en compte. Nous espérons vous revoir très bientôt pour une nouvelle transformation.</p>
            
            <div class="card">
                <p class="card-title">Détails du rendez-vous annulé</p>
                <div class="divider"></div>
                
                <div class="details-row">
                    <span class="details-label">Service :</span>
                    <span class="details-value">{{ $appointment->service->name }}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Date initiale :</span>
                    <span class="details-value">{{ \Carbon\Carbon::parse($appointment->date)->translatedFormat('d F Y') }}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Heure :</span>
                    <span class="details-value">{{ $appointment->start_time }}</span>
                </div>
            </div>

            <a href="{{ env('FRONTEND_URL') }}/booking" class="btn">RÉSERVER UN NOUVEAU CRÉNEAU</a>
            
            <p style="color: #8c705a; font-size: 12px; font-style: italic; margin-top: 40px;">Une question ? Contactez-nous au +33 1 23 45 67 89.</p>
        </div>
        <div class="footer">
            <p style="font-weight: bold; text-transform: uppercase;">Maison de Beauté Elsa Coiffure</p>
        </div>
    </div>
</body>
</html>
