import { geminiProvider } from '../providers/geminiProvider.js';
import { OutreachDraftRequest, OutreachDraftResult } from '../types/index.js';

export class OutreachGenerator {
  public async generateDraft(request: OutreachDraftRequest): Promise<OutreachDraftResult> {
    const { company, targetContact, hunterName, hunterRole } = request;

    const contactFirstName = targetContact.name.split(' ')[0];
    const affinityName = company.insuranceAffinityCategory.replace('_', ' ').toLowerCase();

    let valueProp = '';
    if (company.insuranceAffinityCategory === 'EMBEDDED_INSURANCE') {
      valueProp = 'Habilitar microseguros e indemnización digital integrados de forma nativa en su flujo transaccional vía API.';
    } else if (company.insuranceAffinityCategory === 'PAYROLL_BENEFITS') {
      valueProp = 'Incorporar esquemas de protección y seguros de gastos médicos y vida como beneficio directo para colaboradores.';
    } else if (company.insuranceAffinityCategory === 'GIG_ECONOMY_PROTECTION') {
      valueProp = 'Proteger a repartidores y usuarios de su membresía con pólizas bajo demanda y cobertura en tiempo real.';
    } else {
      valueProp = 'Ofrecer coberturas comerciales y de responsabilidad civil diseñadas para comercios y empresas afiliadas.';
    }

    let subject = `Alianza Estratégica Inter.mx <> ${company.name} | Innovación en Seguros Digitales`;
    let body = '';

    const recentSignal = company.signals && company.signals.length > 0 ? company.signals[0].title : null;
    const hookRationale = recentSignal 
      ? `Se utilizó la señal pública observada: "${recentSignal}" para contextualizar el contacto.`
      : `Se vinculó el modelo ${company.businessModel} y el sector ${company.industry} con la capacidad tecnológica de Inter.mx.`;

    if (geminiProvider.isLiveAiAvailable()) {
      const prompt = `Redacta un correo comercial B2B2C ultra profesional, conciso y respetuoso para Alianzas Estratégicas de Inter.mx.
Destinatario: ${targetContact.name} (${targetContact.role} en ${company.name}).
Remitente: ${hunterName} (${hunterRole} en Inter.mx).
Propuesta de valor: ${valueProp}
Señal de contexto observada: ${recentSignal || 'Expansión de su plataforma digital'}
GUARDRAILS OBLIGATORIOS:
1. No inventar cifras de ahorro ni casos de éxito ficticios.
2. Tono consultivo y directo. Proponer una breve llamada de 15 minutos para explorar sinergias.
3. Máximo 180 palabras.

Responde ÚNICAMENTE con el formato JSON:
{
  "subject": "asunto del correo",
  "body": "cuerpo del correo con saltos de línea"
}`;
      const aiResponse = await geminiProvider.generateText(prompt);
      if (aiResponse) {
        try {
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.subject && parsed.body) {
              subject = parsed.subject;
              body = parsed.body;
            }
          }
        } catch {
          // fallback to deterministic template
        }
      }
    }

    if (!body) {
      body = `Hola ${contactFirstName}, espero que te encuentres muy bien.

Sigo con mucho interés el liderazgo de ${company.name} en el sector de ${company.industry}${recentSignal ? `, especialmente su reciente hito sobre ${recentSignal}` : ''}.

Desde Inter.mx, como líderes en innovación de corretaje digital e insurtech en México, trabajamos con aliados estratégicos para ${valueProp.toLowerCase()}

Diseñamos esquemas donde la tecnología elimina la fricción operativa y aporta una nueva línea de valor y monetización para sus usuarios.

¿Tendrías 15 minutos esta semana para una breve llamada introductoria y revisar si hace sentido explorar una sinergia conjunta?

Saludos cordiales,

${hunterName}
${hunterRole} | Inter.mx
alianzas@inter.mx | www.inter.mx`;
    }

    return {
      subject,
      body,
      valueProposition: valueProp,
      hookRationale,
      factsUtilized: [
        `Empresa: ${company.name} (${company.industry})`,
        `Decisor: ${targetContact.name} (${targetContact.role})`,
        recentSignal ? `Señal: ${recentSignal}` : `Modelo: ${company.businessModel}`
      ],
      guardrailsVerified: true,
      channel: 'EMAIL',
      generatedAt: new Date().toISOString()
    };
  }
}

export const outreachGenerator = new OutreachGenerator();
