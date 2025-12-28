// Shared storage for proposals - prevents module instance issues
declare global {
  var axiomProposals: { [key: string]: Proposal } | undefined;
}

export interface Proposal {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  projectTitle: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  startDate: string;
  deliverables: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  content: {
    executiveSummary: string;
    scopeOfWork: string;
    pricingBreakdown: string;
    timeline: string;
    termsAndConditions: string;
  };
}

// Use global scope to share storage across all module instances
// Initialize from global if exists, otherwise create empty object
if (!global.axiomProposals) {
  global.axiomProposals = {};
}

// Always reference the global object directly
const sharedProposals = global.axiomProposals;

export function getProposals(): { [key: string]: Proposal } {
  return global.axiomProposals || {};
}

export function getProposal(id: string): Proposal | undefined {
  return global.axiomProposals?.[id];
}

export function setProposal(id: string, proposal: Proposal): void {
  if (global.axiomProposals) {
    global.axiomProposals[id] = proposal;
  }
}

export function deleteProposal(id: string): void {
  if (global.axiomProposals) {
    delete global.axiomProposals[id];
  }
}

export function getUserProposals(userId: string): Proposal[] {
  return Object.values(global.axiomProposals || {}).filter(p => p.userId === userId);
}

export function resetProposals(): void {
  global.axiomProposals = {};
}
