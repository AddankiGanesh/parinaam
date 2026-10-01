#!/bin/bash
set -e

echo "🚀 Starting Parinaam 2026 Production Deployment..."
cd /var/www/parinaam

echo "📥 Pulling latest code from GitHub..."
git pull origin main

echo "📦 Installing production dependencies..."
npm install --production=false

echo "🔨 Building Next.js application..."
npm run build

echo "🔄 Reloading PM2 process with zero downtime..."
npx pm2 restart parinaam-web --update-env

echo "✅ Deployment completed successfully!"
