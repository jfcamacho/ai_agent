export class IcpConfig {
  id: string;
  version: number;
  targetIndustries: string[];
  targetCompanySizes: string[];
  targetLocations: string[];
  targetDecisionMakerRoles: string[];
  excludedKeywords: string[];
  blacklistedDomains: string[];
  minimumScoreThreshold: number;
  autoApproveThreshold: number;
  weights: {
    icpFit: number;
    b2b2cPotential: number;
    channelReadiness: number;
    marketPresence: number;
  };
  isActive: boolean;
  updatedAt: string;

  constructor(partial: Partial<IcpConfig>) {
    Object.assign(this, partial);
  }
}
