#!/bin/bash

# Wait for database to be ready
echo "Waiting for database..."
sleep 10

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Check if database is empty (no users)
USER_COUNT=$(php artisan tinker --execute="echo \App\Models\User::count();")

if [ "$USER_COUNT" -eq "0" ]; then
    echo "Database is empty. Running seeders..."
    php artisan db:seed --force
    echo "✅ Seeders executed successfully"
else
    echo "Database already contains data. Skipping seeders."
fi

# Cache configuration
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🚀 Application ready!"

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
