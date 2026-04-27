#!/bin/bash

# Wait for database to be ready
echo "Waiting for database..."
sleep 10

# Fresh migration with seeders (drops all tables and recreates)
#echo "🔄 Resetting database..."
#php artisan migrate:fresh --seed --force
#echo "✅ Database reset and seeded successfully"

# Cache configuration
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🚀 Application ready!"

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
