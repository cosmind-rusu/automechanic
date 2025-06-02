#!/bin/sh
set -e

echo "🚀 Iniciando aplicación..."

# Ejecutar migraciones
npx prisma migrate deploy

# Ejecutar seed (opcional)
npm run seed || true

# Iniciar aplicación
npm start