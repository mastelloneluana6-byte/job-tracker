const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
  "169.254.169.254",
]);

function isPrivateIpv4(host: string): boolean {
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;
  const [a, b] = host.split(".").map(Number);
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

export type UrlValidationResult =
  | { ok: true; url: URL }
  | { ok: false; error: string };

/**
 * Only https, no obvious SSRF targets. Keep imports safe on the server.
 */
export function validateJobImportUrl(raw: string): UrlValidationResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Please paste a URL." };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, error: "That does not look like a valid URL." };
  }

  if (url.protocol !== "https:") {
    return { ok: false, error: "Only https:// links are allowed." };
  }

  const host = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(host) || isPrivateIpv4(host)) {
    return { ok: false, error: "This URL is not allowed." };
  }

  return { ok: true, url };
}
