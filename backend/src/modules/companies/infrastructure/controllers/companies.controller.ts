import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCompaniesUseCase } from '../../application/use-cases/get-companies.use-case';
import { GetCompanyDossierUseCase } from '../../application/use-cases/get-company-dossier.use-case';
import { SaveCompanyUseCase } from '../../application/use-cases/save-company.use-case';
import { Company } from '../../domain/entities/company.entity';

@ApiTags('Companies (Expedientes 360°)')
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly getCompaniesUseCase: GetCompaniesUseCase,
    private readonly getCompanyDossierUseCase: GetCompanyDossierUseCase,
    private readonly saveCompanyUseCase: SaveCompanyUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de empresas descubiertas y expedientes' })
  async getAll(): Promise<Company[]> {
    return this.getCompaniesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener expediente 360° completo de una empresa' })
  async getById(@Param('id') id: string): Promise<Company> {
    return this.getCompanyDossierUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Guardar o actualizar expediente de empresa manualmente' })
  async save(@Body() companyData: Partial<Company>): Promise<Company> {
    return this.saveCompanyUseCase.execute(companyData);
  }
}
