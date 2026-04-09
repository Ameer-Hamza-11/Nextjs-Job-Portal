"use server";

import { db } from "@/config/db";
import { favoriteJobs, jobAlerts } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { and, eq } from "drizzle-orm";

export async function createJobAlertAction(filters: any) {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: "ERROR", message: "Unauthorized" };

    await db.insert(jobAlerts).values({
      applicantId: user.id,
      keywords: filters.keywords ?? null,
      location: filters.location ?? null,
      jobType: filters.jobType ?? null,
      workType: filters.workType ?? null,
      minSalary: filters.minSalary ?? null,
      maxSalary: filters.maxSalary ?? null,
      isActive: true
    });

    return { status: "SUCCESS" };
  } catch (error) {
    console.log(error);
    return { status: "ERROR", message: "Server error" };
  }
}



// Add to favorites
export async function toggleFavoriteJobAction(jobId: number) {
  const user = await getCurrentUser();
  if (!user) return { status: "ERROR", message: "Unauthorized" };

  // Check existing favorite
  const existing = await db
    .select()
    .from(favoriteJobs)
    .where(
      and(
        eq(favoriteJobs.jobId, jobId),
        eq(favoriteJobs.applicantId, user.id)
      )
    );

  if (existing.length > 0) {
    // REMOVE favorite
    await db
      .delete(favoriteJobs)
      .where(
        and(
          eq(favoriteJobs.jobId, jobId),
          eq(favoriteJobs.applicantId, user.id)
        )
      );

    return { status: "REMOVED" };
  }

  // ADD favorite
  await db.insert(favoriteJobs).values({
    jobId,
    applicantId: user.id,
  });

  return { status: "ADDED" };
}