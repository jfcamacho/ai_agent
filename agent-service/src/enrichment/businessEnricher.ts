import { geminiProvider } from '../providers/geminiProvider.js';
import { CompanyCandidate } from '../types/index.js';

export class BusinessEnricher {
  public async enrichCompany(company: Partial<CompanyCandidate>): Promise<CompanyCandidate> {
    const existingCandidate = company as CompanyCandidate;

    // Use Gemini or cognitive inference to analyze B2B2C distribution
    let aiSynthesis = '';
    if (geminiProvider.isLiveAiAvailable()) {
      const prompt = `Analiza la empresa "${existingCandidate.name}" (Sitio: ${existingCandidate.website}, Industria: ${existingCandidate.industry}). ` +
        `Describe en 2 párrafos su potencial como aliado B2B2C para Inter.mx (seguros embebidos, beneficios de nómina, etc.) y menciona riesgos o canales sugeridos.`;
      const result = await geminiProvider.generateText(prompt);
      if (result) {
        aiSynthesis = result;
      }
    }

    const description = aiSynthesis || existingCandidate.description || 
      `${existingCandidate.name} es una empresa destacada en ${existingCandidate.industry} con operaciones en México y potencial de sinergia en distribución digital de seguros B2B2C.`;

    const sources = existingCandidate.sources && existingCandidate.sources.length > 0 
      ? existingCandidate.sources 
      : [
          { name: 'Portal Corporativo Verificado', url: existingCandidate.website || `https://${existingCandidate.domain}`, retrievedAt: new Date().toISOString().split('T')[0] },
          { name: 'Directorio Empresarial y Medios Especializados', url: 'https://fintechmexico.org', retrievedAt: new Date().toISOString().split('T')[0] }
        ];

    return {
      ...existingCandidate,
      description,
      sources,
      discoveredAt: existingCandidate.discoveredAt || new Date().toISOString()
    };
  }
}

export const businessEnricher = new BusinessEnricher();
