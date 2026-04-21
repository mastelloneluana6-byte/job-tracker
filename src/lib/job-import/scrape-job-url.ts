import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";

export type JobPreview = {
  company: string;
  roleTitle: string;
  location: string;
  description: string;
  jobUrl: string;
  confidence: "high" | "low";
};

function meta($: CheerioAPI, prop: string): string {
  const v =
    $(`meta[property="${prop}"]`).attr("content") ??
    $(`meta[name="${prop}"]`).attr("content") ??
    "";
  return v.replace(/\s+/g, " ").trim();
}

/** Flatten JSON-LD roots (arrays, @graph wrappers). */
function iterJsonLdNodes(data: unknown): unknown[] {
  if (data === null || data === undefined) return [];
  if (Array.isArray(data)) {
    return data.flatMap(iterJsonLdNodes);
  }
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o["@graph"])) {
      return o["@graph"].flatMap(iterJsonLdNodes);
    }
    return [data];
  }
  return [];
}

function parseJsonLdJobPosting($: CheerioAPI): Partial<JobPreview> | null {
  const scripts = $('script[type="application/ld+json"]');
  for (let i = 0; i < scripts.length; i++) {
    const raw = $(scripts[i]).html();
    if (!raw) continue;
    let data: unknown;
    try {
      data = JSON.parse(raw) as unknown;
    } catch {
      continue;
    }
    const items = iterJsonLdNodes(data);
    for (const item of items) {
      if (!item || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      const type = o["@type"];
      const types = Array.isArray(type) ? type : [type];
      if (!types.some((t) => t === "JobPosting")) continue;

      const title = typeof o.title === "string" ? o.title : "";
      const nameFromHiring =
        o.hiringOrganization &&
        typeof o.hiringOrganization === "object" &&
        o.hiringOrganization !== null &&
        typeof (o.hiringOrganization as { name?: string }).name === "string"
          ? (o.hiringOrganization as { name: string }).name
          : "";
      let location = "";
      const jl = o.jobLocation;
      if (typeof jl === "object" && jl !== null) {
        const addr = (jl as { address?: unknown }).address;
        if (typeof addr === "object" && addr !== null) {
          const a = addr as { addressLocality?: string; addressRegion?: string };
          location = [a.addressLocality, a.addressRegion].filter(Boolean).join(", ");
        }
      }
      const desc =
        typeof o.description === "string"
          ? o.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 4000)
          : "";

      if (title || nameFromHiring) {
        return {
          roleTitle: title,
          company: nameFromHiring,
          location,
          description: desc,
        };
      }
    }
  }
  return null;
}

function splitTitleAtCompany(title: string): { role: string; company: string } {
  const t = title.replace(/\s+/g, " ").trim();
  const parts = t.split(/\s+at\s+/i);
  if (parts.length >= 2) {
    return { role: parts[0]!.trim(), company: parts.slice(1).join(" at ").trim() };
  }
  const dash = t.split(/\s+[—-]\s+/);
  if (dash.length >= 2) {
    return { role: dash[0]!.trim(), company: dash.slice(1).join(" — ").trim() };
  }
  return { role: t, company: "" };
}

/**
 * Best-effort extraction from listing HTML. User should always confirm in UI.
 */
export function extractJobPreview(html: string, jobUrl: string): JobPreview {
  const $ = cheerio.load(html);

  const fromLd = parseJsonLdJobPosting($);
  const ogTitle = meta($, "og:title") || $("title").first().text().trim();
  const ogSite = meta($, "og:site_name");
  const ogDesc =
    meta($, "og:description") ||
    meta($, "description") ||
    $("meta[name='description']").attr("content")?.trim() ||
    "";

  let company = (fromLd?.company ?? ogSite ?? "").trim();
  let roleTitle = (fromLd?.roleTitle ?? "").trim();
  const location = (fromLd?.location ?? "").trim();
  const description = (fromLd?.description ?? ogDesc).trim();

  if (!roleTitle && ogTitle) {
    const split = splitTitleAtCompany(ogTitle);
    roleTitle = split.role;
    if (!company) company = split.company;
  }

  if (!company && ogTitle && !roleTitle) {
    const split = splitTitleAtCompany(ogTitle);
    roleTitle = split.role;
    company = split.company;
  }

  const confidence: JobPreview["confidence"] =
    fromLd?.roleTitle && fromLd?.company ? "high" : roleTitle || company ? "low" : "low";

  return {
    company,
    roleTitle,
    location,
    description: description.slice(0, 8000),
    jobUrl,
    confidence,
  };
}

export async function fetchJobPageHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  const res = await fetch(url, {
    signal: controller.signal,
    redirect: "follow",
    headers: {
      "User-Agent":
        "ScopeJobTracker/1.0 (+https://github.com/mastelloneluana6-byte/job-tracker)",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  clearTimeout(timeout);

  if (!res.ok) {
    throw new Error(`Could not load page (HTTP ${res.status}).`);
  }

  const len = Number(res.headers.get("content-length") ?? 0);
  if (len > 2_000_000) {
    throw new Error("Page is too large to import.");
  }

  const text = await res.text();
  if (text.length > 2_000_000) {
    throw new Error("Page is too large to import.");
  }
  return text;
}
