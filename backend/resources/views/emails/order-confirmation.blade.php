<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de Commande - Elsa Coiffure</title>
    <style>
        body { font-family: 'Newsreader', serif; background-color: #fbfaf9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid rgba(202, 131, 73, 0.1); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { background-color: #422927; padding: 40px; text-align: center; }
        .header h2 { color: #ca8349; text-transform: uppercase; letter-spacing: 0.2em; margin: 0; font-size: 24px; }
        .content { padding: 40px; }
        .headline { color: #422927; font-size: 28px; line-height: 1.2; margin-bottom: 20px; text-align: center; }
        .subheadline { color: #8c705a; font-size: 16px; margin-bottom: 40px; text-align: center; }
        .card { background-color: #fdfcfb; border: 1px solid rgba(202, 131, 73, 0.15); border-radius: 12px; padding: 30px; margin-bottom: 40px; }
        .order-id { color: #8c705a; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; }
        .divider { height: 1px; background-color: rgba(202, 131, 73, 0.1); margin: 20px 0; }
        .item-row { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .item-info { flex: 1; }
        .item-name { color: #422927; font-size: 14px; font-weight: bold; }
        .item-qty { color: #8c705a; font-size: 12px; }
        .item-price { color: #422927; font-size: 14px; font-weight: bold; }
        .total-row { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 20px; border-top: 2px solid rgba(202, 131, 73, 0.2); }
        .total-label { color: #422927; font-size: 18px; font-weight: bold; }
        .total-price { color: #ca8349; font-size: 22px; font-weight: bold; }
        .btn { padding: 15px 25px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; letter-spacing: 0.05em; display: inline-block; background-color: #ca8349; color: #ffffff; text-align: center; width: 200px; display: block; margin: 0 auto 40px; }
        .footer { background-color: #422927; padding: 40px; text-align: center; color: #ca8349; }
        .footer-text { color: rgba(255,255,255,0.6); font-size: 12px; line-height: 1.6; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Elsa Coiffure</h2>
        </div>
        <div class="content">
            <h1 class="headline">Merci pour votre commande, {{ $order->user->name }}</h1>
            <p class="subheadline">Votre sélection premium a été validée et sera bientôt en route vers vous.</p>
            
            <div class="card">
                <p class="order-id">Commande #{{ $order->id }}</p>
                <div class="divider"></div>
                
                @foreach($order->items as $item)
                <div class="item-row">
                    <div class="item-info">
                        <p class="item-name">{{ $item->product->name }}</p>
                        <p class="item-qty">Quantité: {{ $item->quantity }}</p>
                    </div>
                    <p class="item-price">{{ number_format($item->price * $item->quantity, 2) }} €</p>
                </div>
                @endforeach
                
                <div class="total-row">
                    <span class="total-label">Total</span>
                    <span class="total-price">{{ number_format($order->total, 2) }} €</span>
                </div>
            </div>

            <a href="{{ env('FRONTEND_URL') }}/client" class="btn">SUIVRE MA COMMANDE</a>
            
            <div style="text-align: center; color: #8c705a; font-size: 12px;">
                <p>Besoin d'aide ? Notre service client est à votre écoute au +33 1 23 45 67 89.</p>
            </div>
        </div>
        <div class="footer">
            <p style="font-weight: bold; text-transform: uppercase;">Maison de Beauté Elsa Coiffure</p>
            <p class="footer-text">
                Luxueusement vôtre,<br>
                L'équipe Elsa Coiffure
            </p>
        </div>
    </div>
</body>
</html>
