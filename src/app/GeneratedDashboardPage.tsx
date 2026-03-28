import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  ClipboardList,
  FileStack,
  FolderOpenDot,
  Landmark,
  WalletCards,
} from "lucide-react";
import { loadGeneratedVoyage } from "./generatedVoyage";
import {
  appendEvidenceVaultDocument,
  disputeReasonCatalog,
  evidenceTypeCatalog,
  getDisputeReasonLabel,
  loadEvidenceVaultDocuments,
  loadSettlementDraft,
  saveSettlementDraft,
  type DisputeReasonKey,
  type EvidenceDocumentType,
  type EvidenceUploaderRole,
  type EvidenceVaultDocument,
} from "./settlementStore";
import { AppShell, CTAButton, Surface } from "./ui";

export function GeneratedDashboardPage() {
  const voyage = typeof window !== "undefined" ? loadGeneratedVoyage() : null;
  const [documents, setDocuments] = useState<EvidenceVaultDocument[]>(() => loadEvidenceVaultDocuments());
  const [draft, setDraft] = useState(() => loadSettlementDraft());
  const [uploaderRole, setUploaderRole] = useState<EvidenceUploaderRole>("Owner");
  const [manualName, setManualName] = useState("");
  const [manualType, setManualType] = useState<EvidenceDocumentType>("Invoice");
  const [customReason, setCustomReason] = useState(draft.customReason);

  const routeLabel = voyage?.route || "Voyage #A102";
  const selectedReason = getDisputeReasonLabel(draft.reasonKey);

  const selectedDocuments = useMemo(
    () => documents.filter((item) => draft.evidenceIds.includes(item.id)),
    [documents, draft.evidenceIds],
  );

  function toggleEvidence(documentId: string) {
    const nextEvidenceIds = draft.evidenceIds.includes(documentId)
      ? draft.evidenceIds.filter((item) => item !== documentId)
      : [...draft.evidenceIds, documentId];

    const nextDraft = { ...draft, evidenceIds: nextEvidenceIds };
    setDraft(nextDraft);
    saveSettlementDraft(nextDraft);
  }

  function updateReason(reasonKey: DisputeReasonKey) {
    const nextDraft = { ...draft, reasonKey, customReason: reasonKey === "custom" ? customReason : "" };
    setDraft(nextDraft);
    saveSettlementDraft(nextDraft);
  }

  function handleCustomReason(value: string) {
    setCustomReason(value);
    const nextDraft = { ...draft, customReason: value };
    setDraft(nextDraft);
    saveSettlementDraft(nextDraft);
  }

  function handleDisputedAmount(value: string) {
    const numeric = Number(value.replace(/[^0-9.]/g, ""));
    const disputedAmount = Number.isFinite(numeric) ? numeric : 0;
    const nextDraft = {
      ...draft,
      disputedAmount: Math.min(disputedAmount, draft.totalAmount),
    };
    setDraft(nextDraft);
    saveSettlementDraft(nextDraft);
  }

  function handleManualEvidenceAdd() {
    const normalizedName = manualName.trim();
    if (!normalizedName) return;

    const document: EvidenceVaultDocument = {
      id: `manual-${Date.now()}`,
      name: normalizedName,
      type: manualType,
      uploaderRole,
      uploadedAt: formatNow(),
      source: "manual-upload",
    };

    const nextDocuments = [document, ...documents];
    setDocuments(nextDocuments);
    appendEvidenceVaultDocument(document);

    const nextDraft = {
      ...draft,
      evidenceIds: draft.evidenceIds.includes(document.id) ? draft.evidenceIds : [document.id, ...draft.evidenceIds],
    };
    setDraft(nextDraft);
    saveSettlementDraft(nextDraft);
    setManualName("");
  }

  return (
    <AppShell
      eyebrow="Generated Dashboard / Uretilen Dashboard"
      title="Operational evidence and settlement intake"
      description="Generated dashboard now feeds the settlement workflow. Evidence chosen here is re-used in Split & Neutralize, so the disputed portion is grounded in actual supporting references."
    >
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Surface>
          <PanelHeader
            icon={ClipboardList}
            eyebrow="Voyage context / Sefer baglami"
            title={routeLabel}
            description="Review the voyage context first, then prepare the dispute intake in a controlled way."
          />

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Owner / Armatör" value={voyage?.owner || "Northshore Bulk Pte. Ltd."} />
            <InfoCard label="Charterer / Kiraci" value={voyage?.charterer || "Bluewake Shipping"} />
            <InfoCard label="Cargo / Yuk" value={voyage?.cargo || "4,800 MT corn"} />
            <InfoCard label="Commercial risk / Ticari risk" value={voyage?.commercial_risk || "Port cost difference under review"} />
          </div>
        </Surface>

        <Surface>
          <PanelHeader
            icon={WalletCards}
            eyebrow="Settlement handoff / Settlement aktarimi"
            title="Prepared for Split & Neutralize"
            description="This panel controls what the settlement workflow will receive. Nothing is random; the dispute record is assembled here."
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoCard label="Total amount / Toplam tutar" value={formatMoney(draft.totalAmount, draft.currency)} />
            <InfoCard
              label="Undisputed / Tartismasiz"
              value={formatMoney(Math.max(draft.totalAmount - draft.disputedAmount, 0), draft.currency)}
            />
            <InfoCard label="Disputed / Tartismali" value={formatMoney(draft.disputedAmount, draft.currency)} />
            <InfoCard label="Reason / Neden" value={`${selectedReason.labelEn} / ${selectedReason.labelTr}`} />
          </div>

          <div className="mt-6">
            <CTAButton route="/app/settlement">Open settlement workflow</CTAButton>
          </div>
        </Surface>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="h-full">
          <PanelHeader
            icon={FileStack}
            eyebrow="Evidence Vault / Kanit kasasi"
            title="Manual upload and document linking"
            description="Files stay off-chain in this demo. The workflow stores document name, evidence type, uploader role, and timestamp so settlement can cite them consistently."
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#88c4ff]">
                Manual upload / Manuel yukleme
              </div>
              <div className="mt-4 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70">
                Accepted: PDF, JPG, PNG
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                  Uploader role / Yukleyen rol
                </div>
                <div className="mt-3 inline-flex flex-wrap gap-2 rounded-full border border-white/10 bg-white/[0.03] p-2">
                  {(["Owner", "Charterer", "Agent"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUploaderRole(role)}
                      className={[
                        "rounded-full px-4 py-2 text-sm transition",
                        uploaderRole === role
                          ? "bg-[#3373B7] text-white shadow-[0_8px_20px_rgba(51,115,183,0.35)]"
                          : "text-white/72 hover:bg-white/[0.05]",
                      ].join(" ")}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <label className="grid gap-2 text-sm text-white/75">
                  <span>Document name / Belge adi</span>
                  <input
                    value={manualName}
                    onChange={(event) => setManualName(event.target.value)}
                    placeholder="Port invoice breakdown.pdf"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-white/30"
                  />
                </label>

                <label className="grid gap-2 text-sm text-white/75">
                  <span>Evidence type / Kanit tipi</span>
                  <select
                    value={manualType}
                    onChange={(event) => setManualType(event.target.value as EvidenceDocumentType)}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
                  >
                    {evidenceTypeCatalog.map((item) => (
                      <option key={item.value} value={item.value} className="bg-[#07101b]">
                        {item.labelEn} / {item.labelTr}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={handleManualEvidenceAdd}
                  className="mt-2 inline-flex items-center justify-center rounded-2xl border border-[#4f97e8]/30 bg-[#3373B7]/12 px-4 py-3 text-sm font-semibold text-[#d7ebff] transition hover:bg-[#3373B7]/18"
                >
                  Add evidence record / Kanit kaydi ekle
                </button>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#88c4ff]">
                    Evidence references / Kanit referanslari
                  </div>
                  <div className="mt-2 text-sm text-white/65">
                    These selections feed directly into the settlement vault panel.
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-black/10 px-4 py-2 text-sm text-white/70">
                  {selectedDocuments.length} linked / baglandi
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {documents.map((document) => {
                  const active = draft.evidenceIds.includes(document.id);
                  const localizedType = evidenceTypeCatalog.find((item) => item.value === document.type);

                  return (
                    <button
                      key={document.id}
                      type="button"
                      onClick={() => toggleEvidence(document.id)}
                      className={[
                        "grid gap-3 rounded-[22px] border p-4 text-left transition md:grid-cols-[1fr_auto]",
                        active
                          ? "border-sky-400/30 bg-sky-500/10 shadow-[0_16px_36px_rgba(10,79,140,0.18)]"
                          : "border-white/10 bg-black/10 hover:bg-white/[0.04]",
                      ].join(" ")}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white/92">{document.name}</div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
                          <span className="rounded-full border border-white/10 px-3 py-1">
                            {localizedType?.labelEn} / {localizedType?.labelTr}
                          </span>
                          <span className="rounded-full border border-white/10 px-3 py-1">
                            {document.uploaderRole}
                          </span>
                          <span className="rounded-full border border-white/10 px-3 py-1">
                            {document.source === "generated-dashboard"
                              ? "Generated dashboard / Uretilen dashboard"
                              : "Manual upload / Manuel yukleme"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-start md:justify-end">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            active ? "bg-emerald-500/15 text-emerald-200" : "bg-white/[0.04] text-white/65",
                          ].join(" ")}
                        >
                          {active ? "Included / Dahil" : "Available / Hazir"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Surface>

        <Surface className="h-full">
          <PanelHeader
            icon={Landmark}
            eyebrow="Dispute intake / Uyusmazlik girisi"
            title="Structured before settlement"
            description="The disputed portion must be entered explicitly. This intake defines amount, reason, and supporting evidence before the workflow can move funds."
          />

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm text-white/75">
              <span>Total amount / Toplam tutar</span>
              <input
                value={draft.totalAmount}
                onChange={(event) =>
                  setDraftAndSave(setDraft, draft, {
                    totalAmount: Number(event.target.value.replace(/[^0-9.]/g, "")) || 0,
                  })
                }
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
              />
            </label>

            <label className="grid gap-2 text-sm text-white/75">
              <span>Disputed amount / Tartismali tutar</span>
              <input
                value={draft.disputedAmount}
                onChange={(event) => handleDisputedAmount(event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
              />
            </label>

            <label className="grid gap-2 text-sm text-white/75">
              <span>Counterparty / Karsi taraf</span>
              <input
                value={draft.counterparty}
                onChange={(event) => setDraftAndSave(setDraft, draft, { counterparty: event.target.value })}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
              />
            </label>

            <div className="grid gap-2 text-sm text-white/75">
              <span>Dispute reason / Uyusmazlik nedeni</span>
              <div className="grid gap-2">
                {disputeReasonCatalog.map((reason) => (
                  <button
                    key={reason.key}
                    type="button"
                    onClick={() => updateReason(reason.key)}
                    className={[
                      "rounded-2xl border px-4 py-3 text-left transition",
                      draft.reasonKey === reason.key
                        ? "border-[#4f97e8]/35 bg-[#3373B7]/10 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/75 hover:bg-white/[0.05]",
                    ].join(" ")}
                  >
                    <div className="font-semibold">{reason.labelEn}</div>
                    <div className="mt-1 text-xs text-white/55">{reason.labelTr}</div>
                  </button>
                ))}
              </div>
            </div>

            {draft.reasonKey === "custom" ? (
              <label className="grid gap-2 text-sm text-white/75">
                <span>Custom note / Ozel not</span>
                <textarea
                  value={customReason}
                  onChange={(event) => handleCustomReason(event.target.value)}
                  placeholder="Describe the narrow disputed point / Dar tartisma noktasini yazin"
                  className="min-h-[120px] rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-white/30"
                />
              </label>
            ) : null}

            <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#88c4ff]">
                Ready for settlement / Settlement icin hazir
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoCard label="Undisputed / Tartismasiz" value={formatMoney(Math.max(draft.totalAmount - draft.disputedAmount, 0), draft.currency)} />
                <InfoCard label="Linked evidence / Bagli kanit" value={`${selectedDocuments.length} document(s)`} />
                <InfoCard label="Reason / Neden" value={`${selectedReason.labelEn} / ${selectedReason.labelTr}`} />
                <InfoCard label="Next action / Sonraki aksiyon" value="Open settlement and confirm split / Settlement ekraninda bolmeyi onayla" />
              </div>
            </div>
          </div>
        </Surface>
      </div>

      {!voyage ? (
        <div className="mt-5">
          <Surface>
            <PanelHeader
              icon={FolderOpenDot}
              eyebrow="Demo note / Demo notu"
              title="No generated voyage in session"
              description="The page still works with seeded demo evidence, but it becomes more precise after Try Demo generates a voyage context."
            />
            <div className="mt-5">
              <CTAButton route="/app/try-demo">Go to Try Demo</CTAButton>
            </div>
          </Surface>
        </div>
      ) : null}
    </AppShell>
  );
}

function setDraftAndSave(
  setDraft: Dispatch<SetStateAction<ReturnType<typeof loadSettlementDraft>>>,
  currentDraft: ReturnType<typeof loadSettlementDraft>,
  patch: Partial<ReturnType<typeof loadSettlementDraft>>,
) {
  const nextDraft = { ...currentDraft, ...patch };
  setDraft(nextDraft);
  saveSettlementDraft(nextDraft);
}

function PanelHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof ClipboardList;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm uppercase tracking-[0.24em] text-[#88c4ff]">{eyebrow}</div>
        <div className="mt-1 text-2xl font-bold text-white">{title}</div>
        <div className="mt-2 max-w-3xl text-sm leading-7 text-white/65">{description}</div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">{label}</div>
      <div className="mt-2 break-words text-sm font-semibold leading-6 text-white/90">{value}</div>
    </div>
  );
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNow() {
  const now = new Date();
  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(now);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  return `${datePart}, ${timePart} HRS`;
}
