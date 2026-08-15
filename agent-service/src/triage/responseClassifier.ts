import { geminiProvider } from '../providers/geminiProvider.js';
import { TriageRequest, TriageResult } from '../types/index.js';

export class ResponseClassifier {
  public async classifyResponse(request: TriageRequest): Promise<TriageResult> {
    const replyLower = request.prospectReply.toLowerCase();

    // 1. Immediate deterministic check for opt-out / unsubscribe keywords (Guardrail 7.1)
    const optOutPhrases = [
      'no me interesa',
      'no estamos interesados',
      'eliminar de la lista',
      'cancelar suscripción',
      'baja',
      'unsubscribe',
      'no enviar más',
      'remover mis datos',
      'dejen de escribir'
    ];

    const isOptOut = optOutPhrases.some(phrase => replyLower.includes(phrase));
    if (isOptOut) {
      return {
        sentiment: 'OPT_OUT_UNSUBSCRIBE',
        confidence: 0.99,
        analysis: 'El prospecto ha solicitado expresamente la baja o no ser contactado nuevamente.',
        detectedIntent: 'SOLICITUD_DE_BAJA_INMEDIATA',
        recommendedNextAction: 'HALT_CADENCE_AND_BLOCK',
        optOutRequested: true,
        classifiedAt: new Date().toISOString()
      };
    }

    // 2. Positive interest check
    const positivePhrases = [
      'sí me interesa',
      'nos interesa',
      'agendemos',
      'llamada',
      'reunión',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'lunes',
      'horario',
      'platiquemos',
      'con gusto',
      'cuándo nos reunimos',
      'calendario'
    ];

    const isPositive = positivePhrases.some(p => replyLower.includes(p));

    if (isPositive) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const dateStr = tomorrow.toISOString().split('T')[0];

      return {
        sentiment: 'POSITIVE_INTEREST',
        confidence: 0.95,
        analysis: 'El prospecto manifiesta interés explícito en conocer la propuesta o coordinar una sesión de trabajo.',
        detectedIntent: 'AGENDAMIENTO_CITA_CALIFICADA',
        recommendedNextAction: 'SCHEDULE_MEETING',
        optOutRequested: false,
        proposedTimeSlots: [
          { date: dateStr, time: '10:00 AM (CDMX)', durationMinutes: 30 },
          { date: dateStr, time: '04:00 PM (CDMX)', durationMinutes: 30 }
        ],
        classifiedAt: new Date().toISOString()
      };
    }

    // 3. Fallback to Gemini / Ambiguous
    if (geminiProvider.isLiveAiAvailable()) {
      const prompt = `Analiza la siguiente respuesta comercial de un prospecto:
Respuesta: "${request.prospectReply}"
Clasifica en una de estas categorías: POSITIVE_INTEREST, OBJECTION, AMBIGUOUS_SENSITIVE, OPT_OUT_UNSUBSCRIBE, OUT_OF_OFFICE.
Responde en JSON:
{
  "sentiment": "CATEGORIA",
  "analysis": "explicación breve",
  "detectedIntent": "intención detectada",
  "recommendedNextAction": "SCHEDULE_MEETING o ESCALATE_TO_HUNTER o HALT_CADENCE_AND_BLOCK"
}`;
      const aiResult = await geminiProvider.generateText(prompt);
      if (aiResult) {
        try {
          const match = aiResult.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            return {
              sentiment: parsed.sentiment || 'AMBIGUOUS_SENSITIVE',
              confidence: 0.88,
              analysis: parsed.analysis || 'Clasificación asistida por IA.',
              detectedIntent: parsed.detectedIntent || 'CONSULTA_GENERAL',
              recommendedNextAction: parsed.recommendedNextAction || 'ESCALATE_TO_HUNTER',
              optOutRequested: parsed.sentiment === 'OPT_OUT_UNSUBSCRIBE',
              classifiedAt: new Date().toISOString()
            };
          }
        } catch {
          // ignore
        }
      }
    }

    return {
      sentiment: 'AMBIGUOUS_SENSITIVE',
      confidence: 0.80,
      analysis: 'La respuesta contiene dudas técnicas o condiciones comerciales que requieren análisis directo del Hunter.',
      detectedIntent: 'CONSULTA_CON_OBJECION',
      recommendedNextAction: 'ESCALATE_TO_HUNTER',
      optOutRequested: false,
      classifiedAt: new Date().toISOString()
    };
  }
}

export const responseClassifier = new ResponseClassifier();
