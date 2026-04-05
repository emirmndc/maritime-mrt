                  ))
                ) : (
                  <EmptyBox text="Custom review selected. Attach the evidence you intend to rely on." />
                )}
              </div>

              <div className="mt-4 grid gap-2">
                {vaultDocuments.length > 0 ? (
                  vaultDocuments.map((document) => {
                    const active = selectedEvidenceIds.includes(document.id);
                    return (
                      <button
                        key={document.id}
                        type="button"
                        onClick={() => toggleEvidenceSelection(document.id)}
                        className={[
                          "rounded-2xl border px-4 py-3 text-left transition",
                          active
                            ? "border-sky-400/30 bg-sky-500/10"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
                        ].join(" ")}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="break-words font-semibold text-white/90">{document.name}</div>
                          <span
                            className={[
                              "rounded-full px-3 py-1 text-xs font-semibold",
                              active ? "bg-emerald-500/15 text-emerald-200" : "bg-white/[0.04] text-white/60",
                            ].join(" ")}
                          >
                            {active ? "Linked" : "Link"}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-white/58">
                          {document.type} - {document.uploaderRole} - {document.uploadedAt}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <EmptyBox text="No evidence is available yet. Upload or confirm documents first." />
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleOpenDisputePackage}
                disabled={disputeIssues.length > 0}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#78b7ff_0%,#3373B7_52%,#245d99_100%)] px-5 py-3 text-sm font-semibold text-[#06111f] shadow-[0_14px_34px_rgba(51,115,183,0.35)] transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ArrowRightLeft className="h-4 w-4" />
                {openingMode === "manual-review" ? "Open manual dispute package" : "Open settlement package"}
              </button>
              <button
                type="button"
                onClick={applyGeneratedSuggestion}
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.06]"
              >
                Reset to suggestion
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {packageMessage ? (
                <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
                  {packageMessage}
                </div>
              ) : null}
              {disputeIssues.length > 0 ? (
                disputeIssues.map((issue) => (
                  <div
                    key={issue}
                    className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                  >
                    {issue}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  Dispute package is coherent and ready to open in settlement.
                </div>
              )}
            </div>
          </div>
        </div>
      </Surface>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_0.95fr_1.25fr]">
        <Surface>
          <HeaderTag label="Suggested" tone="suggested" />
          <SectionTitle icon={TriangleAlert} label="3 critical review points" subtitle="Look here first" />
          <div className="mt-5 space-y-3">
            {keyRisks.length === 0 ? (
              <EmptyBox text="No highlighted review points were returned." />
            ) : (
              keyRisks.map((flag) => (
                <TraceableCard
                  key={flag.title}
                  title={flag.title}
                  body={flag.guidance}
                  confidence={flag.confidence}
                  sourceTrace={flag.sourceTrace}
                  accentClass={flagTone[flag.severity]}
                />
              ))
            )}
          </div>
        </Surface>

        <Surface>
          <HeaderTag label="Suggested" tone="suggested" />
          <SectionTitle icon={Clock3} label="3 next actions" subtitle="Suggested workflow follow-up" />
          <div className="mt-5 space-y-3">
            {nextActions.length === 0 ? (
              <EmptyBox text="No next actions were returned." />
            ) : (
              nextActions.map((task) => (
                <div
                  key={task.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="break-words font-semibold">{task.title}</div>
                    <StatusPill status={task.status} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/68">{task.detail}</p>
                  <div className="mt-3 text-xs uppercase tracking-[0.2em] text-white/45">
                    Why this matters
                  </div>
                  <div className="mt-2 text-sm leading-7 text-white/78">{task.why_matters}</div>
                  <TraceFooter confidence={task.confidence} sourceTrace={task.sourceTrace} />
                </div>
              ))
            )}
          </div>
        </Surface>

        <Surface>
          <HeaderTag label="Requires confirmation" tone="review" />
          <SectionTitle
            icon={FileStack}
            label="Missing documents blocking progress"
            subtitle="Evidence comes first"
          />
          <div className="mt-5 space-y-3">
            {blockingDocuments.length === 0 ? (
              <EmptyBox text="No blocking document gaps are visible in this draft." />
            ) : (
              blockingDocuments.map((document) => (
                <div
                  key={document.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="break-words font-semibold text-white/90">{document.title}</div>
                  <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${documentTone[document.status]}`}>
                    {formatDocumentStatus(document.status)}
                  </div>
                  <TraceFooter confidence={document.confidence} sourceTrace={document.sourceTrace} />
                </div>
              ))
            )}
          </div>
          <EvidenceVaultPanel
            className="mt-5"
            onEntriesChanged={() => setVaultVersion((current) => current + 1)}
          />
        </Surface>
      </div>

      <Surface className="mt-5">
        <HeaderTag label="Timing advisory" tone="mixed" />
        <div className="mt-3 text-2xl font-bold">Local holiday and banking watch</div>
        <div className="mt-2 text-sm text-white/65">
          Advisory only. Review local port, bank, agent, and customs working arrangements.
        </div>
        <div className="mt-5 grid gap-3 xl:grid-cols-2">
          {timingAdvisories.length === 0 ? (
            <EmptyBox text="No local holiday or banking advisory was generated for this draft." />
          ) : (
            timingAdvisories.map((item, index) => (
              <div
                key={`${item.country}-${item.port_context}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="break-words font-semibold text-white/90">
                    {item.country} - {item.port_context}
                  </div>
                  {item.confidence ? <ConfidenceBadge level={item.confidence} /> : null}
                </div>
                <div className="mt-2 text-sm text-[#88c4ff]">
                  {item.holiday_name || "Holiday / banking calendar review"}
                </div>
                <div className="mt-3 text-sm leading-7 text-white/78">{item.advisory}</div>
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Potential impact
                  </div>
                  <div className="mt-2 text-sm leading-7 text-white/88">
                    {formatTimingImpact(item.impact)}
                  </div>
                </div>
                <TraceFooter confidence={item.confidence} sourceTrace={item.sourceTrace} />
              </div>
            ))
          )}
        </div>
      </Surface>

      <div id="full-breakdown" className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Surface>
          <HeaderTag label="Extracted" tone="extracted" />
          <SectionTitle icon={FileSearch} label="Recap summary" subtitle="Directly extracted terms" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(generated.parser_summary || []).map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{item.label}</div>
                <div className="mt-2 break-words text-sm font-semibold leading-6 text-white/90">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface>
          <HeaderTag label="Demo state" tone="mixed" />
          <SectionTitle icon={Clock3} label="Since last update" subtitle="No new events recorded (demo state)" />
          <div className="mt-5 space-y-4">
            {(generated.changes_since_last_update || []).length > 0 ? (
              generated.changes_since_last_update.map((item) => (
                <div
                  key={`${item.title}-${item.stamp}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="break-words font-semibold">{item.title}</div>
                    <div className="text-xs text-[#88c4ff]">{item.stamp}</div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/68">{item.detail}</p>
                </div>
              ))
            ) : (
              <EmptyBox text="No new events recorded (demo state)." />
            )}
          </div>
        </Surface>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <TaskDisclosure
          title="View Owner tasks"
          description="Suggested responsibilities extracted from the recap and organized for review."
          columnTitle="Owner tasks"
          items={generated.owner_tasks || []}
        />
        <TaskDisclosure
          title="View Charterer tasks"
          description="Suggested responsibilities extracted from the recap and organized for review."
          columnTitle="Charterer tasks"
          items={generated.charterer_tasks || []}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Surface>
          <HeaderTag label="Suggested" tone="suggested" />
          <SectionTitle icon={AlertTriangle} label="Operational cautions" subtitle="Suggested wording only" />
          <div className="mt-5 space-y-3">
            {(generated.risk_notes || []).length > 0 ? (
              generated.risk_notes.map((note, index) => {
                const caution = normalizeCaution(note, index);
                return (
                  <div
                    key={caution.title}
                    className="rounded-2xl border border-amber-400/15 bg-amber-500/5 px-4 py-3 text-sm leading-7 text-white/78"
                  >
                    <div className="break-words font-semibold text-white/90">{caution.title}</div>
                    <div className="mt-2">{caution.body}</div>
                    <TraceFooter confidence={caution.confidence} sourceTrace={caution.sourceTrace} />
                  </div>
                );
              })
            ) : (
              <EmptyBox text="No suggested cautions were returned." />
            )}
          </div>
        </Surface>

        <Surface>
          <HeaderTag label="Future layer" tone="mixed" />
          <SectionTitle icon={Mail} label="Reminder drafts" subtitle="Not generated yet" />
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/70">
            Draft generation should come after extraction quality and task quality are stable.
          </div>
