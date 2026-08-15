import { scoringEngine } from '../scoring/scoringEngine.js';
import { responseClassifier } from '../triage/responseClassifier.js';
import { CompanyCandidate, IcpCriteria } from '../types/index.js';

describe('Inter.mx AI Hunting Agent Service', () => {
  const sampleIcp: IcpCriteria = {
    id: 'test_icp',
    version: 1,
    targetIndustries: ['Fintech', 'HR Tech'],
    targetCompanySizes: ['100-500'],
    targetLocations: ['México'],
    targetDecisionMakerRoles: ['Alianzas', 'CPO'],
    excludedKeywords: ['Competidor'],
    blacklistedDomains: ['blacklisted-company.com'],
    minimumScoreThreshold: 75,
    autoApproveThreshold: 90
  };

  const sampleCandidate: CompanyCandidate = {
    id: 'test_candidate_1',
    name: 'Test Fintech S.A.',
    domain: 'testfintech.mx',
    website: 'https://testfintech.mx',
    industry: 'Fintech',
    headquarters: 'Ciudad de México',
    country: 'México',
    estimatedEmployees: 300,
    estimatedUserBase: '100,000 usuarios',
    businessModel: 'B2B2C',
    description: 'Plataforma Fintech de servicios de nómina y pagos.',
    productsAndServices: ['Tarjetas de nómina', 'Crédito empresarial'],
    insuranceAffinityCategory: 'PAYROLL_BENEFITS',
    decisionMakers: [
      {
        name: 'Roberto Gomez',
        role: 'Director de Alianzas Estratégicas',
        department: 'Alianzas',
        confidenceScore: 0.95,
        isVerified: true
      }
    ],
    signals: [],
    sources: [],
    discoverySource: 'AUTONOMOUS_PROACTIVE',
    discoveredAt: new Date().toISOString()
  };

  it('should score high for a target B2B2C Fintech company matching ICP', () => {
    const evaluation = scoringEngine.evaluateCompany(sampleCandidate, sampleIcp);
    expect(evaluation.totalScore).toBeGreaterThanOrEqual(75);
    expect(evaluation.recommendation).toBe('PRIORITIZE');
    expect(evaluation.positiveSignals.length).toBeGreaterThan(0);
  });

  it('should immediately block and score 0 for blacklisted domains (Guardrail 7.1)', () => {
    const blacklistedCandidate: CompanyCandidate = {
      ...sampleCandidate,
      domain: 'blacklisted-company.com'
    };
    const evaluation = scoringEngine.evaluateCompany(blacklistedCandidate, sampleIcp);
    expect(evaluation.totalScore).toBe(0);
    expect(evaluation.recommendation).toBe('DISCARD');
    expect(evaluation.riskWarnings[0]).toContain('BLOQUEO POR GUARDRAIL');
  });

  it('should triage opt-out requests and trigger immediate cadence halt', async () => {
    const result = await responseClassifier.classifyResponse({
      companyName: 'Test Corp',
      contactName: 'Juan',
      originalMessage: 'Propuesta de alianza',
      prospectReply: 'No nos interesa en absoluto, por favor eliminar de la lista y no enviar más correos.'
    });

    expect(result.sentiment).toBe('OPT_OUT_UNSUBSCRIBE');
    expect(result.optOutRequested).toBe(true);
    expect(result.recommendedNextAction).toBe('HALT_CADENCE_AND_BLOCK');
  });

  it('should triage positive interest and propose calendar time slots', async () => {
    const result = await responseClassifier.classifyResponse({
      companyName: 'Test Corp',
      contactName: 'Laura',
      originalMessage: 'Propuesta de alianza',
      prospectReply: '¡Hola! Nos interesa la propuesta para nuestros usuarios. ¿Qué horarios tienen el próximo martes para una reunión?'
    });

    expect(result.sentiment).toBe('POSITIVE_INTEREST');
    expect(result.recommendedNextAction).toBe('SCHEDULE_MEETING');
    expect(result.proposedTimeSlots?.length).toBeGreaterThan(0);
  });
});
