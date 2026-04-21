"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createApplication } from "@/app/actions";
import type { JobPreview } from "@/lib/job-import/scrape-job-url";
import { STATUS_LABELS, STATUS_ORDER } from "./status-labels";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15";

type Props = { onClose: () => void };

type Mode = "paste" | "manual";

export function QuickAddModal({ onClose }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("paste");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [confidence, setConfidence] = useState<"high" | "low" | null>(null);
  const [saving, setSaving] = useState(false);

  const showForm = mode === "manual" || previewReady;

  const runPreview = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/job-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = (await res.json()) as {
        preview?: JobPreview;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not read that page.");
        setPreviewReady(false);
        return;
      }
      if (!data.preview) {
        setError("Unexpected response.");
        return;
      }
      const p = data.preview;
      setCompany(p.company);
      setRoleTitle(p.roleTitle);
      setLocation(p.location);
      setDescription(p.description);
      setJobUrl(p.jobUrl);
      setConfidence(p.confidence);
      setPreviewReady(true);
    } catch {
      setError("Network error while fetching the listing.");
      setPreviewReady(false);
    } finally {
      setLoading(false);
    }
  };

  const startManual = () => {
    setMode("manual");
    setPreviewReady(true);
    setUrl("");
    setCompany("");
    setRoleTitle("");
    setLocation("");
    setDescription("");
    setJobUrl("");
    setRecruiterName("");
    setConfidence(null);
    setError(null);
  };

  const backToPaste = () => {
    setMode("paste");
    setPreviewReady(false);
    setError(null);
  };

  const handleSave = async () => {
    setError(null);
    if (!company.trim() || !roleTitle.trim()) {
      setError("Company and role are required.");
      return;
    }
    const statusEl =
      mode === "manual"
        ? (document.getElementById("quick-status") as HTMLSelectElement | null)
        : null;
    const status = statusEl?.value ?? "APPLIED";

    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("company", company.trim());
      fd.set("roleTitle", roleTitle.trim());
      fd.set("status", status);
      if (jobUrl.trim()) fd.set("jobUrl", jobUrl.trim());
      if (location.trim()) fd.set("location", location.trim());
      if (description.trim()) fd.set("description", description.trim());
      if (recruiterName.trim()) fd.set("recruiterName", recruiterName.trim());
      await createApplication(fd);
      router.refresh();
      onClose();
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2
              id="quick-add-title"
              className="text-base font-semibold tracking-tight text-zinc-50"
            >
              Quick add
            </h2>
            <p className="text-xs text-zinc-500">Paste a link or enter basics in seconds</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        <div className="flex shrink-0 gap-1 border-b border-white/[0.06] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("paste");
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
              mode === "paste"
                ? "bg-white/[0.08] text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Paste link
          </button>
          <button
            type="button"
            onClick={startManual}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
              mode === "manual"
                ? "bg-white/[0.08] text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Manual
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {mode === "paste" && !previewReady && (
            <div className="space-y-3">
              <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Job listing URL
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className={inputClass}
                autoFocus
              />
              <button
                type="button"
                disabled={loading || !url.trim()}
                onClick={runPreview}
                className="w-full rounded-xl border border-white/[0.12] bg-zinc-800/80 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700/80 disabled:opacity-40"
              >
                {loading ? "Reading page…" : "Preview import"}
              </button>
            </div>
          )}

          {mode === "paste" && previewReady && (
            <button
              type="button"
              onClick={backToPaste}
              className="mb-3 text-xs font-medium text-[#d4af37] underline-offset-2 hover:underline"
            >
              ← Change URL
            </button>
          )}

          {showForm && (
            <div className="space-y-3">
              {confidence !== null && (
                <p className="text-[11px] text-zinc-500">
                  Import:{" "}
                  <span className="text-zinc-300">
                    {confidence === "high"
                      ? "Looks good — still verify fields."
                      : "Rough guess — please edit before saving."}
                  </span>
                </p>
              )}
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Company *
                </label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Role *
                </label>
                <input
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputClass}
                  placeholder="City, remote, etc."
                />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Listing URL
                </label>
                <input
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://…"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Recruiter name
                </label>
                <input
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  className={inputClass}
                  placeholder="Optional — for AI emails"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Description snippet
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="From listing when available"
                />
              </div>
              {mode === "manual" && (
                <div>
                  <label
                    htmlFor="quick-status"
                    className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
                  >
                    Status
                  </label>
                  <select
                    id="quick-status"
                    className={inputClass}
                    defaultValue="APPLIED"
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-2 border-t border-white/[0.06] p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/[0.1] py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || !showForm || !company.trim() || !roleTitle.trim()}
            onClick={() => void handleSave()}
            className="flex-1 rounded-xl bg-gradient-to-b from-[#d4af37] to-[#9a7b1a] py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-[#c9a227]/15 transition hover:brightness-110 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Add to tracker"}
          </button>
        </div>
      </div>
    </div>
  );
}
