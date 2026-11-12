import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { adminApiRequest } from "../../services/adminApi";

const APPLICATIONS_PATH = "/api/v1/admin/driver-applications";
const POLICIES_PATH = "/api/v1/admin/driver-application-policies";
const APPLICATION_STATES = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "ACTION_REQUIRED",
  "APPROVED",
  "REJECTED",
  "ONBOARDING",
  "ACTIVE",
  "WITHDRAWN",
];
const ACTIONS_BY_STATE = {
  SUBMITTED: [{ key: "start-review", label: "Start review", tone: "primary" }],
  UNDER_REVIEW: [
    { key: "request-action", label: "Request correction", tone: "neutral" },
    { key: "approve", label: "Approve application", tone: "success" },
    { key: "reject", label: "Reject application", tone: "danger" },
  ],
  APPROVED: [{ key: "begin-onboarding", label: "Begin onboarding", tone: "primary" }],
  ONBOARDING: [{ key: "complete-onboarding", label: "Complete onboarding", tone: "success" }],
};
const ACTION_PATHS = {
  "start-review": "start-review",
  "request-action": "request-action",
  approve: "approve",
  reject: "reject",
  "begin-onboarding": "begin-onboarding",
  "complete-onboarding": "complete-onboarding",
};

function unwrap(result) {
  return result?.data;
}

function listFrom(result, keys) {
  const data = unwrap(result);
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

function stateClass(state) {
  const palette = {
    ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    SUBMITTED: "bg-sky-50 text-sky-700 ring-sky-200",
    UNDER_REVIEW: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    ACTION_REQUIRED: "bg-amber-50 text-amber-800 ring-amber-200",
    ONBOARDING: "bg-violet-50 text-violet-700 ring-violet-200",
    REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
    WITHDRAWN: "bg-slate-100 text-slate-600 ring-slate-200",
    DRAFT: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return palette[state] || "bg-slate-100 text-slate-600 ring-slate-200";
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function formatBytes(size) {
  if (!Number.isFinite(size)) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function describeError(error) {
  if (error.code === "SESSION_EXPIRED") return `${error.message} Sign in again to continue.`;
  if (error.status === 409 || error.status === 412) {
    return `${error.message} Reload the application and retry if appropriate.`;
  }
  return error.message || "The request could not be completed.";
}

function StatusBadge({ value }) {
  const label = String(value || "UNKNOWN").replaceAll("_", " ");
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${stateClass(value)}`}>
      {label}
    </span>
  );
}

function Notice({ tone = "error", children, onDismiss }) {
  const style = tone === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-rose-200 bg-rose-50 text-rose-800";
  return (
    <div role="alert" className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${style}`}>
      {tone === "success" ? <CheckCircle2 size={17} className="mt-0.5 shrink-0" /> : <AlertCircle size={17} className="mt-0.5 shrink-0" />}
      <div className="min-w-0 flex-1">{children}</div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss message">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

function ActionDialog({ dialog, onClose, onSubmit, busy }) {
  const [reason, setReason] = useState("");
  const [decision, setDecision] = useState(dialog?.decision || "ACCEPTED");
  const [error, setError] = useState("");

  useEffect(() => {
    setReason("");
    setDecision(dialog?.decision || "ACCEPTED");
    setError("");
  }, [dialog]);

  if (!dialog) return null;

  async function submit(event) {
    event.preventDefault();
    if (reason.trim().length < 8) {
      setError("Enter an auditable reason of at least 8 characters.");
      return;
    }
    await onSubmit({ reason: reason.trim(), decision });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !busy) onClose();
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="recruitment-dialog-title" className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="recruitment-dialog-title" className="text-lg font-black text-slate-900">{dialog.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{dialog.description}</p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        {dialog.type === "document" && (
          <label className="mt-4 grid gap-1.5 text-sm font-semibold text-slate-700">
            Document decision
            <select value={decision} onChange={(event) => setDecision(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
              <option value="ACCEPTED">Accept document</option>
              <option value="REJECTED">Reject document</option>
            </select>
          </label>
        )}
        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Audit reason <span className="font-normal text-slate-500">Required, 8–500 characters</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              minLength={8}
              maxLength={500}
              required
              rows={4}
              autoFocus
              placeholder="Explain the reason for this decision or action."
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} disabled={busy} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
              {busy && <LoaderCircle size={15} className="animate-spin" />}
              Confirm action
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ApplicationDetail({ detail, loading, onAction, onReview, onDownload, busyKey }) {
  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
        <LoaderCircle size={18} className="mr-2 animate-spin" /> Loading application details…
      </div>
    );
  }
  if (!detail) {
    return <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">Select an application to review its documents and history.</div>;
  }

  const application = detail.application || detail;
  const documents = detail.documents || [];
  const history = detail.history || [];
  const actions = ACTIONS_BY_STATE[application.state] || [];

  return (
    <div className="space-y-5">
      <section>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">{application.legal_name || "Driver application"}</h2>
              <StatusBadge value={application.state} />
            </div>
            <p className="mt-1 break-all font-mono text-[11px] text-slate-500">{application.id}</p>
          </div>
          {application.version !== undefined && (
            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">Version {application.version}</span>
          )}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Info label="Driver ID" value={application.driver_id} />
          <Info label="Contact" value={application.contact_phone} />
          <Info label="Submitted" value={formatDate(application.submitted_at)} />
          <Info label="Policy version" value={application.policy_version ?? "—"} />
        </div>
      </section>

      {actions.length > 0 && (
        <section className="rounded-xl border border-slate-200 p-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Application actions</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((action) => {
              const style = action.tone === "danger"
                ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                : action.tone === "success"
                  ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  : action.tone === "primary"
                    ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50";
              return (
                <button key={action.key} type="button" disabled={Boolean(busyKey)} onClick={() => onAction(application, action)} className={`rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-60 ${style}`}>
                  {action.label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900">Private documents <span className="font-normal text-slate-500">({documents.length})</span></h3>
          <span className="text-[11px] text-slate-500">Downloads are access-controlled and audited by the server.</span>
        </div>
        {documents.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">No documents have been submitted.</p>
        ) : (
          <div className="space-y-2">
            {documents.map((document) => {
              return (
                <article key={document.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <FileText size={17} className="mt-0.5 shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <div className="break-all text-sm font-bold text-slate-800">{document.original_filename || document.document_type}</div>
                        <div className="mt-1 text-xs text-slate-500">{document.document_type} · {formatBytes(document.size_bytes)}</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <MiniBadge label={`Review: ${document.review_status || "PENDING"}`} />
                          <MiniBadge label={`Scan: ${document.scan_status || "UNKNOWN"}`} />
                          {document.expires_on && <MiniBadge label={`Expires ${document.expires_on}`} />}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button type="button" disabled={Boolean(busyKey)} onClick={() => onDownload(application.id, document)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                        {busyKey === `download:${document.id}` ? <LoaderCircle size={14} className="animate-spin" /> : <ArrowDownToLine size={14} />}
                        Download
                      </button>
                      {!["ACCEPTED", "REJECTED"].includes(String(document.review_status).toUpperCase()) && (
                        <button type="button" disabled={Boolean(busyKey)} onClick={() => onReview(application, document)} className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 px-2.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50">
                          <FileCheck2 size={14} /> Review
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-900">Audit history</h3>
        {history.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">No history entries are available.</p>
        ) : (
          <ol className="space-y-2">
            {history.map((entry, index) => (
              <li key={entry.id || `${entry.created_at || entry.at || "event"}-${index}`} className="flex gap-2.5 rounded-lg bg-slate-50 p-3">
                <Clock3 size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <div className="min-w-0 text-xs">
                  <div className="font-bold text-slate-800">
                    {entry.from_state && entry.to_state
                      ? `${entry.from_state.replaceAll("_", " ")} → ${entry.to_state.replaceAll("_", " ")}`
                      : entry.action || entry.event || entry.type || "Application event"}
                  </div>
                  {entry.reason && <p className="mt-1 text-slate-600">{entry.reason}</p>}
                  <p className="mt-1 text-slate-400">{formatDate(entry.created_at || entry.at || entry.occurred_at)}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-50 px-3 py-2.5">
      <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 break-all text-sm font-semibold text-slate-700">{value || "—"}</div>
    </div>
  );
}

function MiniBadge({ label }) {
  return <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{label}</span>;
}

function PolicyPanel({ policies, loading, onRefresh, onCreate, onActivate, busyKey }) {
  const [creating, setCreating] = useState(false);
  const [documentTypes, setDocumentTypes] = useState("");
  const [reason, setReason] = useState("");
  const [legalRef, setLegalRef] = useState("");
  const [scanRequired, setScanRequired] = useState(true);
  const [formError, setFormError] = useState("");

  async function submit(event) {
    event.preventDefault();
    const requiredTypes = [...new Set(documentTypes.split(",").map((type) => type.trim()).filter(Boolean))];
    if (requiredTypes.length < 1 || requiredTypes.length > 12) {
      setFormError("Add between 1 and 12 document types, separated by commas.");
      return;
    }
    if (reason.trim().length < 8 || legalRef.trim().length < 8) {
      setFormError("The audit reason and legal decision reference must each be at least 8 characters.");
      return;
    }
    const created = await onCreate({
      reason: reason.trim(),
      required_document_types: requiredTypes,
      scan_required: scanRequired,
      legal_decision_ref: legalRef.trim(),
    });
    if (created) {
      setCreating(false);
      setDocumentTypes("");
      setReason("");
      setLegalRef("");
      setScanRequired(true);
      setFormError("");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-base font-black text-slate-900">Recruitment policies</h2>
          <p className="mt-1 text-xs text-slate-500">Document requirements and scan policy. Policy changes require an audit reason and legal reference.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onRefresh} disabled={loading} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50" aria-label="Refresh policies">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <button type="button" onClick={() => setCreating((value) => !value)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">
            {creating ? <X size={14} /> : <Plus size={14} />}
            {creating ? "Cancel" : "New policy"}
          </button>
        </div>
      </div>

      {creating && (
        <form onSubmit={submit} className="grid gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 sm:p-5">
          <label className="grid gap-1 text-xs font-bold text-slate-700 sm:col-span-2">
            Required document types <span className="font-normal text-slate-500">Comma-separated, 1–12 values</span>
            <input value={documentTypes} onChange={(event) => setDocumentTypes(event.target.value)} required placeholder="e.g. identity, driving_licence, address_proof" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal" />
          </label>
          <label className="grid gap-1 text-xs font-bold text-slate-700">
            Legal decision reference
            <input value={legalRef} onChange={(event) => setLegalRef(event.target.value)} required minLength={8} maxLength={200} placeholder="Approved policy/legal reference" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal" />
          </label>
          <label className="grid gap-1 text-xs font-bold text-slate-700">
            Audit reason
            <input value={reason} onChange={(event) => setReason(event.target.value)} required minLength={8} maxLength={500} placeholder="Why is this policy being created?" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal" />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 sm:col-span-2">
            <input type="checkbox" checked={scanRequired} onChange={(event) => setScanRequired(event.target.checked)} className="h-4 w-4 accent-emerald-600" />
            Require document scan before review
          </label>
          {formError && <p role="alert" className="text-sm text-rose-700 sm:col-span-2">{formError}</p>}
          <div className="sm:col-span-2">
            <button type="submit" disabled={Boolean(busyKey)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
              {busyKey === "create-policy" && <LoaderCircle size={15} className="animate-spin" />}
              Create policy
            </button>
          </div>
        </form>
      )}

      {loading && policies.length === 0 ? (
        <div className="flex justify-center p-8 text-slate-500"><LoaderCircle size={18} className="animate-spin" /></div>
      ) : policies.length === 0 ? (
        <p className="p-6 text-sm text-slate-500">No recruitment policies found.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {policies.map((policy, index) => (
            <article key={policy.id || policy.version || index} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">{policy.id || `Policy version ${policy.version ?? "—"}`}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${policy.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {policy.active ? "Active" : "Inactive"}
                  </span>
                  {policy.configured === false && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">Not configured</span>}
                </div>
                <p className="mt-1 text-xs text-slate-500">Version {policy.version ?? "—"} · {policy.scan_required ? "Scan required" : "Scan optional"}</p>
                <p className="mt-1 break-all text-xs text-slate-600">Documents: {(policy.required_document_types || []).join(", ") || "—"}</p>
                {policy.legal_decision_ref && <p className="mt-1 break-all text-[11px] text-slate-400">Legal reference: {policy.legal_decision_ref}</p>}
              </div>
              {policy.id && !policy.active && (
                <button type="button" disabled={Boolean(busyKey)} onClick={() => onActivate(policy)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50">
                  {busyKey === `activate:${policy.id}` ? <LoaderCircle size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                  Activate
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Recruitment() {
  const [tab, setTab] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [stateFilter, setStateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [busyKey, setBusyKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dialog, setDialog] = useState(null);
  const nextCursorRef = useRef(null);
  const selectedIdRef = useRef("");

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const loadApplications = useCallback(async ({ append = false, state = stateFilter } = {}) => {
    setListLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ limit: "50" });
      if (state) query.set("state", state);
      if (append && nextCursorRef.current) query.set("before", nextCursorRef.current);
      const response = unwrap(await adminApiRequest(`${APPLICATIONS_PATH}?${query.toString()}`));
      const items = Array.isArray(response) ? response : response?.items || response?.applications || [];
      setApplications((previous) => append ? [...previous, ...items] : items);
      const cursor = response?.next_cursor || null;
      nextCursorRef.current = cursor;
      setNextCursor(cursor);
      if (!append && selectedIdRef.current && !items.some((item) => item.id === selectedIdRef.current)) {
        setSelectedId("");
        setDetail(null);
      } else if (!append && !selectedIdRef.current && items[0]?.id) {
        setSelectedId(items[0].id);
      }
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setListLoading(false);
    }
  }, [stateFilter]);

  const loadPolicies = useCallback(async () => {
    setPoliciesLoading(true);
    try {
      const response = await adminApiRequest(POLICIES_PATH);
      setPolicies(listFrom(response, ["policies"]));
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setPoliciesLoading(false);
    }
  }, []);

  const loadDetail = useCallback(async (applicationId) => {
    if (!applicationId) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    try {
      const response = unwrap(await adminApiRequest(`${APPLICATIONS_PATH}/${encodeURIComponent(applicationId)}`));
      setDetail(response);
    } catch (requestError) {
      setError(describeError(requestError));
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications({ append: false });
  }, [loadApplications]);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
  }, [loadDetail, selectedId]);

  const filteredApplications = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return applications;
    return applications.filter((application) =>
      [application.legal_name, application.contact_phone, application.driver_id, application.id]
        .some((value) => String(value || "").toLowerCase().includes(normalized)),
    );
  }, [applications, search]);

  function showActionDialog(application, action) {
    const labels = {
      "start-review": ["Start application review", "This records the start of the auditable review process."],
      "request-action": ["Request applicant correction", "The applicant will need to provide the requested correction."],
      approve: ["Approve application", "Approval is a recruitment decision and does not authorize duty."],
      reject: ["Reject application", "This decision will be recorded in the application audit history."],
      "begin-onboarding": ["Begin onboarding", "Start the onboarding workflow for this approved applicant."],
      "complete-onboarding": ["Complete onboarding", "Completing onboarding does not grant duty authorization."],
    };
    const [title, description] = labels[action.key];
    setDialog({ type: "application", action: action.key, application, title, description });
  }

  function showDocumentDialog(application, document) {
    setDialog({
      type: "document",
      application,
      document,
      title: "Review private document",
      description: `${document.document_type || "Document"} · ${document.original_filename || document.id}`,
    });
  }

  async function performDialogAction({ reason, decision }) {
    if (!dialog) return;
    const activeDialog = dialog;
    const { application } = activeDialog;
    const key = activeDialog.type === "document"
      ? `review:${activeDialog.document.id}`
      : `action:${activeDialog.action}`;
    setBusyKey(key);
    setError("");
    setSuccess("");
    try {
      if (activeDialog.type === "document") {
        const { document } = activeDialog;
        await adminApiRequest(
          `${APPLICATIONS_PATH}/${encodeURIComponent(application.id)}/documents/${encodeURIComponent(document.id)}/review`,
          { method: "POST", body: { reason, decision } },
        );
        setSuccess(`Document marked ${decision.toLowerCase()}.`);
      } else {
        const endpoint = ACTION_PATHS[activeDialog.action];
        await adminApiRequest(`${APPLICATIONS_PATH}/${encodeURIComponent(application.id)}/${endpoint}`, {
          method: "POST",
          body: { reason },
        });
        setSuccess(`${activeDialog.title} completed.`);
      }
      setDialog(null);
      await Promise.all([loadDetail(application.id), loadApplications({ append: false })]);
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setBusyKey("");
    }
  }

  async function downloadDocument(applicationId, document) {
    const key = `download:${document.id}`;
    setBusyKey(key);
    setError("");
    try {
      const { data, headers } = await adminApiRequest(
        `${APPLICATIONS_PATH}/${encodeURIComponent(applicationId)}/documents/${encodeURIComponent(document.id)}/download`,
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(data);
      const link = window.document.createElement("a");
      const filename = headers.get("content-disposition")?.match(/filename="?([^";]+)"?/i)?.[1]
        || document.original_filename
        || `${document.document_type || "driver-document"}`;
      link.href = url;
      link.download = filename;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setBusyKey("");
    }
  }

  async function createPolicy(payload) {
    setBusyKey("create-policy");
    setError("");
    setSuccess("");
    try {
      await adminApiRequest(POLICIES_PATH, { method: "POST", body: payload });
      setSuccess("Recruitment policy created.");
      await loadPolicies();
      return true;
    } catch (requestError) {
      setError(describeError(requestError));
      return false;
    } finally {
      setBusyKey("");
    }
  }

  async function activatePolicy(policy) {
    setDialog({
      type: "activate-policy",
      policy,
      title: "Activate recruitment policy",
      description: `Activate policy version ${policy.version ?? "—"} for new driver applications.`,
    });
  }

  async function performPolicyActivation({ reason }) {
    if (!dialog?.policy?.id) return;
    const policy = dialog.policy;
    setBusyKey(`activate:${policy.id}`);
    setError("");
    setSuccess("");
    try {
      await adminApiRequest(`${POLICIES_PATH}/${encodeURIComponent(policy.id)}/activate`, {
        method: "POST",
        body: { reason },
      });
      setDialog(null);
      setSuccess("Recruitment policy activated.");
      await loadPolicies();
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setBusyKey("");
    }
  }

  const currentDialogSubmit = dialog?.type === "activate-policy"
    ? performPolicyActivation
    : performDialogAction;

  return (
    <main className="mx-auto max-w-[1500px] space-y-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <UserRound size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Driver recruitment</h1>
              <p className="mt-0.5 text-sm text-slate-500">Private document review and auditable onboarding workflows.</p>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-xs text-amber-800">
            Recruitment approval and onboarding do not grant driver duty authorization. All decisions are checked and recorded by the server.
          </p>
        </div>
        <button
          type="button"
          onClick={() => Promise.all([loadApplications({ append: false }), loadPolicies()])}
          disabled={listLoading || policiesLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={15} className={listLoading || policiesLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {error && <Notice onDismiss={() => setError("")}>{error}</Notice>}
      {success && <Notice tone="success" onDismiss={() => setSuccess("")}>{success}</Notice>}

      <div className="flex gap-1 border-b border-slate-200">
        <button type="button" onClick={() => setTab("applications")} className={`border-b-2 px-4 py-2.5 text-sm font-bold ${tab === "applications" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
          Applications
        </button>
        <button type="button" onClick={() => setTab("policies")} className={`border-b-2 px-4 py-2.5 text-sm font-bold ${tab === "policies" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
          Policies
        </button>
      </div>

      {tab === "applications" ? (
        <section className="grid min-h-[32rem] gap-4 xl:grid-cols-[minmax(340px,0.9fr)_minmax(480px,1.4fr)]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="space-y-3 border-b border-slate-100 p-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Applications</h2>
                <p className="mt-1 text-xs text-slate-500">{applications.length} loaded · maximum 50 per page</p>
              </div>
              <label className="relative block">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone or ID" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-400" />
              </label>
              <select
                value={stateFilter}
                onChange={(event) => {
                  setStateFilter(event.target.value);
                  nextCursorRef.current = null;
                  setNextCursor(null);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              >
                <option value="">All application states</option>
                {APPLICATION_STATES.map((state) => <option key={state} value={state}>{state.replaceAll("_", " ")}</option>)}
              </select>
            </div>
            <div className="max-h-[42rem] overflow-y-auto">
              {listLoading && applications.length === 0 ? (
                <div className="flex justify-center p-10 text-slate-500"><LoaderCircle size={18} className="animate-spin" /></div>
              ) : filteredApplications.length === 0 ? (
                <div className="p-8 text-center">
                  <UserRound size={26} className="mx-auto text-slate-300" />
                  <p className="mt-2 text-sm font-semibold text-slate-700">No applications found</p>
                  <p className="mt-1 text-xs text-slate-500">Try another status filter or refresh the list.</p>
                </div>
              ) : filteredApplications.map((application) => (
                <button
                  type="button"
                  key={application.id}
                  onClick={() => setSelectedId(application.id)}
                  className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${selectedId === application.id ? "bg-emerald-50/60 ring-1 ring-inset ring-emerald-200" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-slate-900">{application.legal_name || "Driver application"}</div>
                      <div className="mt-1 text-xs text-slate-500">{application.contact_phone || "No phone"} · {formatDate(application.submitted_at || application.created_at)}</div>
                    </div>
                    <StatusBadge value={application.state} />
                  </div>
                  <div className="mt-2 truncate font-mono text-[10px] text-slate-400">{application.id}</div>
                </button>
              ))}
            </div>
            {nextCursor && (
              <div className="border-t border-slate-100 p-3">
                <button type="button" onClick={() => loadApplications({ append: true })} disabled={listLoading} className="w-full rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  {listLoading ? "Loading…" : "Load older applications"}
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                {selectedId && <button type="button" onClick={() => setSelectedId("")} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 xl:hidden" aria-label="Back to applications"><ArrowLeft size={17} /></button>}
                <h2 className="text-sm font-bold text-slate-800">Review workspace</h2>
              </div>
              {selectedId && <button type="button" onClick={() => loadDetail(selectedId)} disabled={detailLoading} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50" aria-label="Refresh application details"><RefreshCw size={15} className={detailLoading ? "animate-spin" : ""} /></button>}
            </div>
            <ApplicationDetail
              detail={detail}
              loading={detailLoading}
              onAction={showActionDialog}
              onReview={showDocumentDialog}
              onDownload={downloadDocument}
              busyKey={busyKey}
            />
          </div>
        </section>
      ) : (
        <PolicyPanel
          policies={policies}
          loading={policiesLoading}
          onRefresh={loadPolicies}
          onCreate={createPolicy}
          onActivate={activatePolicy}
          busyKey={busyKey}
        />
      )}

      <ActionDialog
        dialog={dialog}
        onClose={() => !busyKey && setDialog(null)}
        onSubmit={currentDialogSubmit}
        busy={Boolean(busyKey)}
      />
    </main>
  );
}
