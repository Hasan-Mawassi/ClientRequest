#!/bin/sh

set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

echo "Starting API..."
exec node --import tsx dist/src/server.js