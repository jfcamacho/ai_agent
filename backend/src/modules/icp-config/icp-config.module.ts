import { Module } from '@nestjs/common';
import { FirebaseService } from '../shared/database/firebase.service';
import { GetIcpConfigUseCase } from './application/use-cases/get-icp-config.use-case';
import { UpdateIcpConfigUseCase } from './application/use-cases/update-icp-config.use-case';
import { ICP_CONFIG_REPOSITORY_TOKEN } from './domain/ports/icp-config-repository.port';
import { IcpConfigController } from './infrastructure/controllers/icp-config.controller';
import { FirestoreIcpConfigRepository } from './infrastructure/persistence/firestore-icp-config.repository';

@Module({
  controllers: [IcpConfigController],
  providers: [
    FirebaseService,
    {
      provide: ICP_CONFIG_REPOSITORY_TOKEN,
      useClass: FirestoreIcpConfigRepository,
    },
    GetIcpConfigUseCase,
    UpdateIcpConfigUseCase,
  ],
  exports: [ICP_CONFIG_REPOSITORY_TOKEN, GetIcpConfigUseCase, UpdateIcpConfigUseCase],
})
export class IcpConfigModule {}
