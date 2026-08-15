import { Module } from '@nestjs/common';
import { FirebaseService } from '../shared/database/firebase.service';
import { GetIntegrationsUseCase } from './application/use-cases/get-integrations.use-case';
import { SaveIntegrationUseCase } from './application/use-cases/save-integration.use-case';
import { SearchPeopleUseCase } from './application/use-cases/search-people.use-case';
import { TestIntegrationConnectionUseCase } from './application/use-cases/test-integration-connection.use-case';
import { INTEGRATION_REPOSITORY_TOKEN } from './domain/ports/integration-repository.port';
import { IntegrationsController } from './infrastructure/controllers/integrations.controller';
import { FirestoreIntegrationRepository } from './infrastructure/persistence/firestore-integration.repository';

@Module({
  controllers: [IntegrationsController],
  providers: [
    FirebaseService,
    {
      provide: INTEGRATION_REPOSITORY_TOKEN,
      useClass: FirestoreIntegrationRepository,
    },
    GetIntegrationsUseCase,
    SaveIntegrationUseCase,
    TestIntegrationConnectionUseCase,
    SearchPeopleUseCase,
  ],
  exports: [
    INTEGRATION_REPOSITORY_TOKEN,
    GetIntegrationsUseCase,
    SaveIntegrationUseCase,
    TestIntegrationConnectionUseCase,
    SearchPeopleUseCase,
  ],
})
export class IntegrationsModule {}
