# Agente de IA para Hunting de Alianzas B2B2C · Inter.mx

Plataforma integral y modular con **Arquitectura Hexagonal en NestJS**, **Microservicio Autónomo del Agente de IA** y **Frontend en Angular 19**, diseñada para el descubrimiento proactivo de prospectos, scoring explicable, aprobaciones Human-in-the-Loop y agendamiento de citas calificadas para **Inter.mx · Alianzas Estratégicas**.

---

## 1. Arquitectura de 3 Servicios Desacoplados

```
IA_Project_Inter/
├── agent-service/            # Microservicio Independiente de IA (Cloud Run: Port 8081)
│   ├── src/discovery/        # Búsqueda proactiva autónoma sin carga humana (M02)
│   ├── src/enrichment/       # Análisis de modelo B2B2C y señales públicas (M03, M04)
│   ├── src/scoring/          # Motor de scoring explicable 0-100 pts (M05)
│   ├── src/copywriter/       # Redacción personalizada con guardrails anti-alucinación (M08)
│   ├── src/triage/           # Triaje de sentimiento y detención por opt-out (M10, Guardrail 7.1)
│   └── Dockerfile            # Multi-stage build optimizado para Cloud Run
│
├── backend/                  # Core API con Arquitectura Hexagonal Modular (Cloud Run: Port 8080)
│   ├── src/modules/
│   │   ├── companies/        # Bounded context: Expedientes 360° y metadatos
│   │   ├── leads/            # Bounded context: Bandeja del Hunter y recomendaciones
│   │   ├── outreach/         # Bounded context: Taller de redacción y Virtual Outbox
│   │   ├── triage/           # Bounded context: Guardrails y procesamiento de respuestas
│   │   ├── appointments/     # Bounded context: Citas calificadas y sincronización CRM
│   │   ├── icp-config/       # Bounded context: Configuración de ICP y Blacklist (M01)
│   │   ├── metrics-dashboard/# Bounded context: Métricas del piloto vs línea base (M12)
│   │   ├── audit/            # Bounded context: Trazabilidad inmutable de eventos (7.1)
│   │   └── sandbox-simulator/# Bounded context: Simulador interactivo seguro
│   └── Dockerfile            # Multi-stage build optimizado para Cloud Run
│
└── frontend/                 # Single Page Application en Angular 19 (Firebase Hosting)
    ├── src/app/features/     # Lead Inbox, Dossier, Composer, Kanban, Calendar, Dashboard, Sandbox
    ├── firebase.json         # Configuración de Firebase Hosting
    └── tailwind & styles     # Design System moderno con paleta oficial de Inter.mx
```

---

## 2. Protocolo de Pruebas Seguras y Cero Exposición (Sandbox Mode)

El sistema opera por defecto en **`SANDBOX_MODE=true`**:
1. **Virtual Outbox:** Ningún correo ni mensaje sale a servidores externos; se despacha a un buzón virtual seguro dentro de la plataforma donde el Hunter puede inspeccionar el renderizado HTML, las cabeceras y la auditoría.
2. **Simulador de Prospectos:** Permite inyectar respuestas de prueba (*Interés Positivo*, *Solicitud de Baja / Opt-out*, *Duda Comercial*) para verificar que:
   - El agente clasifique el sentimiento en milisegundos.
   - Si el prospecto pide baja, se activa el **Guardrail 7.1**, se bloquea a la empresa de inmediato y se añade a la lista negra.
   - Si el prospecto tiene interés, se coordina y agenda la cita calificada en el calendario.

---

## 3. Instrucciones de Ejecución Local

### Paso 1: Iniciar el Microservicio del Agente de IA (`agent-service`)
```bash
cd agent-service
npm install
npm run dev
# Corre en http://localhost:8081 (Health check: http://localhost:8081/health)
```

### Paso 2: Iniciar el Backend Hexagonal NestJS (`backend`)
```bash
cd backend
npm install
npm run start:dev
# Corre en http://localhost:8080 (Swagger Docs: http://localhost:8080/docs)
```

### Paso 3: Iniciar el Frontend Angular (`frontend`)
```bash
cd frontend
npm install
npm start
# Corre en http://localhost:4200
```

---

## 4. Despliegue en Google Cloud Platform

### Backend y Agente en Google Cloud Run:
```bash
# Desplegar Agent Service en Cloud Run
cd agent-service
gcloud run deploy intermx-agent-service --source . --port 8081 --allow-unauthenticated

# Desplegar Core API en Cloud Run
cd ../backend
gcloud run deploy intermx-hunting-backend --source . --port 8080 --set-env-vars AGENT_SERVICE_URL=https://intermx-agent-service-xxxx.a.run.app --allow-unauthenticated
```

### Frontend en Firebase Hosting:
```bash
cd ../frontend
npm run build
firebase deploy --only hosting
```

---

## 5. Criterios de Aceptación Cumplidos

| ID | Capacidad Requerida en PDF | Estado |
|---|---|:---:|
| **M01** | Configurar ICP, sectores, cargos, territorios y exclusiones | ✅ Implementado |
| **M02** | Consultar fuentes autorizadas de forma programada | ✅ Implementado |
| **M03** | Analizar modelo, canal y potencial B2B2C con IA | ✅ Implementado |
| **M04** | Enriquecer datos y conservar fuentes y fechas (Expediente 360°) | ✅ Implementado |
| **M05** | Aplicar scoring explicable multi-factor (0 - 100 pts) | ✅ Implementado |
| **M06** | Identificar cargos y decisores relevantes (LinkedIn / Email) | ✅ Implementado |
| **M07** | Presentar lead al Hunter para validación (Human-in-the-Loop) | ✅ Implementado |
| **M08** | Generar borrador personalizado con guardrails anti-alucinación | ✅ Implementado |
| **M09** | Aprobar y autorizar envío con registro de auditoría | ✅ Implementado |
| **M10** | Gestionar seguimiento, clasificar respuestas y opt-out | ✅ Implementado |
| **M11** | Proponer horarios y sincronizar citas con calendario y CRM | ✅ Implementado |
| **M12** | Mostrar métricas, comparativa vs línea base y control de costos | ✅ Implementado |
| **7.1** | Guardrails estrictos, Sandbox seguro y auditoría inmutable | ✅ Implementado |
