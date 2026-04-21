"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ApplicationStatus } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/prisma";

const STATUSES: ApplicationStatus[] = [
  "WISHLIST",
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

function parseStatus(value: string): ApplicationStatus | null {
  return STATUSES.includes(value as ApplicationStatus)
    ? (value as ApplicationStatus)
    : null;
}

function optionalString(formData: FormData, key: string): string | null {
  const v = String(formData.get(key) ?? "").trim();
  return v || null;
}

export async function createApplication(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const roleTitle = String(formData.get("roleTitle") ?? "").trim();
  if (!company || !roleTitle) return;

  const jobUrl = optionalString(formData, "jobUrl");
  const notes = optionalString(formData, "notes");
  const location = optionalString(formData, "location");
  const description = optionalString(formData, "description");
  const recruiterName = optionalString(formData, "recruiterName");
  const status =
    parseStatus(String(formData.get("status") ?? "APPLIED")) ?? "APPLIED";
  const appliedAtRaw = String(formData.get("appliedAt") ?? "").trim();
  let appliedAt: Date | null = null;
  if (appliedAtRaw) {
    const d = new Date(appliedAtRaw);
    if (!Number.isNaN(d.getTime())) appliedAt = d;
  }

  await getPrisma().jobApplication.create({
    data: {
      company,
      roleTitle,
      jobUrl,
      notes,
      location,
      description,
      recruiterName,
      status,
      appliedAt,
    },
  });
  revalidatePath("/");
  revalidatePath("/tracker");
}

export async function updateApplication(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const company = String(formData.get("company") ?? "").trim();
  const roleTitle = String(formData.get("roleTitle") ?? "").trim();
  if (!company || !roleTitle) return;

  const jobUrl = optionalString(formData, "jobUrl");
  const notes = optionalString(formData, "notes");
  const location = optionalString(formData, "location");
  const description = optionalString(formData, "description");
  const recruiterName = optionalString(formData, "recruiterName");
  const status =
    parseStatus(String(formData.get("status") ?? "")) ?? "APPLIED";
  const appliedAtRaw = String(formData.get("appliedAt") ?? "").trim();
  let appliedAt: Date | null = null;
  if (appliedAtRaw) {
    const d = new Date(appliedAtRaw);
    if (!Number.isNaN(d.getTime())) appliedAt = d;
  }

  await getPrisma().jobApplication.update({
    where: { id },
    data: {
      company,
      roleTitle,
      jobUrl,
      notes,
      location,
      description,
      recruiterName,
      status,
      appliedAt,
    },
  });
  revalidatePath("/");
  revalidatePath("/tracker");
  redirect("/tracker");
}

export async function setApplicationStatus(id: string, status: string) {
  const parsed = parseStatus(status);
  if (!id || !parsed) return;
  await getPrisma().jobApplication.update({
    where: { id },
    data: { status: parsed },
  });
  revalidatePath("/");
  revalidatePath("/tracker");
}

export async function deleteApplication(id: string) {
  if (!id) return;
  await getPrisma().jobApplication.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/tracker");
}

export async function markFollowUpSent(id: string) {
  if (!id) return;
  await getPrisma().jobApplication.update({
    where: { id },
    data: { followUpSentAt: new Date() },
  });
  revalidatePath("/");
  revalidatePath("/tracker");
}
