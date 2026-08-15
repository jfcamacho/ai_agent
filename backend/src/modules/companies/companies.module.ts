import { Module } from '@nestjs/common';
import { FirebaseService } from '../shared/database/firebase.service';
import { GetCompaniesUseCase } from './application/use-cases/get-companies.use-case';
import { GetCompanyDossierUseCase } from './application/use-cases/get-company-dossier.use-case';
import { SaveCompanyUseCase } from './application/use-cases/save-company.use-case';
import { COMPANY_REPOSITORY_TOKEN } from './domain/ports/company-repository.port';
import { CompaniesController } from './infrastructure/controllers/companies.controller';
import { FirestoreCompanyRepository } from './infrastructure/persistence/firestore-company.repository';

@Module({
  controllers: [CompaniesController],
  providers: [
    FirebaseService,
    {
      provide: COMPANY_REPOSITORY_TOKEN,
      useClass: FirestoreCompanyRepository,
    },
    GetCompaniesUseCase,
    GetCompanyDossierUseCase,
    SaveCompanyUseCase,
  ],
  exports: [COMPANY_REPOSITORY_TOKEN, GetCompaniesUseCase, GetCompanyDossierUseCase, SaveCompanyUseCase],
})
export class CompaniesModule {}
