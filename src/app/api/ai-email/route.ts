import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const emailTypes = ["follow-up", "thank-you", "cold-outreach"] as const;
const tones = ["formal", "friendly"] as const;

type EmailType = (typeof emailTypes)[number];
type Tone = (typeof tones)[number];

type ErrorMeta = {
  error: string;
  status: number;
  code?: string;
};

function buildPrompt(input: {
  company: string;
  roleTitle: string;
  recruiterName: string | null;
  emailType: EmailType;
  tone: Tone;
}) {
  const who = input.recruiterName
    ? `Address the recruiter by name (${input.recruiterName}) once in the greeting if natural.`
    : "Use a polite generic greeting (no invented names).";

  const typeHint =
    input.emailType === "follow-up"
      ? "Purpose: follow up after applying or after a conversation; concise; one clear ask or next step."
      : input.emailType === "thank-you"
        ? "Purpose: thank them for their time or for an interview; warm but professional."
        : "Purpose: brief cold outreach expressing genuine interest in the role and company; no hard sell.";

  const toneHint =
    input.tone === "formal"
      ? "Tone: formal, professional, plain language. No slang."
      : "Tone: friendly, conversational, still professional.";

  return `You write emails for a job seeker.

${typeHint}
${toneHint}
${who}

Context:
- Company: ${input.company}
- Role: ${input.roleTitle}

Rules:
- Output ONLY the email body (no subject line, no markdown fences).
- 120–220 words unless a shorter note clearly fits better.
- Sound human: vary sentence length, avoid buzzword soup, no "I hope this email finds you well".
- Do not invent facts (interview dates, offers, internal names).
- Sign off with a simple closing and the placeholder "Your name" on its own line.`;
}

function toErrorMeta(error: unknown): ErrorMeta {
  if (error instanceof OpenAI.APIError) {
    const code = error.code ? String(error.code) : undefined;
    if (code === "insufficient_quota") {
      return {
        error:
          "OpenAI quota is exceeded. Add billing/credits in your OpenAI account, then retry.",
        status: 429,
        code,
      };
    }
    if (error.status === 401) {
      return {
        error:
          "OpenAI rejected the API key (401). Check OPENAI_API_KEY in Vercel and local .env.",
        status: 401,
        code,
      };
    }
    if (error.status === 404 || code === "model_not_found") {
      return {
        error:
          "Selected model was not found. Set OPENAI_MODEL to an available model (for example: gpt-4o-mini).",
        status: 400,
        code,
      };
    }
    return {
      error: error.message || "OpenAI request failed.",
      status: error.status ?? 502,
      code,
    };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return {
      error: (error as { message: string }).message,
      status: 500,
    };
  }

  return {
    error: "Something went wrong calling OpenAI.",
    status: 500,
  };
}

export async function POST(req: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not configured. Add it in .env locally and in Vercel project settings.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await req.json()) as {
      company?: string;
      roleTitle?: string;
      recruiterName?: string | null;
      emailType?: string;
      tone?: string;
    };

    const company = String(body.company ?? "").trim();
    const roleTitle = String(body.roleTitle ?? "").trim();
    if (!company || !roleTitle) {
      return NextResponse.json(
        { error: "Company and role are required." },
        { status: 400 },
      );
    }

    const emailType = (emailTypes as readonly string[]).includes(
      String(body.emailType),
    )
      ? (body.emailType as EmailType)
      : "follow-up";
    const tone = (tones as readonly string[]).includes(String(body.tone))
      ? (body.tone as Tone)
      : "friendly";

    const recruiterName =
      typeof body.recruiterName === "string" && body.recruiterName.trim()
        ? body.recruiterName.trim()
        : null;

    const client = new OpenAI({ apiKey: key });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: buildPrompt({
            company,
            roleTitle,
            recruiterName,
            emailType,
            tone,
          }),
        },
      ],
      temperature: 0.75,
      max_tokens: 600,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json(
        { error: "The model returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ email: text });
  } catch (e) {
    const meta = toErrorMeta(e);
    return NextResponse.json(
      { error: meta.error, code: meta.code ?? null },
      { status: meta.status },
    );
  }
}
