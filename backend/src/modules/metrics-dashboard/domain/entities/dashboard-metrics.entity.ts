export interface BaselineComparison {
  metricName: string;
  baselineManual: number | string;
  pilotWithAi: number | string;
  deltaPercentage: string;
  interpretation: string;
}

export class DashboardMetrics {
  totalDiscoveredCompanies: number;
  totalPrioritizedLeads: number;
  totalReviewedLeads: number;
  totalApprovedLeads: number;
  totalRejectedLeads: number;
  approvalRatePercentage: number;
  totalMessagesSentSandbox: number;
  totalPositiveResponses: number;
  totalOptOutsHalted: number;
  totalQualifiedAppointments: number;
  estimatedHoursSaved: number;
  estimatedCostPerLead: number;
  guardrailsComplianceRate: number;
  baselineComparison: BaselineComparison[];
  calculatedAt: string;

  constructor(partial: Partial<DashboardMetrics>) {
    Object.assign(this, partial);
  }
}
