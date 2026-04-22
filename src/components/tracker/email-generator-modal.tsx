"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { markFollowUpSent } from "@/app/actions";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15";

type Props = {
  applicationId: string;
  company: string;
  roleTitle: string;
  recruiterName: string | null;
  onClose: () => void;
};

export function EmailGeneratorModal({
  applicationId,
  company,
  roleTitle,
  recruiterName: initialRecruiter,
  onClose,
}: Props) {
  const router = useRouter();
  const [emailType, setEmailType] = useState<
    "follow-up" | "thank-you" | "cold-outreach"
  >("follow-up");
  const [tone, setTone] = useState<"formal" | "friendly">("friendly");
  const [recruiterName, setRecruiterName] = useState(initialRecruiter ?? "");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null);

  const generate = async () => {
    setError(null);
    setWarning(null);
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      const res = await fetch("/api/ai-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          company,
          roleTitle,
          recruiterName: recruiterName.trim() || null,
          emailType,
          tone,
        }),
      });
      const data = (await res.json()) as {
        email?: string;
        error?: string;
        code?: string | null;
        warning?: string;
      };
      if (!res.ok) {
        const details = data.code ? ` (${data.code})` : "";
        setError((data.error ?? "Could not generate email.") + details);
        return;
      }
      const next = (data.email ?? "").trim();
      if (!next) {
        setError("Email came back empty. Try again.");
        return;
      }
      setBody(next);
      setLastGeneratedAt(new Date());
      if (data.warning) {
        setWarning(data.warning);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Generation timed out. Please try again.");
      } else {
        setError("Network error. Check connection and retry.");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!body.trim()) return;
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy — select the text manually.");
    }
  };

  const markSent = async () => {
    await markFollowUpSent(applicationId);
    router.refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-gen-title"
      >
        <div className="shrink-0 border-b border-white/[0.06] px-5 py-4">
          <h2
            id="email-gen-title"
            className="text-base font-semibold tracking-tight text-zinc-50"
          >
            Generate email
          </h2>
          <p className="text-xs text-zinc-500">
            {company} — {roleTitle}
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Type
              </label>
              <select
                value={emailType}
                onChange={(e) =>
                  setEmailType(
                    e.target.value as
                      | "follow-up"
                      | "thank-you"
                      | "cold-outreach",
                  )
                }
                className={inputClass}
              >
                <option value="follow-up">Follow-up</option>
                <option value="thank-you">Thank-you</option>
                <option value="cold-outreach">Cold outreach</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) =>
                  setTone(e.target.value as "formal" | "friendly")
                }
                className={inputClass}
              >
                <option value="formal">Formal</option>
                <option value="friendly">Friendly</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Recruiter name (optional)
            </label>
            <input
              value={recruiterName}
              onChange={(e) => setRecruiterName(e.target.value)}
              className={inputClass}
              placeholder="If you know it"
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => void generate()}
            className="w-full rounded-xl border border-[#c9a227]/40 bg-[#c9a227]/10 py-2.5 text-sm font-semibold text-[#f0d78c] transition hover:bg-[#c9a227]/20 disabled:opacity-40"
          >
            {loading ? "Generating…" : "Generate email"}
          </button>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Draft
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className={`${inputClass} resize-y font-mono text-[13px] leading-relaxed`}
              placeholder="Generated text appears here. Edit freely."
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs text-red-200">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void generate()}
                disabled={loading}
                className="mt-2 inline-flex rounded-md border border-red-300/40 px-2 py-1 text-[11px] font-semibold text-red-100 transition hover:bg-red-900/30 disabled:opacity-50"
              >
                Retry
              </button>
            </div>
          )}

          {warning && !error && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-950/30 px-3 py-2 text-xs text-amber-200">
              {warning}
            </p>
          )}

          {lastGeneratedAt && !error && (
            <p className="text-[11px] text-zinc-500">
              Last generated at {lastGeneratedAt.toLocaleTimeString()}.
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-white/[0.06] p-4 sm:flex-row">
          <button
            type="button"
            onClick={() => void copy()}
            disabled={!body.trim()}
            className="flex-1 rounded-xl border border-white/[0.12] py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.06] disabled:opacity-40"
          >
            {copied ? "Copied!" : "Copy email"}
          </button>
          <button
            type="button"
            onClick={() => void markSent()}
            disabled={!body.trim()}
            className="flex-1 rounded-xl bg-gradient-to-b from-[#d4af37] to-[#9a7b1a] py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-[#c9a227]/15 transition hover:brightness-110 disabled:opacity-40"
          >
            Mark as sent
          </button>
        </div>
      </div>
    </div>
  );
}
