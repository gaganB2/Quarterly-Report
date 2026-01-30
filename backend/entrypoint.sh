#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input

# Start the Gunicorn server
echo "Starting Gunicorn server..."
exec gunicorn quarterly_report.wsgi:application --bind 0.0.0.0:8000