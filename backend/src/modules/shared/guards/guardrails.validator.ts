import { Injectable } from '@nestjs/common';

@Injectable()
export class GuardrailsValidator {
  public validateOutreachMessage(subject: string, body: string): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    // Guardrail 1: No prohibited claims or unverified monetary guarantees
    const prohibitedWords = ['100% garantizado', 'sin riesgo alguno', 'ganancia asegurada'];
    for (const word of prohibitedWords) {
      if (body.toLowerCase().includes(word)) {
        violations.push(`GUARDRAIL_VIOLATION: Contenido prohibido detectado ("${word}")`);
      }
    }

    // Guardrail 2: Must contain human sender signature
    if (!body.includes('Inter.mx')) {
      violations.push('GUARDRAIL_VIOLATION: El mensaje debe incluir la firma institucional de Inter.mx');
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }
}
