/**
 * Storage Service - handles persistent storage for proposals.
 * Provides fallback memory storage if localStorage is not accessible.
 */

const STORAGE_KEY = 'proposify_proposals_store_v1';

export const INITIAL_SEEDED_PROPOSALS = [
  {
    id: 'prop-101',
    title: 'Cloud Infrastructure Modernization',
    description: 'Migration of on-premise monolithic architecture to scalable AWS containerized microservices with Terraform automation.',
    clientName: 'AeroGlobal Logistics',
    clientEmail: 'procurement@aeroglobal.io',
    amount: 48500,
    currency: 'USD',
    status: 'draft',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: null,
    acceptedAt: null,
    rejectedAt: null,
    archivedAt: null,
    isArchived: false,
  },
  {
    id: 'prop-102',
    title: 'Mobile Banking App Experience Redesign',
    description: 'Comprehensive UI/UX overhaul of the consumer iOS and Android applications, improving onboarding funnel conversion by 35%.',
    clientName: 'FinVanguard Credit Union',
    clientEmail: 'contact@finvanguard.com',
    amount: 32000,
    currency: 'USD',
    status: 'sent',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: null,
    rejectedAt: null,
    archivedAt: null,
    isArchived: false,
  },
  {
    id: 'prop-103',
    title: 'Enterprise Security Audit & SOC2 Certification',
    description: 'End-to-end vulnerability assessment, penetration testing, and security controls hardening ahead of SOC2 Type II audit.',
    clientName: 'SecureScale AI',
    clientEmail: 'security@securescale.ai',
    amount: 54000,
    currency: 'USD',
    status: 'accepted',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    rejectedAt: null,
    archivedAt: null,
    isArchived: false,
  },
  {
    id: 'prop-104',
    title: 'AI Virtual Assistant Customer Support Bot',
    description: 'Custom fine-tuned LLM conversational agent integrated with Zendesk and internal knowledge bases for tier-1 ticket deflection.',
    clientName: 'Nexus Retail Brands',
    clientEmail: 'tech-vendor@nexusretail.com',
    amount: 21500,
    currency: 'USD',
    status: 'rejected',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: null,
    rejectedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    archivedAt: null,
    isArchived: false,
  },
  {
    id: 'prop-105',
    title: 'Legacy ERP Data Warehouse Migration Study',
    description: 'Preliminary feasibility assessment and extract-transform-load pipeline specification for SAP to Snowflake migration.',
    clientName: 'Summit Manufacturing Ltd',
    clientEmail: 'it-purchasing@summitmfg.org',
    amount: 18000,
    currency: 'USD',
    status: 'sent',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: null,
    rejectedAt: null,
    archivedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    isArchived: true,
  },
  {
    id: 'prop-106',
    title: 'Marketing Automation Platform Integration',
    description: 'HubSpot and Salesforce bi-directional contact synchronization and custom scoring workflow setup.',
    clientName: 'Kite Growth Partners',
    clientEmail: 'operations@kitegrowth.co',
    amount: 14500,
    currency: 'USD',
    status: 'draft',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: null,
    acceptedAt: null,
    rejectedAt: null,
    archivedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    isArchived: true,
  },
];

let memoryStore = null;

function isLocalStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__proposify_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export const storageService = {
  load() {
    if (isLocalStorageAvailable()) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.save(INITIAL_SEEDED_PROPOSALS);
        return [...INITIAL_SEEDED_PROPOSALS];
      }
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse stored proposals, reverting to initial seed:', err);
      }
      this.save(INITIAL_SEEDED_PROPOSALS);
      return [...INITIAL_SEEDED_PROPOSALS];
    }

    if (!memoryStore) {
      memoryStore = JSON.parse(JSON.stringify(INITIAL_SEEDED_PROPOSALS));
    }
    return [...memoryStore];
  },

  save(proposals) {
    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
    }
    memoryStore = JSON.parse(JSON.stringify(proposals));
  },

  reset() {
    if (isLocalStorageAvailable()) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    memoryStore = null;
    return this.load();
  },

  clearAllForTesting() {
    if (isLocalStorageAvailable()) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    memoryStore = [];
    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }
};
