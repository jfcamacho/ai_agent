import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Appointment,
  AuditLog,
  Company,
  DashboardMetrics,
  IcpConfig,
  IntegrationConfig,
  Lead,
  OutreachMessage,
  PeopleSearchResult,
  VirtualOutboxRecord
} from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = (window as any).__ENV_API_URL__ || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8080/api/v1' : 'https://intermx-hunting-backend-550761856984.us-central1.run.app/api/v1');

  constructor(private readonly http: HttpClient) {}

  // 1. Leads & Discovery
  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${this.baseUrl}/leads`);
  }

  triggerDiscovery(max = 15, sector?: string): Observable<{ discoveredCount: number; leads: Lead[] }> {
    const url = sector && sector !== 'ALL'
      ? `${this.baseUrl}/leads/discover?max=${max}&sector=${encodeURIComponent(sector)}`
      : `${this.baseUrl}/leads/discover?max=${max}`;
    return this.http.post<{ discoveredCount: number; leads: Lead[] }>(url, {});
  }

  investigateCompany(payload: {
    name: string;
    domain: string;
    industry?: string;
    customContext?: string;
  }): Observable<Lead> {
    return this.http.post<Lead>(`${this.baseUrl}/leads/investigate`, payload);
  }

  approveLead(id: string, hunterName = 'Hunter Inter.mx', reason?: string): Observable<Lead> {
    return this.http.patch<Lead>(`${this.baseUrl}/leads/${id}/approve`, { hunterName, reason });
  }

  rejectLead(id: string, hunterName = 'Hunter Inter.mx', reason?: string): Observable<Lead> {
    return this.http.patch<Lead>(`${this.baseUrl}/leads/${id}/reject`, { hunterName, reason });
  }

  // 2. Companies & Expedientes 360°
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/companies`);
  }

  getCompanyDossier(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/companies/${id}`);
  }

  // 3. Outreach & AI Copy Studio
  generateDraft(payload: {
    leadId: string;
    hunterName?: string;
    hunterRole?: string;
    channel?: 'EMAIL' | 'LINKEDIN';
  }): Observable<OutreachMessage> {
    return this.http.post<OutreachMessage>(`${this.baseUrl}/outreach/draft`, payload);
  }

  approveAndSend(payload: {
    messageId: string;
    approvedBy: string;
    editedSubject?: string;
    editedBody?: string;
  }): Observable<{ message: OutreachMessage; sandboxDelivery: any }> {
    return this.http.post<{ message: OutreachMessage; sandboxDelivery: any }>(
      `${this.baseUrl}/outreach/approve-and-send`,
      payload
    );
  }

  getVirtualOutbox(): Observable<VirtualOutboxRecord[]> {
    return this.http.get<VirtualOutboxRecord[]>(`${this.baseUrl}/outreach/virtual-outbox`);
  }

  // 4. Appointments & Calendar
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/appointments`);
  }

  scheduleAppointment(payload: {
    leadId: string;
    meetingDate: string;
    meetingTime: string;
    durationMinutes?: number;
    hunterName?: string;
    agendaSummary?: string;
  }): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments/schedule`, payload);
  }

  // 5. ICP Configuration & Blacklist
  getIcpConfig(): Observable<IcpConfig> {
    return this.http.get<IcpConfig>(`${this.baseUrl}/icp-config`);
  }

  updateIcpConfig(payload: Partial<IcpConfig>): Observable<IcpConfig> {
    return this.http.put<IcpConfig>(`${this.baseUrl}/icp-config`, payload);
  }

  // 6. Metrics & Dashboard
  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.baseUrl}/dashboard/metrics`);
  }

  // 7. Audit Logs
  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.baseUrl}/audit`);
  }

  // 8. Sandbox Simulator
  simulateProspectReply(payload: {
    leadId: string;
    scenario: 'POSITIVE_INTEREST' | 'OPT_OUT_UNSUBSCRIBE' | 'OBJECTION' | 'CUSTOM';
    customReplyText?: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/sandbox-simulator/simulate-reply`, payload);
  }

  seedDemoLeads(): Observable<any> {
    return this.http.post(`${this.baseUrl}/sandbox-simulator/seed-demo-leads`, {});
  }

  resetSandbox(): Observable<{ success: boolean; message: string; timestamp: string }> {
    return this.http.post<{ success: boolean; message: string; timestamp: string }>(
      `${this.baseUrl}/sandbox-simulator/reset`,
      {}
    );
  }

  // 9. Integrations & B2B People Search (M06)
  getIntegrations(): Observable<IntegrationConfig[]> {
    return this.http.get<IntegrationConfig[]>(`${this.baseUrl}/integrations`);
  }

  updateIntegration(id: string, payload: Partial<IntegrationConfig>): Observable<IntegrationConfig> {
    return this.http.put<IntegrationConfig>(`${this.baseUrl}/integrations/${id}`, payload);
  }

  testIntegration(id: string, payload?: { apiKey?: string; isEnabled?: boolean }): Observable<{ success: boolean; message: string; latencyMs: number; config: IntegrationConfig }> {
    return this.http.post<{ success: boolean; message: string; latencyMs: number; config: IntegrationConfig }>(
      `${this.baseUrl}/integrations/${id}/test`,
      payload || {}
    );
  }

  searchPeople(payload: {
    companyName: string;
    domain?: string;
    personName?: string;
    roleOrDepartment?: string;
  }): Observable<{ count: number; people: PeopleSearchResult[]; providersQueried: string[] }> {
    return this.http.post<{ count: number; people: PeopleSearchResult[]; providersQueried: string[] }>(
      `${this.baseUrl}/integrations/search-people`,
      payload
    );
  }
}
