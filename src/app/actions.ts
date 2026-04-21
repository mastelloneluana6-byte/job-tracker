"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ApplicationStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

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

export async function createApplication(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const roleTitle = String(formData.get("roleTitle") ?? "").trim();
  if (!company || !roleTitle) return;

  const jobUrl = String(formData.get("jobUrl") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const status =
    parseStatus(String(formData.get("status") ?? "APPLIED")) ?? "APPLIED";
  const appliedAtRaw = String(formData.get("appliedAt") ?? "").trim();
  let appliedAt: Date | null = null;
  if (appliedAtRaw) {
    const d = new Date(appliedAtRaw);
    if (!Number.isNaN(d.getTime())) appliedAt = d;
  }

  await prisma.jobApplication.create({
    data: {
      company,
      roleTitle,
      jobUrl,
      notes,
      status,
      appliedAt,
    },
  });
  revalidatePath("/");
}

export async function updateApplication(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const company = String(formData.get("company") ?? "").trim();
  const roleTitle = String(formData.get("roleTitle") ?? "").trim();
  if (!company || !roleTitle) return;

  const jobUrl = String(formData.get("jobUrl") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const status =
    parseStatus(String(formData.get("status") ?? "")) ?? "APPLIED";
  const appliedAtRaw = String(formData.get("appliedAt") ?? "").trim();
  let appliedAt: Date | null = null;
  if (appliedAtRaw) {
    const d = new Date(appliedAtRaw);
    if (!Number.isNaN(d.getTime())) appliedAt = d;
  }

  await prisma.jobApplication.update({
    where: { id },
    data: {
      company,
      roleTitle,
      jobUrl,
      notes,
      status,
      appliedAt,
    },
  });
  revalidatePath("/");
  redirect("/");
}

export async function setApplicationStatus(id: string, status: string) {
  const parsed = parseStatus(status);
  if (!id || !parsed) return;
  await prisma.jobApplication.update({
    where: { id },
    data: { status: parsed },
  });
  revalidatePath("/");
}

export async function deleteApplication(id: string) {
  if (!id) return;
  await prisma.jobApplication.delete({ where: { id } });
  revalidatePath("/");
}
