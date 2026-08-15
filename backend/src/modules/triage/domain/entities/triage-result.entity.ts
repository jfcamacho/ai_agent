export interface TimeSlotOption {
  date: string;
  time: string;
  durationMinutes: number;
}

export class TriageRecord {
  id: string;
  leadId: string;
  companyName: string;
  contactName: string;
  prospectReply: string;
  sentiment: 'POSITIVE_INTEREST' | 'OBJECTION' | 'AMBIGUOUS_SENSITIVE' | 'OPT_OUT_UNSUBSCRIBE' | 'OUT_OF_OFFICE';
  confidence: number;
  analysis: string;
  detectedIntent: string;
  recommendedNextAction: 'SCHEDULE_MEETING' | 'ESCALATE_TO_HUNTER' | 'HALT_CADENCE_AND_BLOCK' | 'RETRY_LATER';
  optOutRequested: boolean;
  proposedTimeSlots?: TimeSlotOption[];
  triagedAt: string;

  constructor(partial: Partial<TriageRecord>) {
    Object.assign(this, partial);
  }
}
