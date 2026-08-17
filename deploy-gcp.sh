#!/usr/bin/env bash
set -e

# ==============================================================================
# Inter.mx - Script de Despliegue en Producción a Google Cloud Platform (GCP)
# Servicios: Cloud Run (Agent-Service & Backend) + Firebase Hosting (Frontend)
# ==============================================================================

PROJECT_ID="gen-lang-client-0311520356"
REGION="us-central1"

echo "======================================================================"
echo "🚀 Iniciando despliegue de Inter.mx AI Hunting Agent en Google Cloud"
echo "📌 Proyecto GCP: $PROJECT_ID | Región: $REGION"
echo "======================================================================"

# 1. Configurar proyecto activo en gcloud
gcloud config set project "$PROJECT_ID"

# 2. Habilitar APIs necesarias en GCP
echo "⚙️ Habilitando APIs requeridas en Google Cloud..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  firestore.googleapis.com \
  secretmanager.googleapis.com \
  serviceusage.googleapis.com \
  --project="$PROJECT_ID" || true

# 3. Desplegar agent-service a Cloud Run
echo "📦 Desplegando [agent-service] a Google Cloud Run..."
cd agent-service
gcloud run deploy intermx-agent-service \
  --source . \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 8081 \
  --set-env-vars "NODE_ENV=production,GEMINI_MODEL=gemini-3.5-flash,GCP_PROJECT_ID=$PROJECT_ID" \
  --project "$PROJECT_ID"

AGENT_SERVICE_URL=$(gcloud run services describe intermx-agent-service --platform managed --region "$REGION" --format 'value(status.url)' --project "$PROJECT_ID")
echo "✅ [agent-service] desplegado exitosamente en: $AGENT_SERVICE_URL"
cd ..

# 4. Desplegar backend a Cloud Run
echo "📦 Desplegando [backend] a Google Cloud Run..."
cd backend
gcloud run deploy intermx-hunting-backend \
  --source . \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "NODE_ENV=production,GCP_PROJECT_ID=$PROJECT_ID,AGENT_SERVICE_URL=$AGENT_SERVICE_URL" \
  --project "$PROJECT_ID"

BACKEND_URL=$(gcloud run services describe intermx-hunting-backend --platform managed --region "$REGION" --format 'value(status.url)' --project "$PROJECT_ID")
echo "✅ [backend] desplegado exitosamente en: $BACKEND_URL"
cd ..

# 5. Compilar y Desplegar frontend a Firebase Hosting
echo "🎨 Compilando y desplegando [frontend]..."
cd frontend
npm run build
npx -y firebase-tools deploy --only hosting --project "$PROJECT_ID" || echo "ℹ️ Para vincular Firebase Hosting, ejecuta: npx firebase init hosting"
cd ..

echo "======================================================================"
echo "🎉 ¡Despliegue completado con éxito!"
echo "🔗 Backend API: $BACKEND_URL/api/v1"
echo "🔗 Agent Service: $AGENT_SERVICE_URL/health"
echo "======================================================================"
