import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { outreachGenerator } from './copywriter/outreachGenerator.js';
import { peopleHunter } from './discovery/peopleHunter.js';
import { proactiveHunter } from './discovery/proactiveHunter.js';
import { businessEnricher } from './enrichment/businessEnricher.js';
import { scoringEngine } from './scoring/scoringEngine.js';
import { responseClassifier } from './triage/responseClassifier.js';
import { IcpCriteria, OutreachDraftRequest, TriageRequest } from './types/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[AGENT-SERVICE] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'intermx-agent-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 1. Proactive Discovery Endpoint (Invoked on-demand or by GCP Cloud Scheduler)
app.post('/agent/discovery', async (req: Request, res: Response) => {
  try {
    const icp: IcpCriteria = req.body.icp || {
      id: 'default_icp_v1',
      version: 1,
      targetIndustries: ['Fintech', 'HR Tech', 'Retail', 'Logistics Tech', 'Mobility', 'HealthTech'],
      targetCompanySizes: ['100-500', '500-1000', '1000+'],
      targetLocations: ['México'],
      targetDecisionMakerRoles: ['Alianzas', 'Partnerships', 'CPO', 'Director Comercial', 'Beneficios'],
      excludedKeywords: ['Aseguradora directa', 'Competidor'],
      blacklistedDomains: ['gnp.com.mx', 'qualitas.com.mx', 'metlife.com.mx'],
      minimumScoreThreshold: 75,
      autoApproveThreshold: 90
    };

    const maxResults = req.body.maxResults || 15;
    const sectorFilter = req.body.sectorFilter;
    const candidates = await proactiveHunter.discoverCandidates(icp, maxResults, sectorFilter);

    res.json({
      success: true,
      count: candidates.length,
      candidates,
      executedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in discovery endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 1.2 Multi-Provider People & Decision Maker Search (M06)
app.post('/agent/people-search', async (req: Request, res: Response) => {
  try {
    const { companyName, domain, personName, roleOrDepartment, apiKeys } = req.body;
    if (!companyName && !domain && !personName) {
      return res.status(400).json({ error: 'companyName, domain, or personName is required' });
    }

    const people = await peopleHunter.searchPeople({
      companyName: companyName || domain || 'inter.mx',
      domain: domain || companyName || 'inter.mx',
      personName,
      roleOrDepartment: roleOrDepartment || 'Alianzas y Dirección',
      apiKeys
    });

    res.json({
      success: true,
      count: people.length,
      people,
      searchedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in people-search endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post('/agent/investigate', async (req: Request, res: Response) => {
  try {
    const { name, domain, industry, customContext, icp } = req.body;
    if (!name || !domain) {
      return res.status(400).json({ error: 'name and domain are required' });
    }

    const activeIcp: IcpCriteria = icp || {
      id: 'default_icp_v1',
      version: 1,
      targetIndustries: ['Fintech', 'HR Tech', 'Retail', 'Logistics Tech', 'Mobility', 'HealthTech'],
      targetCompanySizes: ['100-500', '500-1000', '1000+'],
      targetLocations: ['México'],
      targetDecisionMakerRoles: ['Alianzas', 'Partnerships', 'CPO', 'Director Comercial', 'Beneficios'],
      excludedKeywords: ['Aseguradora directa', 'Competidor'],
      blacklistedDomains: ['gnp.com.mx', 'qualitas.com.mx', 'metlife.com.mx'],
      minimumScoreThreshold: 75,
      autoApproveThreshold: 90
    };

    const candidate = await proactiveHunter.investigateCustomCompany(
      { name, domain, industry, customContext },
      activeIcp
    );

    res.json({
      success: true,
      candidate,
      analyzedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in investigate endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Company Enrichment Endpoint
app.post('/agent/enrich', async (req: Request, res: Response) => {
  try {
    const { company } = req.body;
    if (!company) {
      return res.status(400).json({ error: 'Company object is required' });
    }

    const enriched = await businessEnricher.enrichCompany(company);
    res.json({ success: true, company: enriched });
  } catch (error: any) {
    console.error('Error in enrich endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Multi-Factor Explainable Scoring Endpoint
app.post('/agent/score', (req: Request, res: Response) => {
  try {
    const { company, icp } = req.body;
    if (!company || !icp) {
      return res.status(400).json({ error: 'Both company and icp objects are required' });
    }

    const scoring = scoringEngine.evaluateCompany(company, icp);
    res.json({ success: true, scoring });
  } catch (error: any) {
    console.error('Error in score endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Personalized Outreach Copywriter Endpoint (With Guardrails)
app.post('/agent/generate-outreach', async (req: Request, res: Response) => {
  try {
    const draftRequest: OutreachDraftRequest = req.body;
    if (!draftRequest.company || !draftRequest.targetContact) {
      return res.status(400).json({ error: 'company and targetContact are required' });
    }

    const result = await outreachGenerator.generateDraft(draftRequest);
    res.json({ success: true, draft: result });
  } catch (error: any) {
    console.error('Error in generate-outreach endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Response Sentiment Triage & Guardrail Trigger Endpoint
app.post('/agent/triage', async (req: Request, res: Response) => {
  try {
    const triageRequest: TriageRequest = req.body;
    if (!triageRequest.prospectReply) {
      return res.status(400).json({ error: 'prospectReply is required' });
    }

    const triageResult = await responseClassifier.classifyResponse(triageRequest);
    res.json({ success: true, result: triageResult });
  } catch (error: any) {
    console.error('Error in triage endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🤖 Inter.mx AI Hunting Agent Service RUNNING on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`====================================================`);
});
