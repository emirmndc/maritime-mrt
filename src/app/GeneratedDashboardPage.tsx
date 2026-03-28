function EvidenceVaultPanel({ className = "" }: { className?: string }) {
  const inputId = useId();
  const [uploaderRole, setUploaderRole] = useState<"Owner" | "Charterer" | "Agent">("Owner");
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const registerFiles = (files: FileList | File[]) => {
    const nextEntries = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}`,
      fileName: file.name,
      timestamp: formatVaultTimestamp(new Date()),
      uploaderRole,
      fileUrl: URL.createObjectURL(file),
    }));

    setEntries((current) => [...nextEntries, ...current]);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    registerFiles(files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!event.dataTransfer.files?.length) return;
    registerFiles(event.dataTransfer.files);
  };

  return (
    <div className={className}>
      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <HeaderTag label="Manual upload" tone="mixed" />
            <div className="mt-3 text-xl font-bold">Evidence Vault (Manual Upload)</div>
            <div className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
              Files stay off-chain at this stage. The system records only file name, uploader role,
              and timestamp.
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/60">
            Accepted: PDF, JPG, PNG
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">Uploader role</div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["Owner", "Charterer", "Agent"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setUploaderRole(role)}
                  className={[
                    "rounded-2xl border px-3 py-2 text-sm font-semibold transition",
                    uploaderRole === role
                      ? "border-[#4f97e8]/35 bg-[#3373B7] text-white"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <input
                id={inputId}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <label
                htmlFor={inputId}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={[
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl border px-5 py-8 text-center transition",
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

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">Vault log</div>
            <div className="mt-4 space-y-3">
              {entries.length === 0 ? (
                <EmptyBox text="No manually uploaded evidence has been logged yet." />
              ) : (
                entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0 font-semibold text-white/90">{entry.fileName}</div>
                      <button
                        type="button"
                        onClick={() => window.open(entry.fileUrl, "_blank", "noopener,noreferrer")}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/70 transition hover:bg-white/[0.06]"
                      >
                        View
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/58">
                      <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-sky-200">
                        {entry.uploaderRole}
                      </span>
                      <span>{entry.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
