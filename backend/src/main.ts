import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Angular Frontend and local development
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Inter.mx - Agente de IA para Hunting de Alianzas B2B2C API')
    .setDescription(
      'API Backend con Arquitectura Hexagonal Modular para la gestión de prospectos, ' +
      'aprobaciones Human-in-the-Loop, generación de mensajes con IA, scoring explicable y métricas del piloto.',
    )
    .setVersion('1.0.0')
    .addTag('Leads (Bandeja del Hunter)')
    .addTag('Companies (Expedientes 360°)')
    .addTag('Outreach (Taller de Redacción & Aprobación)')
    .addTag('Triage (Clasificación de Respuestas & Guardrails M10)')
    .addTag('Appointments (Citas Calificadas & Calendario M11)')
    .addTag('ICP Configuration & Blacklist (M01)')
    .addTag('Executive Dashboard & Pilot Metrics (M12)')
    .addTag('Audit & Guardrails Log (Sección 7.1)')
    .addTag('Sandbox Simulator (Pruebas de Seguridad y Ciclo de Vida)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 8080;
  await app.listen(port);

  logger.log(`====================================================`);
  logger.log(`🚀 Inter.mx Hunting API (Cloud Run) RUNNING on port ${port}`);
  logger.log(`📚 Swagger Docs: http://localhost:${port}/docs`);
  logger.log(`🎯 API Base URL: http://localhost:${port}/api/v1`);
  logger.log(`====================================================`);
}

bootstrap();
