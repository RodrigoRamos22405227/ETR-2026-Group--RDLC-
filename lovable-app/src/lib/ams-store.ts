// AMS Intake Platform — storage & business logic (localStorage backed)
// Healthcare variant · GDPR Privacy & Data Retention

export type AppRole = "Transition Lead" | "Privacy Officer" | "Legal Representative";
export type StakeholderRole = AppRole;

export const APP_ROLES: AppRole[] = [
  "Transition Lead",
  "Privacy Officer",
  "Legal Representative",
];

// Authorized roles for intake evaluation (UC-07)
const AUTHORIZED_ROLES: StakeholderRole[] = ["Transition Lead", "Privacy Officer"];

export const RETENTION_WARN_DAYS = 25;
export const RETENTION_PURGE_DAYS = 30;
export const EVIDENCE_FRESHNESS_DAYS = 30;

export type EvidenceType = "DR Test" | "Authorization" | "Access Control" | "Other";
export const EVIDENCE_TYPES: EvidenceType[] = [
  "DR Test",
  "Authorization",
  "Access Control",
  "Other",
];

export interface Stakeholder {
  id: string;
  email: string; // encrypted (base64)
  role: StakeholderRole;
  approved: boolean; // UC-07 authority verification
  createdAt: string;
  lastActivity: string;
}

export interface Evidence {
  id: string;
  name: string;
  type: EvidenceType;
  issuedDate: string; // ISO date
  uploadDate: string; // ISO timestamp
  uploadedBy: AppRole;
}

export interface AuditEntry {
  id: string;
  userId: string;
  userRole: AppRole | "System";
  action: string; // action type
  detail: string; // non-personal description
  timestamp: string; // UTC ISO
  ip: string; // mock
  hash: string;
  prevHash: string;
}

export interface Session {
  id: string;
  createdAt: string;
  lastActivityDate: string;
  locked: boolean;
  status: "Open" | "Ready to Proceed" | "Need More Data" | "Purged";
}

export interface RetentionConfig {
  days: number;
}

const KEYS = {
  stakeholders: "ams.stakeholders",
  evidence: "ams.evidence",
  audit: "ams.audit",
  retention: "ams.retention",
  session: "ams.session",
  role: "ams.activeRole",
};

// ---- helpers ----
const enc = (s: string) =>
  typeof window === "undefined" ? s : btoa(unescape(encodeURIComponent(s)));
export const dec = (s: string) => {
  try {
    return decodeURIComponent(escape(atob(s)));
  } catch {
    return s;
  }
};

const read = <T,>(k: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => {
  if (typeof window !== "undefined") localStorage.setItem(k, JSON.stringify(v));
};

const uid = () => Math.random().toString(36).slice(2, 10);
const fakeHash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h).toString(16).padStart(8, "0");
};
const MOCK_IP = "10.0.0.42";
const daysBetween = (a: number, b: number) => (a - b) / 86400000;

// ---- Active role (UC-RBAC simulation) ----
export const getActiveRole = (): AppRole =>
  read<AppRole>(KEYS.role, "Transition Lead");
export const setActiveRole = (r: AppRole) => {
  write(KEYS.role, r);
  log("ROLE_SWITCH", `Active role set to ${r}`);
};

export interface Permissions {
  manageIntake: boolean;
  uploadEvidence: boolean;
  viewEvidence: boolean;
  evaluate: boolean;
  viewAudit: boolean;
  manageRetention: boolean;
  purge: boolean;
}
export function permissionsFor(role: AppRole): Permissions {
  switch (role) {
    case "Transition Lead":
      return {
        manageIntake: true,
        uploadEvidence: true,
        viewEvidence: true,
        evaluate: true,
        viewAudit: false,
        manageRetention: false,
        purge: false,
      };
    case "Privacy Officer":
      return {
        manageIntake: false,
        uploadEvidence: false,
        viewEvidence: true,
        evaluate: false,
        viewAudit: true,
        manageRetention: true,
        purge: true,
      };
    case "Legal Representative":
      return {
        manageIntake: false,
        uploadEvidence: true,
        viewEvidence: false,
        evaluate: false,
        viewAudit: false,
        manageRetention: false,
        purge: false,
      };
  }
}

export class AccessDeniedError extends Error {
  constructor() {
    super("Access denied: insufficient permissions");
  }
}
function require(perm: keyof Permissions) {
  const role = getActiveRole();
  if (!permissionsFor(role)[perm]) {
    log("ACCESS_DENIED", `Blocked action '${perm}' for role ${role}`);
    throw new AccessDeniedError();
  }
}

// ---- Session ----
export const getSession = (): Session => {
  const s = read<Session | null>(KEYS.session, null);
  if (s) return s;
  const now = new Date().toISOString();
  const fresh: Session = {
    id: uid(),
    createdAt: now,
    lastActivityDate: now,
    locked: false,
    status: "Open",
  };
  write(KEYS.session, fresh);
  return fresh;
};
const updateSession = (patch: Partial<Session>) => {
  const cur = getSession();
  const next = { ...cur, ...patch };
  write(KEYS.session, next);
  return next;
};
export const touchSession = () => {
  if (getSession().locked) return;
  updateSession({ lastActivityDate: new Date().toISOString() });
};
export function sessionInactivityDays(): number {
  return daysBetween(Date.now(), new Date(getSession().lastActivityDate).getTime());
}
export function shouldShowRetentionWarning(): boolean {
  const d = sessionInactivityDays();
  return d >= RETENTION_WARN_DAYS && d < RETENTION_PURGE_DAYS;
}
export function daysUntilPurge(): number {
  return Math.max(0, Math.ceil(RETENTION_PURGE_DAYS - sessionInactivityDays()));
}

export function resetSession() {
  const now = new Date().toISOString();
  write(KEYS.session, {
    id: uid(),
    createdAt: now,
    lastActivityDate: now,
    locked: false,
    status: "Open",
  } satisfies Session);
}

// ---- GDPR validation ----
const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "protonmail.com",
  "aol.com",
  "live.com",
  "msn.com",
];
const PHONE_REGEX = /\d{9,}/;

export function validateEmail(raw: string): { ok: boolean; error?: string } {
  const email = raw.trim().toLowerCase();
  if (!email) return { ok: false, error: "Email is required" };
  if (PHONE_REGEX.test(email))
    return { ok: false, error: "GDPR Violation: Personal phone numbers are prohibited" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "Invalid email format" };
  const domain = email.split("@")[1];
  if (FREE_EMAIL_DOMAINS.includes(domain))
    return { ok: false, error: "Corporate email required (no public providers)" };
  return { ok: true };
}

// ---- Stakeholders ----
export const getStakeholders = (): Stakeholder[] => {
  enforceRetention();
  return read<Stakeholder[]>(KEYS.stakeholders, []);
};

export function addStakeholder(email: string, role: StakeholderRole): Stakeholder {
  require("manageIntake");
  if (getSession().locked) throw new Error("Session is locked — evaluation in progress");
  const list = read<Stakeholder[]>(KEYS.stakeholders, []);
  const now = new Date().toISOString();
  const s: Stakeholder = {
    id: uid(),
    email: enc(email.trim().toLowerCase()),
    role,
    approved: false,
    createdAt: now,
    lastActivity: now,
  };
  list.push(s);
  write(KEYS.stakeholders, list);
  touchSession();
  log("STAKEHOLDER_CREATED", `Role=${role}`);
  return s;
}

export function approveStakeholder(id: string) {
  require("manageIntake");
  const list = read<Stakeholder[]>(KEYS.stakeholders, []);
  const next = list.map((s) => (s.id === id ? { ...s, approved: true } : s));
  write(KEYS.stakeholders, next);
  touchSession();
  log("STAKEHOLDER_APPROVED", `id=${id}`);
}

export function deleteStakeholder(id: string) {
  require("manageIntake");
  if (getSession().locked) throw new Error("Session is locked");
  const list = read<Stakeholder[]>(KEYS.stakeholders, []).filter((s) => s.id !== id);
  write(KEYS.stakeholders, list);
  touchSession();
  log("STAKEHOLDER_DELETED", `id=${id}`);
}

// ---- Evidence ----
export const getEvidence = (): Evidence[] => read<Evidence[]>(KEYS.evidence, []);

export interface EvidenceInput {
  name: string;
  type: EvidenceType;
  issuedDate: string;
}
export function validateEvidence(input: EvidenceInput): { ok: boolean; error?: string } {
  if (!input.name?.trim()) return { ok: false, error: "Document name is required" };
  if (!input.type) return { ok: false, error: "Type is required" };
  if (!input.issuedDate) return { ok: false, error: "Issued date is required" };
  const age = daysBetween(Date.now(), new Date(input.issuedDate).getTime());
  if (age > EVIDENCE_FRESHNESS_DAYS)
    return { ok: false, error: "Evidence is older than 30 days and is invalid" };
  return { ok: true };
}

export function addEvidence(input: EvidenceInput): Evidence {
  require("uploadEvidence");
  if (getSession().locked) throw new Error("Session is locked");
  const v = validateEvidence(input);
  if (!v.ok) throw new Error(v.error);
  const list = getEvidence();
  const e: Evidence = {
    id: uid(),
    name: input.name.trim(),
    type: input.type,
    issuedDate: new Date(input.issuedDate).toISOString(),
    uploadDate: new Date().toISOString(),
    uploadedBy: getActiveRole(),
  };
  list.push(e);
  write(KEYS.evidence, list);
  touchSession();
  log("EVIDENCE_UPLOADED", `type=${e.type}`);
  return e;
}

export function deleteEvidence(id: string) {
  require("uploadEvidence");
  if (getSession().locked) throw new Error("Session is locked");
  const list = getEvidence().filter((e) => e.id !== id);
  write(KEYS.evidence, list);
  touchSession();
  log("EVIDENCE_DELETED", `id=${id}`);
}

// UC-05 secure access — RBAC + audit
export function viewEvidence(id: string): Evidence {
  require("viewEvidence");
  const e = getEvidence().find((x) => x.id === id);
  if (!e) throw new Error("Evidence not found");
  log("EVIDENCE_VIEW", `id=${id} type=${e.type}`);
  return e;
}
export function downloadEvidence(id: string): Evidence {
  require("viewEvidence");
  const e = getEvidence().find((x) => x.id === id);
  if (!e) throw new Error("Evidence not found");
  log("EVIDENCE_DOWNLOAD", `id=${id} type=${e.type}`);
  return e;
}

export const isEvidenceFresh = (e: Evidence) =>
  daysBetween(Date.now(), new Date(e.issuedDate).getTime()) <= EVIDENCE_FRESHNESS_DAYS;

// ---- Retention / Purge (UC-06) ----
export const getRetention = (): RetentionConfig =>
  read<RetentionConfig>(KEYS.retention, { days: RETENTION_PURGE_DAYS });

export function setRetention(days: number) {
  require("manageRetention");
  write(KEYS.retention, { days });
  log("RETENTION_UPDATED", `days=${days}`);
}

// Anonymize and hard-delete expired session data
export function purgeExpired(force = false): { purged: boolean; reason?: string } {
  const inactivity = sessionInactivityDays();
  if (!force && inactivity < RETENTION_PURGE_DAYS) {
    return { purged: false, reason: `Session active ${inactivity.toFixed(1)}d / ${RETENTION_PURGE_DAYS}d` };
  }
  // Anonymize stakeholder emails before delete
  const list = read<Stakeholder[]>(KEYS.stakeholders, []);
  for (const s of list) {
    const hashed = fakeHash(dec(s.email));
    log("STAKEHOLDER_ANONYMIZED", `hash=${hashed}`);
  }
  // Hard delete
  write(KEYS.stakeholders, []);
  write(KEYS.evidence, []);
  log("SESSION_PURGED", "All intake data purged (no personal data stored)");
  resetSession();
  return { purged: true };
}

// Cron simulation invoked on load
function enforceRetention() {
  if (typeof window === "undefined") return;
  if (sessionInactivityDays() >= RETENTION_PURGE_DAYS) {
    log("CRON_TRIGGER", "Auto-purge due to inactivity >= 30d");
    purgeExpired(true);
  }
}

// ---- Evaluation (UC-03) ----
export interface EvaluationResult {
  status: "Ready to Proceed" | "Need More Data";
  missing: string[];
  invalid: string[];
  authorization: string[];
  timestamp: string;
  transitionLead: string;
}

export function evaluateIntake(): EvaluationResult {
  require("evaluate");
  // Lock the session
  updateSession({ locked: true });

  const stakeholders = read<Stakeholder[]>(KEYS.stakeholders, []);
  const evidence = getEvidence();
  const missing: string[] = [];
  const invalid: string[] = [];
  const authorization: string[] = [];

  if (stakeholders.length === 0) missing.push("Stakeholders");
  const drDocs = evidence.filter((e) => e.type === "DR Test");
  if (drDocs.length === 0) missing.push("DR Test evidence");
  const authDocs = evidence.filter((e) => e.type === "Authorization");
  if (authDocs.length === 0) missing.push("Authorization evidence");

  for (const e of evidence) {
    if (!isEvidenceFresh(e)) {
      const label = e.type === "DR Test" ? "DR Test outdated" : `${e.name} outdated (>30d)`;
      invalid.push(label);
    }
  }

  // Authority verification
  const approvedAuthorized = stakeholders.filter(
    (s) => s.approved && AUTHORIZED_ROLES.includes(s.role),
  );
  if (stakeholders.length > 0 && approvedAuthorized.length === 0) {
    authorization.push("No approved stakeholder with authorized role (Transition Lead / Privacy Officer)");
  }
  for (const s of stakeholders) {
    if (!s.approved) authorization.push(`Stakeholder ${s.role} pending authority approval`);
  }

  const ok =
    missing.length === 0 && invalid.length === 0 && authorization.length === 0;
  const status: EvaluationResult["status"] = ok ? "Ready to Proceed" : "Need More Data";
  updateSession({ status, locked: ok ? true : false }); // unlock if more data needed

  const lead =
    stakeholders.find((s) => s.role === "Transition Lead" && s.approved) ??
    stakeholders.find((s) => s.role === "Transition Lead");
  const leadId = lead ? `TL-${lead.id}` : "TL-UNASSIGNED";

  const result: EvaluationResult = {
    status,
    missing,
    invalid,
    authorization,
    timestamp: new Date().toISOString(),
    transitionLead: leadId,
  };

  log("EVALUATION_RUN", `status=${status}`);
  if (!ok) log("VALIDATION_FAILED", `missing=${missing.length} invalid=${invalid.length} auth=${authorization.length}`);
  return result;
}

export function unlockSession() {
  require("manageIntake");
  updateSession({ locked: false, status: "Open" });
  log("SESSION_UNLOCKED", "Session reopened for edits");
}

// ---- Audit ----
export const getAudit = (): AuditEntry[] => read<AuditEntry[]>(KEYS.audit, []);

export function log(action: string, detail: string) {
  const list = read<AuditEntry[]>(KEYS.audit, []);
  const role = typeof window === "undefined" ? "System" : getActiveRole();
  const userId = `${role.replace(/\s+/g, "")}-001`;
  const timestamp = new Date().toISOString();
  const prev = list[list.length - 1]?.hash ?? "GENESIS";
  const entry: AuditEntry = {
    id: uid(),
    userId,
    userRole: role,
    action,
    detail,
    timestamp,
    ip: MOCK_IP,
    prevHash: prev,
    hash: fakeHash(prev + userId + action + detail + timestamp),
  };
  list.push(entry);
  write(KEYS.audit, list);
}