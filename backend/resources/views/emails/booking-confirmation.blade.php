<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de Réservation - Elsa Coiffure</title>
    <style>
        body { font-family: 'Newsreader', serif; background-color: #fbfaf9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid rgba(202, 131, 73, 0.1); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { background-color: #422927; padding: 40px; text-align: center; }
        .header h2 { color: #ca8349; text-transform: uppercase; letter-spacing: 0.2em; margin: 0; font-size: 24px; }
        .content { padding: 40px; text-align: center; }
        .headline { color: #422927; font-size: 28px; line-height: 1.2; margin-bottom: 20px; }
        .subheadline { color: #8c705a; font-size: 16px; margin-bottom: 40px; }
        .card { background-color: #fdfcfb; border: 1px solid rgba(202, 131, 73, 0.15); border-radius: 12px; padding: 30px; text-align: left; margin-bottom: 40px; }
        .card-title { color: #422927; font-size: 20px; font-weight: bold; margin: 0; }
        .card-subtitle { color: #ca8349; font-size: 14px; font-weight: 500; margin: 5px 0 20px 0; text-transform: uppercase; }
        .divider { height: 1px; background-color: rgba(202, 131, 73, 0.2); margin: 20px 0; }
        .details-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .details-label { color: #8c705a; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .details-value { color: #422927; font-size: 14px; font-weight: bold; }
        .button-group { display: flex; gap: 10px; justify-content: center; margin-bottom: 40px; }
        .btn { padding: 15px 25px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; letter-spacing: 0.05em; display: inline-block; }
        .btn-primary { background-color: #ca8349; color: #ffffff; }
        .btn-secondary { background-color: #422927; color: #ca8349; }
        .footer { background-color: #422927; padding: 40px; text-align: center; color: #ca8349; border-top: 1px solid rgba(202, 131, 73, 0.2); }
        .footer-text { color: rgba(255,255,255,0.6); font-size: 12px; line-height: 1.6; margin-top: 20px; }
        .social-icons { margin-bottom: 30px; }
        .social-icons a { color: #ca8349; text-decoration: none; margin: 0 10px; font-size: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Elsa Coiffure</h2>
        </div>
        <div class="content">
            <h1 class="headline">Votre rendez-vous est confirmé, {{ $appointment->client->name }}</h1>
            <p class="subheadline">Nous sommes ravis de vous accueillir dans notre maison de beauté. Tout est prêt pour votre transformation.</p>
            
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <p class="card-title">{{ $appointment->service->name }}</p>
                        <p class="card-subtitle">Avec l'expertise de {{ $appointment->stylist->name ?? 'notre équipe' }}</p>
                    </div>
                    <div style="background-color: rgba(202, 131, 73, 0.1); color: #ca8349; padding: 5px 12px; border-radius: 99px; font-size: 12px; font-weight: bold;">
                        Confirmé
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="details-row">
                    <span class="details-label">Date :</span>
                    <span class="details-value">{{ \Carbon\Carbon::parse($appointment->date)->translatedFormat('d F Y') }}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Heure :</span>
                    <span class="details-value">{{ $appointment->start_time }}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Durée :</span>
                    <span class="details-value">{{ $appointment->service->duration }} min</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Lieu :</span>
                    <span class="details-value">15 Avenue de Luxe, 75008 Paris</span>
                </div>
            </div>

            <div class="button-group">
                <a href="#" class="btn btn-primary">AJOUTER AU CALENDRIER</a>
                <a href="{{ env('FRONTEND_URL') }}/client/appointments" class="btn btn-secondary">GÉRER MA RÉSERVATION</a>
            </div>
            
            <p style="color: #8c705a; font-size: 12px; font-style: italic;">Besoin de modifier ? Merci de nous prévenir au moins 24 heures à l'avance.</p>
        </div>
        <div class="footer">
            <div class="social-icons">
                <a href="#">IG</a> <a href="#">FB</a> <a href="#">TK</a>
            </div>
            <div>
                <p style="font-weight: bold; text-transform: uppercase; font-size: 14px; margin-bottom: 5px;">Elsa Coiffure Maison de Beauté</p>
                <p class="footer-text">
                    15 Avenue de Luxe, 75008 Paris, France<br>
                    +33 1 23 45 67 89<br>
                    concierge@elsacoiffure.com
                </p>
            </div>
            <p style="color: rgba(255,255,255,0.3); font-size: 10px; margin-top: 30px; letter-spacing: 0.2em;">© 2026 ELSA COIFFURE. TOUS DROITS RÉSERVÉS.</p>
        </div>
    </div>
</body>
</html>
