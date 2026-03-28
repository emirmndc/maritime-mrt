import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
} from "react";
import {
  ClipboardList,
  ChevronDown,
  FileStack,
  FolderOpenDot,
  Landmark,
  Upload,
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
  const [manualType, setManualType] = useState<EvidenceDocumentType>("Invoice");
  const [customReason, setCustomReason] = useState(draft.customReason);
  const [isDragging, setIsDragging] = useState(false);
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const uploadInputId = useId();
  const typeMenuRef = useRef<HTMLDivElement | null>(null);

  const routeLabel = voyage?.route || "Voyage #A102";
  const selectedReason = getDisputeReasonLabel(draft.reasonKey);
  const selectedManualType =
    evidenceTypeCatalog.find((item) => item.value === manualType) ?? evidenceTypeCatalog[0];

  const selectedDocuments = useMemo(
    () => documents.filter((item) => draft.evidenceIds.includes(item.id)),
    [documents, draft.evidenceIds],
  );
  const manualUploads = useMemo(
    () => documents.filter((item) => item.source === "manual-upload"),
    [documents],
  );

  useEffect(() => {
    if (!isTypeMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (typeMenuRef.current?.contains(event.target as Node)) return;
      setIsTypeMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsTypeMenuOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTypeMenuOpen]);

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

  async function handleManualEvidenceUpload(files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const nextDocuments = await Promise.all(
      fileArray.map(async (file) => ({
        id: `manual-${file.name}-${file.size}-${file.lastModified}-${Date.now()}`,
        name: file.name,
        type: manualType,
        uploaderRole,
        uploadedAt: formatNow(),
        source: "manual-upload" as const,
        fileDataUrl: await readFileAsDataUrl(file),
      })),
    );

    const mergedDocuments = [...nextDocuments, ...documents];
    setDocuments(mergedDocuments);
    nextDocuments.forEach((document) => appendEvidenceVaultDocument(document));

    const nextDraft = {
      ...draft,
      evidenceIds: [
        ...nextDocuments.map((item) => item.id),
        ...draft.evidenceIds.filter((id) => !nextDocuments.some((item) => item.id === id)),
      ],
    };
    setDraft(nextDraft);
    saveSettlementDraft(nextDraft);
  }

  async function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;
    await handleManualEvidenceUpload(files);
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!event.dataTransfer.files?.length) return;
    await handleManualEvidenceUpload(event.dataTransfer.files);
  }

  function handleOpenEvidence(document: EvidenceVaultDocument) {
    if (!document.fileDataUrl) return;
    window.open(document.fileDataUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <AppShell
      eyebrow="Generated Dashboard"
      title="Operational evidence and settlement intake"
      description="Generated dashboard now feeds the settlement workflow. Evidence chosen here is re-used in Split & Neutralize, so the disputed portion is grounded in actual supporting references."
    >
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Surface>
          <PanelHeader
            icon={ClipboardList}
            eyebrow="Voyage context"
            title={routeLabel}
            description="Review the voyage context first, then prepare the dispute intake in a controlled way."
          />

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Owner" value={voyage?.owner || "Northshore Bulk Pte. Ltd."} />
            <InfoCard label="Charterer" value={voyage?.charterer || "Bluewake Shipping"} />
            <InfoCard label="Cargo" value={voyage?.cargo || "4,800 MT corn"} />
            <InfoCard
              label="Commercial risk"
              value={voyage?.commercial_risk || "Port cost difference under review"}
            />
          </div>
        </Surface>

        <Surface>
          <PanelHeader
            icon={WalletCards}
            eyebrow="Settlement handoff"
            title="Prepared for Split & Neutralize"
            description="This panel controls what the settlement workflow will receive. Nothing is random; the dispute record is assembled here."
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoCard label="Total amount" value={formatMoney(draft.totalAmount, draft.currency)} />
            <InfoCard
              label="Undisputed"
              value={formatMoney(Math.max(draft.totalAmount - draft.disputedAmount, 0), draft.currency)}
            />
            <InfoCard label="Disputed" value={formatMoney(draft.disputedAmount, draft.currency)} />
            <InfoCard label="Reason" value={selectedReason.labelEn} />
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
            eyebrow="Evidence Vault"
            title="Manual upload and document linking"
            description="Files stay off-chain in this demo. The workflow stores document name, evidence type, uploader role, and timestamp so settlement can cite them consistently."
          />

          <div className="mt-6 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#88c4ff]">
                Manual upload
              </div>
              <div className="mt-4 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70">
                Accepted: PDF, JPG, PNG
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                  Uploader role
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(["Owner", "Charterer", "Agent"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUploaderRole(role)}
                      className={[
                        "rounded-2xl border px-3 py-2 text-sm transition",
                        uploaderRole === role
                          ? "border-[#4f97e8]/35 bg-[#3373B7] text-white shadow-[0_8px_20px_rgba(51,115,183,0.35)]"
                          : "border-white/10 bg-white/[0.03] text-white/72 hover:bg-white/[0.05]",
                      ].join(" ")}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <label className="grid gap-2 text-sm text-white/75">
                  <span>Evidence type</span>
                  <div className="relative" ref={typeMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsTypeMenuOpen((current) => !current)}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-white outline-none transition hover:bg-white/[0.05]"
                      aria-expanded={isTypeMenuOpen}
                      aria-haspopup="listbox"
                    >
                      <span>
                        {selectedManualType.labelEn}
                      </span>
                      <ChevronDown
                        className={[
                          "h-4 w-4 shrink-0 text-white/65 transition",
                          isTypeMenuOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>

                    {isTypeMenuOpen ? (
                      <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#0d1825] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
                        {evidenceTypeCatalog.map((item) => {
                          const active = item.value === manualType;

                          return (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => {
                                setManualType(item.value);
                                setIsTypeMenuOpen(false);
                              }}
                              className={[
                                "flex w-full rounded-xl px-3 py-2 text-left text-sm transition",
                                active
                                  ? "bg-[#3373B7] text-white"
                                  : "text-white/82 hover:bg-white/[0.06]",
                              ].join(" ")}
                              role="option"
                              aria-selected={active}
                            >
                              {item.labelEn}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </label>

                <input
                  id={uploadInputId}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <label
                  htmlFor={uploadInputId}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={[
                    "mt-2 flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border px-4 py-6 text-center transition",
                    isDragging
                      ? "border-[#4f97e8]/40 bg-[#3373B7]/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4f97e8]/20 bg-[#3373B7]/10 text-[#b8dcff]">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-white/90">
                    {isDragging ? "Drop document here" : "Upload document"}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-white/60">
                    Click to attach or drag and drop a file. No OCR, no parsing, no text extraction.
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#88c4ff]">
                    Vault log
                  </div>
                  <div className="mt-2 text-sm text-white/65">
                    Uploaded files stay logged here and can be opened again at any time.
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-black/10 px-4 py-2 text-sm text-white/70">
                  {manualUploads.length} file(s)
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {manualUploads.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-7 text-white/60">
                    No manually uploaded evidence has been logged yet.
                  </div>
                ) : null}

                {manualUploads.map((document) => {
                  const active = draft.evidenceIds.includes(document.id);
                  const localizedType = evidenceTypeCatalog.find((item) => item.value === document.type);

                  return (
                    <div
                      key={document.id}
                      className={[
                        "grid gap-3 rounded-[22px] border p-4 transition md:grid-cols-[1fr_auto]",
                        active
                          ? "border-sky-400/30 bg-sky-500/10 shadow-[0_16px_36px_rgba(10,79,140,0.18)]"
                          : "border-white/10 bg-black/10",
                      ].join(" ")}
                    >
                      <div className="min-w-0">
                        <div className="break-words text-sm font-semibold text-white/92">{document.name}</div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
                          <span className="rounded-full border border-white/10 px-3 py-1">
                            {localizedType?.labelEn}
                          </span>
                          <span className="rounded-full border border-white/10 px-3 py-1">
                            {document.uploaderRole}
                          </span>
                          <span className="rounded-full border border-white/10 px-3 py-1">
                            {document.uploadedAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                        <button
                          type="button"
                          onClick={() => toggleEvidence(document.id)}
                          className={[
                            "rounded-full px-3 py-1 text-xs font-semibold transition",
                            active
                              ? "bg-emerald-500/15 text-emerald-200"
                              : "bg-white/[0.04] text-white/65 hover:bg-white/[0.08]",
                          ].join(" ")}
                        >
                          {active ? "Included" : "Include"}
                        </button>
                        {document.fileDataUrl ? (
                          <button
                            type="button"
                            onClick={() => handleOpenEvidence(document)}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/72 transition hover:bg-white/[0.08]"
                          >
                            Open
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Surface>

        <Surface className="h-full">
          <PanelHeader
            icon={Landmark}
            eyebrow="Dispute intake"
            title="Structured before settlement"
            description="The disputed portion must be entered explicitly. This intake defines amount, reason, and supporting evidence before the workflow can move funds."
          />

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm text-white/75">
              <span>Total amount</span>
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
              <span>Disputed amount</span>
              <input
                value={draft.disputedAmount}
                onChange={(event) => handleDisputedAmount(event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
              />
            </label>

            <label className="grid gap-2 text-sm text-white/75">
              <span>Counterparty</span>
              <input
                value={draft.counterparty}
                onChange={(event) => setDraftAndSave(setDraft, draft, { counterparty: event.target.value })}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
              />
            </label>

            <div className="grid gap-2 text-sm text-white/75">
              <span>Dispute reason</span>
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
                  </button>
                ))}
              </div>
            </div>

            {draft.reasonKey === "custom" ? (
              <label className="grid gap-2 text-sm text-white/75">
                <span>Custom note</span>
                <textarea
                  value={customReason}
                  onChange={(event) => handleCustomReason(event.target.value)}
                  placeholder="Describe the narrow disputed point"
                  className="min-h-[120px] rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-white/30"
                />
              </label>
            ) : null}

            <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#88c4ff]">
                Ready for settlement
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoCard label="Undisputed" value={formatMoney(Math.max(draft.totalAmount - draft.disputedAmount, 0), draft.currency)} />
                <InfoCard label="Linked evidence" value={`${selectedDocuments.length} document(s)`} />
                <InfoCard label="Reason" value={selectedReason.labelEn} />
                <InfoCard label="Next action" value="Open settlement and confirm the split." />
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
              eyebrow="Demo note"
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

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
