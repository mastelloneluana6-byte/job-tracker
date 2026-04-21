import { NextResponse } from "next/server";
import {
  extractJobPreview,
  fetchJobPageHtml,
} from "@/lib/job-import/scrape-job-url";
import { validateJobImportUrl } from "@/lib/job-import/validate-job-url";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string };
    const rawUrl = typeof body.url === "string" ? body.url : "";
    const validated = validateJobImportUrl(rawUrl);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const html = await fetchJobPageHtml(validated.url.toString());
    const preview = extractJobPreview(html, validated.url.toString());
    return NextResponse.json({ preview });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Import failed.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
