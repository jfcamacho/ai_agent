#!/usr/bin/env bash
set -e

# ==============================================================================
# Inter.mx - Script de Despliegue en Producción a Google Cloud Platform (GCP)
# Modo: SANDBOX SEGURO
# ==============================================================================

PROJECT_ID="gen-lang-client-0311520356"
REGION="us-central1"

echo "======================================================================"
echo "🚀 Iniciando despliegue de Inter.mx AI Hunting Agent en Google Cloud"
echo "📌 Proyecto GCP: $PROJECT_ID | Región: $REGION"
echo "🛡️ Modo de Operación: SANDBOX SEGURO (Buzón Virtual / Cero Riesgo)"
echo "======================================================================"

# 1. Configurar proyecto activo en gcloud
gcloud config set project "$PROJECT_ID"

# 2. Leer Gemini API Key de agent-service/.env si existe
GEMINI_KEY=""
if [ -f "agent-service/.env" ]; then
  GEMINI_KEY=$(grep -E "^GEMINI_API_KEY=" agent-service/.env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
fi

# 3. Desplegar agent-service a Cloud Run
echo "📦 1/3 Desplegando [agent-service] a Google Cloud Run..."
cd agent-service
gcloud run deploy intermx-agent-service \
  --source . \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 8081 \
  --set-env-vars "NODE_ENV=production,GEMINI_MODEL=gemini-3.5-flash,GCP_PROJECT_ID=$PROJECT_ID,GEMINI_API_KEY=$GEMINI_KEY" \
  --project "$PROJECT_ID"

AGENT_SERVICE_URL=$(gcloud run services describe intermx-agent-service --platform managed --region "$REGION" --format 'value(status.url)' --project "$PROJECT_ID")
echo "✅ [agent-service] desplegado exitosamente en: $AGENT_SERVICE_URL"
cd ..

# 4. Desplegar backend a Cloud Run en modo Sandbox
echo "📦 2/3 Desplegando [backend] a Google Cloud Run (Modo Sandbox)..."
cd backend
gcloud run deploy intermx-hunting-backend \
  --source . \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "NODE_ENV=production,GCP_PROJECT_ID=$PROJECT_ID,AGENT_SERVICE_URL=$AGENT_SERVICE_URL,EMAIL_DELIVERY_MODE=SANDBOX" \
  --project "$PROJECT_ID"

BACKEND_URL=$(gcloud run services describe intermx-hunting-backend --platform managed --region "$REGION" --format 'value(status.url)' --project "$PROJECT_ID")
echo "✅ [backend] desplegado exitosamente en: $BACKEND_URL"
cd ..

# 5. Compilar frontend Angular
echo "🎨 3/3 Compilando [frontend]..."
cd frontend
npm run build
cd ..

echo "======================================================================"
echo "🎉 ¡Despliegue a Google Cloud completado con éxito en Modo Sandbox!"
echo "🔗 Backend API: $BACKEND_URL/api/v1"
echo "🔗 Documentación Swagger: $BACKEND_URL/docs"
echo "🔗 Agent Service: $AGENT_SERVICE_URL/health"
echo "======================================================================"
