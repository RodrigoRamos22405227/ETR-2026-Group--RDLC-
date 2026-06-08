import { describe, it, expect, beforeEach } from "vitest";
import {
  AccessDeniedError,
  addEvidence,
  addStakeholder,
  approveStakeholder,
  dec,
  deleteEvidence,
  deleteStakeholder,
  downloadEvidence,
  evaluateIntake,
  getAudit,
  getEvidence,
  getSession,
  getStakeholders,
  log,
  permissionsFor,
  purgeExpired,
  setActiveRole,
  setRetention,
  shouldShowRetentionWarning,
  validateEmail,
  validateEvidence,
  viewEvidence,
} from "@/lib/ams-store";

// Helpers -----------------------------------------------------------------
const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

function seedHappyPath() {
  setActiveRole("Transition Lead");
  const lead = addStakeholder("lead@hospital.com", "Transition Lead");
  approveStakeholder(lead.id);
  addEvidence({ name: "DR-Test-Q2.pdf", type: "DR Test", issuedDate: today() });
  addEvidence({ name: "Authz.pdf", type: "Authorization", issuedDate: today() });
}

// =========================================================================
// GDPR — email validation
// =========================================================================
describe("validateEmail (GDPR data minimization)", () => {
  it("accepts a corporate email", () => {
    expect(validateEmail("alice@hospital.com").ok).toBe(true);
  });

  it("rejects public/free email providers", () => {
    for (const d of ["gmail.com", "outlook.com", "yahoo.com", "icloud.com"]) {
      const r = validateEmail(`user@${d}`);
      expect(r.ok).toBe(false);
      expect(r.error).toMatch(/corporate/i);
    }
  });

  it("rejects emails containing phone-like digit sequences (>=9 digits)", () => {
    const r = validateEmail("contact912345678@hospital.com");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/phone/i);
  });

  it("rejects invalid format", () => {
    expect(validateEmail("not-an-email").ok).toBe(false);
    expect(validateEmail("").ok).toBe(false);
  });
});

// =========================================================================
// Stakeholders + RBAC
// =========================================================================
describe("Stakeholders & RBAC", () => {
  beforeEach(() => setActiveRole("Transition Lead"));

  it("Transition Lead can create, approve and delete a stakeholder", () => {
    const s = addStakeholder("po@hospital.com", "Privacy Officer");
    expect(getStakeholders()).toHaveLength(1);
    approveStakeholder(s.id);
    expect(getStakeholders()[0].approved).toBe(true);
    deleteStakeholder(s.id);
    expect(getStakeholders()).toHaveLength(0);
  });

  it("encrypts the stored email (base64) and dec() recovers it", () => {
    const s = addStakeholder("alice@hospital.com", "Transition Lead");
    expect(s.email).not.toBe("alice@hospital.com");
    expect(dec(s.email)).toBe("alice@hospital.com");
  });

  it("Privacy Officer cannot register a stakeholder (AccessDenied)", () => {
    setActiveRole("Privacy Officer");
    expect(() => addStakeholder("x@hospital.com", "Transition Lead")).toThrow(
      AccessDeniedError,
    );
  });

  it("Legal Representative cannot view evidence", () => {
    setActiveRole("Transition Lead");
    const e = addEvidence({
      name: "DR.pdf",
      type: "DR Test",
      issuedDate: today(),
    });
    setActiveRole("Legal Representative");
    expect(() => viewEvidence(e.id)).toThrow(AccessDeniedError);
  });

  it("permissionsFor returns the expected role matrix", () => {
    expect(permissionsFor("Transition Lead").manageIntake).toBe(true);
    expect(permissionsFor("Privacy Officer").viewAudit).toBe(true);
    expect(permissionsFor("Privacy Officer").manageIntake).toBe(false);
    expect(permissionsFor("Legal Representative").viewEvidence).toBe(false);
  });
});

// =========================================================================
// Evidence (UC-04 / UC-05)
// =========================================================================
describe("Evidence", () => {
  beforeEach(() => setActiveRole("Transition Lead"));

  it("validateEvidence rejects docs older than 30 days", () => {
    const r = validateEvidence({
      name: "old.pdf",
      type: "DR Test",
      issuedDate: daysAgo(45),
    });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/30 days/i);
  });

  it("validateEvidence requires name, type and date", () => {
    expect(
      validateEvidence({ name: "", type: "DR Test", issuedDate: today() }).ok,
    ).toBe(false);
    expect(
      validateEvidence({ name: "x", type: "DR Test", issuedDate: "" }).ok,
    ).toBe(false);
  });

  it("addEvidence records uploader role and timestamp", () => {
    const e = addEvidence({
      name: "DR.pdf",
      type: "DR Test",
      issuedDate: today(),
    });
    expect(e.uploadedBy).toBe("Transition Lead");
    expect(getEvidence()).toHaveLength(1);
  });

  it("viewEvidence and downloadEvidence write to the audit log", () => {
    const e = addEvidence({
      name: "DR.pdf",
      type: "DR Test",
      issuedDate: today(),
    });
    const before = getAudit().length;
    viewEvidence(e.id);
    downloadEvidence(e.id);
    const actions = getAudit()
      .slice(before)
      .map((a) => a.action);
    expect(actions).toContain("EVIDENCE_VIEW");
    expect(actions).toContain("EVIDENCE_DOWNLOAD");
  });

  it("blocks edits when the session is locked (happy-path evaluation)", () => {
    seedHappyPath();
    evaluateIntake(); // locks the session on success
    expect(() =>
      addEvidence({ name: "x", type: "Other", issuedDate: today() }),
    ).toThrow(/locked/i);
    expect(() => deleteEvidence("anything")).toThrow(/locked/i);
  });
});

// =========================================================================
// Evaluation (UC-03 / UC-07)
// =========================================================================
describe("evaluateIntake", () => {
  beforeEach(() => setActiveRole("Transition Lead"));

  it("returns Need More Data when DR Test / Authorization are missing", () => {
    const r = evaluateIntake();
    expect(r.status).toBe("Need More Data");
    expect(r.missing).toContain("Stakeholders");
    expect(r.missing).toContain("DR Test evidence");
    expect(r.missing).toContain("Authorization evidence");
  });

  it("flags authorization issues when no approved authorized stakeholder exists", () => {
    addStakeholder("legal@hospital.com", "Legal Representative");
    addEvidence({ name: "DR.pdf", type: "DR Test", issuedDate: today() });
    addEvidence({ name: "Authz.pdf", type: "Authorization", issuedDate: today() });
    const r = evaluateIntake();
    expect(r.status).toBe("Need More Data");
    expect(r.authorization.length).toBeGreaterThan(0);
  });

  it("returns Ready to Proceed on the happy path and locks the session", () => {
    seedHappyPath();
    const r = evaluateIntake();
    expect(r.status).toBe("Ready to Proceed");
    expect(r.missing).toEqual([]);
    expect(r.invalid).toEqual([]);
    expect(r.authorization).toEqual([]);
    expect(getSession().locked).toBe(true);
    expect(r.transitionLead).toMatch(/^TL-/);
  });

  it("non-evaluator roles are blocked from evaluating", () => {
    setActiveRole("Privacy Officer");
    expect(() => evaluateIntake()).toThrow(AccessDeniedError);
  });
});

// =========================================================================
// Retention / Purge (UC-06)
// =========================================================================
describe("Retention & Purge", () => {
  beforeEach(() => setActiveRole("Transition Lead"));

  it("purgeExpired(false) does NOT purge a fresh session", () => {
    seedHappyPath();
    setActiveRole("Privacy Officer");
    const r = purgeExpired(false);
    expect(r.purged).toBe(false);
    setActiveRole("Transition Lead");
    expect(getStakeholders().length).toBeGreaterThan(0);
  });

  it("purgeExpired(true) wipes stakeholders + evidence and logs SESSION_PURGED", () => {
    seedHappyPath();
    setActiveRole("Privacy Officer");
    const r = purgeExpired(true);
    expect(r.purged).toBe(true);
    expect(getStakeholders()).toEqual([]);
    expect(getEvidence()).toEqual([]);
    expect(getAudit().some((a) => a.action === "SESSION_PURGED")).toBe(true);
  });

  it("shouldShowRetentionWarning activates between 25 and 30 days of inactivity", () => {
    getSession();
    const raw = localStorage.getItem("ams.session")!;
    const s = JSON.parse(raw);
    s.lastActivityDate = new Date(Date.now() - 27 * 86400000).toISOString();
    localStorage.setItem("ams.session", JSON.stringify(s));
    expect(shouldShowRetentionWarning()).toBe(true);
  });

  it("setRetention requires Privacy Officer", () => {
    expect(() => setRetention(15)).toThrow(AccessDeniedError);
    setActiveRole("Privacy Officer");
    expect(() => setRetention(15)).not.toThrow();
  });
});

// =========================================================================
// Audit hash chain
// =========================================================================
describe("Audit hash chain", () => {
  it("first entry references GENESIS and each next entry chains the prev hash", () => {
    log("TEST_A", "first");
    log("TEST_B", "second");
    log("TEST_C", "third");
    const entries = getAudit();
    expect(entries.length).toBeGreaterThanOrEqual(3);
    expect(entries[0].prevHash).toBe("GENESIS");
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i].prevHash).toBe(entries[i - 1].hash);
    }
  });
});
