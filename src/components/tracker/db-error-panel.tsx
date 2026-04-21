type Props = { message: string };

export function DbErrorPanel({ message }: Props) {
  const safe = message.replace(/postgres(ql)?:\/\/[^@\s]+@/gi, "postgresql://***@");

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-red-500/30 bg-red-950/30 px-6 py-5 text-left">
      <p className="text-sm font-semibold text-red-200">Database connection failed</p>
      <p className="mt-2 font-mono text-xs leading-relaxed text-red-100/90 break-words">
        {safe}
      </p>
      <ul className="mt-4 list-inside list-disc space-y-1 text-xs text-red-200/80">
        <li>
          In Vercel: <strong>Project → Settings → Environment Variables</strong> — add{" "}
          <code className="rounded bg-black/30 px-1">DATABASE_URL</code> for{" "}
          <strong>Production</strong> (same value as in your local <code>.env</code>).
        </li>
        <li>Redeploy after saving env vars.</li>
        <li>
          Use your Neon <strong>pooled</strong> connection string (host contains{" "}
          <code className="rounded bg-black/30 px-1">pooler</code>).
        </li>
      </ul>
    </div>
  );
}
