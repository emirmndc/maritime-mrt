<div className="mt-3 space-y-2">
  {(["Owner", "Charterer", "Agent"] as const).map((role) => (
    <button
      key={role}
      type="button"
      onClick={() => setUploaderRole(role)}
      className={[
        "rounded-full px-3 py-2 text-sm transition",
        uploaderRole === role
          ? "bg-[#3373B7] text-white"
          : "text-white/70 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      {role}
    </button>
  ))}
</div>
