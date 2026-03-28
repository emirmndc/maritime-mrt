import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  ChevronDown,
  ClipboardList,
  FileStack,
  FolderOpenDot,
  Landmark,
  Upload,
  WalletCards,
} from "lucide-react";
import { loadGeneratedVoyage } from "./generatedVoyage";
import {
  assessSettlementDraft,
  disputeReasonCatalog,
  evidenceTypeCatalog,
  getDisputeReasonLabel,
  getSettlementPartyModel,
  loadEvidenceVaultDocuments,
  loadSettlementDraft,
  saveEvidenceVaultDocuments,
  saveSettlementDraft,
  type ClaimPartyRole,
  type DisputeReasonKey,
  type EvidenceDocumentType,
  type EvidenceUploaderRole,
  type EvidenceVaultDocument,
  type SettlementDraft,
} from "./settlementStore";
import { AppShell, CTAButton, Surface } from "./ui";

export function GeneratedDashboardPage() {
  const voyage = typeof window !== "undefined" ? loadGeneratedVoyage() : null;
  const [documents, setDocuments] = useState<EvidenceVaultDocument[]>(() =>
    loadEvidenceVaultDocuments(),
  );
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
  const assessment = useMemo(
    () => assessSettlementDraft(draft, selectedDocuments),
    [draft, selectedDocuments],
  );
  const partyModel = useMemo(() => getSettlementPartyModel(draft.claimSide), [draft.claimSide]);

  useEffect(() => {
    setCustomReason(draft.customReason);
  }, [draft.customReason]);

  useEffect(() => {
    if (!isTypeMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (typeMenuRef.current?.contains(event.target as Node)) return;
      setIsTypeMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsTypeMenuOpen(false);
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTypeMenuOpen]);

  function persistDraft(nextDraft: SettlementDraft) {
    setDraft(nextDraft);
    saveSettlementDraft(nextDraft);
  }

  function updateDraft(patch: Partial<SettlementDraft>) {
    const nextDraft = {
      ...draft,
      ...patch,
      claimedAmount:
        patch.claimedAmount !== undefined ? Math.max(patch.claimedAmount, 0) : draft.claimedAmount,
    };

    if (nextDraft.admittedAmount > nextDraft.claimedAmount) {
      nextDraft.admittedAmount = nextDraft.claimedAmount;
    }

    persistDraft(nextDraft);
  }

  function toggleEvidence(documentId: string) {
    updateDraft({
      evidenceIds: draft.evidenceIds.includes(documentId)
        ? draft.evidenceIds.filter((item) => item !== documentId)
        : [...draft.evidenceIds, documentId],
    });
  }

  function updateReason(reasonKey: DisputeReasonKey) {
    updateDraft({
      reasonKey,
      customReason: reasonKey === "custom" ? customReason : "",
    });
  }

  function parseNumeric(value: string) {
    const numeric = Number(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
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

    const mergedDocuments = [...nextDocuments, ...loadEvidenceVaultDocuments()];
    setDocuments(mergedDocuments);
    saveEvidenceVaultDocuments(mergedDocuments);

    const latestDraft = loadSettlementDraft();
    persistDraft({
      ...latestDraft,
      evidenceIds: [
        ...nextDocuments.map((item) => item.id),
        ...latestDraft.evidenceIds.filter((id) => !nextDocuments.some((item) => item.id === id)),
      ],
    });
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

  return (
    <AppShell
      eyebrow="Generated Dashboard / Uretilen Dashboard"
      title="Operational evidence and settlement intake"
      description="Generated dashboard feeds the settlement workflow. This draft now follows a stricter freight-payment logic: claimant side, admitted payable amount, disputed remainder, and evidence-pack checks."
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
            <InfoCard label="Owner / Armator" value={voyage?.owner || "Northshore Bulk Pte. Ltd."} />
            <InfoCard label="Charterer / Kiraci" value={voyage?.charterer || "Bluewake Shipping"} />
            <InfoCard label="Cargo / Yuk" value={voyage?.cargo || "4,800 MT corn"} />
            <InfoCard
              label="Commercial risk / Ticari risk"
              value={voyage?.commercial_risk || "Port cost difference under review"}
            />
          </div>
        </Surface>

        <Surface>
          <PanelHeader
            icon={WalletCards}
            eyebrow="Settlement handoff / Settlement aktarimi"
            title="Prepared for Split & Neutralize"
            description="The handoff now separates claimed amount, admitted payable amount, and disputed remainder instead of using a loose total-minus-dispute shortcut."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoCard label="Claimed / Talep" value={formatMoney(draft.claimedAmount, draft.currency)} />
            <InfoCard label="Admitted / Kabul edilen" value={formatMoney(draft.admittedAmount, draft.currency)} />
            <InfoCard label="Disputed / Tartismali" value={formatMoney(assessment.disputedAmount, draft.currency)} />
            <InfoCard label="Claimant / Talep sahibi" value={`${partyModel.claimantRole} - ${partyModel.claimantName}`} />
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/70">
            Demo assumption: in this freight-payment flow, Charterer pays and Owner receives.
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
            description="Files stay off-chain in this demo. The workflow stores name, evidence type, uploader role, and timestamp."
          />

          <div className="mt-6 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
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
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(["Owner", "Charterer", "Agent"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUploaderRole(role)}
                      className={[
                        "rounded-2xl border px-3 py-2 text-sm transition",
                        uploaderRole === role
                          ? "border-[#4f97e8]/35 bg-[#3373B7] text-white"
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
                  <span>Evidence type / Kanit tipi</span>
                  <div className="relative" ref={typeMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsTypeMenuOpen((current) => !current)}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-white transition hover:bg-white/[0.05]"
                    >
                      <span>{selectedManualType.labelEn} / {selectedManualType.labelTr}</span>
                      <ChevronDown className={`h-4 w-4 text-white/65 transition ${isTypeMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isTypeMenuOpen ? (
                      <div className="absolute z-20 mt-2 w-full rounded-2xl border border-white/10 bg-[#0d1825] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
                        {evidenceTypeCatalog.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                              setManualType(item.value);
                              setIsTypeMenuOpen(false);
                            }}
                            className={[
                              "flex w-full rounded-xl px-3 py-2 text-left text-sm transition",
                              item.value === manualType
                                ? "bg-[#3373B7] text-white"
                                : "text-white/82 hover:bg-white/[0.06]",
                            ].join(" ")}
                          >
                            {item.labelEn} / {item.labelTr}
                          </button>
                        ))}
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
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#88c4ff]">Vault log</div>
                  <div className="mt-2 text-sm text-white/65">Uploaded files stay logged here.</div>
                </div>
                <div className="rounded-full border border-white/10 bg-black/10 px-4 py-2 text-sm text-white/70">
                  {manualUploads.length} file(s)
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {manualUploads.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/60">
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
                        "rounded-[22px] border p-4",
                        active ? "border-sky-400/30 bg-sky-500/10" : "border-white/10 bg-black/10",
                      ].join(" ")}
                    >
                      <div className="break-words text-sm font-semibold text-white/92">{document.name}</div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
                        <span className="rounded-full border border-white/10 px-3 py-1">
                          {localizedType?.labelEn} / {localizedType?.labelTr}
                        </span>
                        <span className="rounded-full border border-white/10 px-3 py-1">{document.uploaderRole}</span>
                        <span className="rounded-full border border-white/10 px-3 py-1">{document.uploadedAt}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => toggleEvidence(document.id)}
                          className={[
                            "rounded-full px-3 py-1 text-xs font-semibold transition",
                            active ? "bg-emerald-500/15 text-emerald-200" : "bg-white/[0.04] text-white/65",
                          ].join(" ")}
                        >
                          {active ? "Included / Dahil" : "Include / Dahil et"}
                        </button>
                        {document.fileDataUrl ? (
                          <button
                            type="button"
                            onClick={() => window.open(document.fileDataUrl, "_blank", "noopener,noreferrer")}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/72"
                          >
                            Open / Ac
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
            eyebrow="Dispute intake / Uyusmazlik girisi"
            title="Structured before settlement"
            description="This intake now enforces party direction, admitted payable logic, and a reason-specific evidence pack."
          />

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm text-white/75">
              <span>Claimed amount / Talep edilen tutar</span>
              <input
                value={draft.claimedAmount}
                onChange={(event) => updateDraft({ claimedAmount: parseNumeric(event.target.value) })}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
              />
            </label>

            <label className="grid gap-2 text-sm text-white/75">
              <span>Admitted payable / Kabul edilen odeme</span>
              <input
                value={draft.admittedAmount}
                onChange={(event) => updateDraft({ admittedAmount: parseNumeric(event.target.value) })}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
              />
            </label>

            <label className="grid gap-2 text-sm text-white/75">
              <span>Due date / Vade tarihi</span>
              <input
                value={draft.dueDate}
                onChange={(event) => updateDraft({ dueDate: event.target.value })}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
              />
            </label>

            <div className="grid gap-2 text-sm text-white/75">
              <span>Claim raised by / Talebi acan taraf</span>
              <div className="grid grid-cols-2 gap-2">
                {(["Owner", "Charterer"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => updateDraft({ claimSide: role as ClaimPartyRole })}
                    className={[
                      "rounded-2xl border px-4 py-3 text-left transition",
                      draft.claimSide === role
                        ? "border-[#4f97e8]/35 bg-[#3373B7]/10 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/75 hover:bg-white/[0.05]",
                    ].join(" ")}
                  >
                    <div className="font-semibold">{role}</div>
                    <div className="mt-1 text-xs text-white/55">
                      {role === "Owner" ? "Owner-led claim package" : "Charterer-led claim package"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#88c4ff]">Party map / Taraf haritasi</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoCard label="Claimant / Talep sahibi" value={`${partyModel.claimantRole} - ${partyModel.claimantName}`} />
                <InfoCard label="Respondent / Muhatap" value={`${partyModel.respondentRole} - ${partyModel.respondentName}`} />
                <InfoCard label="Payer / Odeyen" value={`${partyModel.payerRole} - ${partyModel.payerName}`} />
                <InfoCard label="Payee / Alan" value={`${partyModel.payeeRole} - ${partyModel.payeeName}`} />
              </div>
            </div>

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
                  onChange={(event) => {
                    setCustomReason(event.target.value);
                    updateDraft({ customReason: event.target.value });
                  }}
                  className="min-h-[120px] rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
                />
              </label>
            ) : null}

            <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#88c4ff]">Required evidence pack / Gerekli kanit paketi</div>
              <div className="mt-4 grid gap-2">
                {assessment.requirementChecks.length > 0 ? (
                  assessment.requirementChecks.map((item) => (
                    <div
                      key={item.id}
                      className={[
                        "rounded-2xl border px-4 py-3 text-sm",
                        item.satisfied
                          ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
                          : "border-amber-400/20 bg-amber-500/10 text-amber-100",
                      ].join(" ")}
                    >
                      <div className="font-semibold">{item.label} / {item.labelTr}</div>
                      <div className="mt-1 text-xs opacity-80">{item.anyOf.join(" or ")}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/65">
                    Custom reason selected. Attach the evidence you intend to rely on.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#88c4ff]">Ready for settlement / Settlement icin hazir</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoCard label="Claimed / Talep" value={formatMoney(draft.claimedAmount, draft.currency)} />
                <InfoCard label="Admitted / Kabul edilen" value={formatMoney(draft.admittedAmount, draft.currency)} />
                <InfoCard label="Disputed / Tartismali" value={formatMoney(assessment.disputedAmount, draft.currency)} />
                <InfoCard label="Reason / Neden" value={`${selectedReason.labelEn} / ${selectedReason.labelTr}`} />
              </div>
              <div className="mt-4 grid gap-2">
                {assessment.issues.length > 0 ? (
                  assessment.issues.map((issue) => (
                    <div
                      key={issue}
                      className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-100"
                    >
                      {issue}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                    Claimed, admitted, party direction, and evidence pack are aligned for settlement.
                  </div>
                )}
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
