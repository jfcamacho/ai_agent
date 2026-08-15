import { CompanyCandidate, IcpCriteria, ScoringBreakdown } from '../types/index.js';

export class ScoringEngine {
  public evaluateCompany(company: CompanyCandidate, icp: IcpCriteria): ScoringBreakdown {
    // 1. Check Blacklist / Exclusions first
    const isDomainBlacklisted = icp.blacklistedDomains.some(d => 
      company.domain.toLowerCase().includes(d.toLowerCase()) || 
      company.website.toLowerCase().includes(d.toLowerCase())
    );

    if (isDomainBlacklisted) {
      return {
        totalScore: 0,
        recommendation: 'DISCARD',
        icpFit: { name: 'Fit ICP', score: 0, maxScore: 30, weight: 0.3, reasoning: 'Empresa incluida en lista de exclusión / Blacklist comercial.' },
        b2b2cPotential: { name: 'Potencial B2B2C', score: 0, maxScore: 30, weight: 0.3, reasoning: 'Bloqueado por reglas de exclusión.' },
        channelReadiness: { name: 'Madurez de Canal', score: 0, maxScore: 20, weight: 0.2, reasoning: 'No evaluado por exclusión.' },
        marketPresence: { name: 'Presencia de Mercado', score: 0, maxScore: 20, weight: 0.2, reasoning: 'No evaluado por exclusión.' },
        positiveSignals: [],
        riskWarnings: ['BLOQUEO POR GUARDRAIL: Dominio o empresa listada en exclusiones obligatorias.'],
        overallJustification: 'Descartado automáticamente por coincidir con la lista de exclusiones y reglas de negocio del área de Alianzas.',
        evaluatedAt: new Date().toISOString(),
        evaluatorVersion: '2.0.0-hex-guardrails'
      };
    }

    const positiveSignals: string[] = [];
    const riskWarnings: string[] = [];

    // Dimension 1: ICP Fit (Max 30)
    let icpScore = 0;
    const isIndustryMatch = icp.targetIndustries.some(ind => 
      company.industry.toLowerCase().includes(ind.toLowerCase()) || 
      (company.subIndustry && company.subIndustry.toLowerCase().includes(ind.toLowerCase()))
    );
    if (isIndustryMatch) {
      icpScore += 15;
      positiveSignals.push(`Industria altamente afín (${company.industry} / ${company.subIndustry || ''})`);
    } else {
      icpScore += 5;
      riskWarnings.push(`Industria secundaria fuera del foco prioritario (${company.industry})`);
    }

    const hasTargetRole = company.decisionMakers.some(dm => 
      icp.targetDecisionMakerRoles.some(role => dm.role.toLowerCase().includes(role.toLowerCase()) || dm.department.toLowerCase().includes('alianza') || dm.department.toLowerCase().includes('partner'))
    );
    if (hasTargetRole) {
      icpScore += 10;
      positiveSignals.push('Decisor identificado con cargo de Alianzas / C-Level verificado');
    } else {
      icpScore += 3;
      riskWarnings.push('Sin decisor directo de alianzas localizado (requiere mapeo)');
    }

    if (company.country === 'México') {
      icpScore += 5;
    }

    // Dimension 2: B2B2C Potential (Max 30)
    let b2b2cScore = 0;
    if (company.businessModel === 'B2B2C') {
      b2b2cScore += 15;
      positiveSignals.push('Modelo de negocio nativo B2B2C con canales de distribución a usuarios finales');
    } else if (company.businessModel === 'B2B' || company.businessModel === 'B2C') {
      b2b2cScore += 10;
      positiveSignals.push(`Modelo ${company.businessModel} con oportunidad de habilitar canal B2B2C`);
    } else {
      b2b2cScore += 6;
    }

    if (company.insuranceAffinityCategory === 'EMBEDDED_INSURANCE' || company.insuranceAffinityCategory === 'PAYROLL_BENEFITS') {
      b2b2cScore += 15;
      positiveSignals.push(`Alta afinidad de producto para ${company.insuranceAffinityCategory === 'EMBEDDED_INSURANCE' ? 'Seguros Embebidos en Checkout' : 'Beneficios y Microseguros para Empleados'}`);
    } else {
      b2b2cScore += 8;
      positiveSignals.push('Oportunidad de protección a PyMEs o comercios afiliados');
    }

    // Dimension 3: Channel Readiness & Tech (Max 20)
    let channelScore = 0;
    if (company.signals && company.signals.length > 0) {
      channelScore += 12;
      positiveSignals.push(`Detección de ${company.signals.length} señales comerciales activas recientes en medios`);
    } else {
      channelScore += 6;
    }

    if (company.website && company.website.startsWith('https')) {
      channelScore += 8;
    }

    // Dimension 4: Market Presence & Scale (Max 20)
    let marketScore = 0;
    if (company.estimatedEmployees >= 500) {
      marketScore += 12;
      positiveSignals.push(`Empresa consolidada con más de ${company.estimatedEmployees} empleados`);
    } else if (company.estimatedEmployees >= 100) {
      marketScore += 9;
      positiveSignals.push(`Empresa en escala con ${company.estimatedEmployees} colaboradores`);
    } else {
      marketScore += 5;
      riskWarnings.push('Empresa en etapa temprana (menor a 100 empleados)');
    }

    if (company.estimatedUserBase) {
      marketScore += 8;
      positiveSignals.push(`Base estimada de clientes/usuarios: ${company.estimatedUserBase}`);
    } else {
      marketScore += 4;
    }

    const totalScore = Math.min(100, icpScore + b2b2cScore + channelScore + marketScore);

    let recommendation: 'PRIORITIZE' | 'REVIEW' | 'DISCARD' = 'REVIEW';
    if (totalScore >= icp.minimumScoreThreshold) {
      recommendation = 'PRIORITIZE';
    } else if (totalScore < 50) {
      recommendation = 'DISCARD';
    }

    const overallJustification = `${company.name} presenta un score integral de ${totalScore}/100 (${recommendation}). ` +
      `Destaca por su modelo ${company.businessModel} en el sector ${company.industry} con afinidad de ${company.insuranceAffinityCategory.replace('_', ' ')}. ` +
      `${positiveSignals[0] || ''}. ` +
      (riskWarnings.length > 0 ? `Atención requerida: ${riskWarnings[0]}.` : 'Cumple satisfactoriamente los criterios de prospección.');

    return {
      totalScore,
      recommendation,
      icpFit: {
        name: 'Fit ICP',
        score: icpScore,
        maxScore: 30,
        weight: 0.3,
        reasoning: `Alineación con sector ${company.industry} y decisor (${icpScore}/30 pts)`
      },
      b2b2cPotential: {
        name: 'Potencial B2B2C',
        score: b2b2cScore,
        maxScore: 30,
        weight: 0.3,
        reasoning: `Evaluación de modelo comercial ${company.businessModel} y afinidad de seguros (${b2b2cScore}/30 pts)`
      },
      channelReadiness: {
        name: 'Madurez de Canal',
        score: channelScore,
        maxScore: 20,
        weight: 0.2,
        reasoning: `Señales de producto digital y tracción tecnológica (${channelScore}/20 pts)`
      },
      marketPresence: {
        name: 'Presencia y Escala',
        score: marketScore,
        maxScore: 20,
        weight: 0.2,
        reasoning: `Tamaño organizacional (${company.estimatedEmployees} emp) y alcance de mercado (${marketScore}/20 pts)`
      },
      positiveSignals,
      riskWarnings,
      overallJustification,
      evaluatedAt: new Date().toISOString(),
      evaluatorVersion: '2.0.0-hex-guardrails'
    };
  }
}

export const scoringEngine = new ScoringEngine();
