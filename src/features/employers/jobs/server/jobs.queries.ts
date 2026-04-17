// src/features/jobs/server/jobs.queries.ts
import { db } from "@/config/db";
import { jobs, employers, users, favoriteJobs } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { eq, and, isNull, desc, or, gte, SQL, like, sql } from "drizzle-orm";

// 2. Define the Interface
export type JobFilterParams = {
  search?: string;
  jobType?: string;
  jobLevel?: string;
  workType?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  page?: number;
  limit?: number;
};

export async function getAllJobs(filters: JobFilterParams) {
  const page = filters.page || 1;
  const limit = filters.limit || 9;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [isNull(jobs.deletedAt)];

  const countResult = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(jobs)
    .where(and(...conditions));

  const totalCount = Number(countResult[0]?.count || 0);

  const jobsData = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,
      location: jobs.location,
      jobType: jobs.jobType,
      workType: jobs.workType,
      createdAt: jobs.createdAt,
      companyName: employers.name,
      companyLogo: users.avatarUrl,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(jobs.createdAt));

  // current user
  const user = await getCurrentUser();

  let favoriteSet = new Set<number>();

  if (user) {
    const favorites = await db
      .select({
        jobId: favoriteJobs.jobId,
      })
      .from(favoriteJobs)
      .where(eq(favoriteJobs.applicantId, user.id));

    favoriteSet = new Set(favorites.map((fav) => fav.jobId));
  }

  return {
    jobs: jobsData.map((job) => ({
      ...job,
      isFavorite: favoriteSet.has(job.id),
    })),
    totalCount,
  };
}

// Helper function for lte (less than or equal)
function lte(column: any, value: number) {
  return sql`${column} <= ${value}`;
}

// Ensure the type only extracts the job object shape for JobCards
export type JobCardType = Awaited<ReturnType<typeof getAllJobs>>["jobs"][number];

/**
 * Get a Single Job by ID with full details
 * Purpose: For the Single Job Details Page (/jobs/[id])
 */
export async function getJobById(jobId: number) {
  const job = await db
    .select({
      // Basic Info
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      tags: jobs.tags,

      // Salary Details
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,

      // Job Meta Data
      location: jobs.location,
      jobType: jobs.jobType,
      workType: jobs.workType,
      jobLevel: jobs.jobLevel,
      experience: jobs.experience,
      minEducation: jobs.minEducation,

      // Timestamps
      createdAt: jobs.createdAt,
      expiresAt: jobs.expiresAt,

      // Employer Info
      companyLogo: users.avatarUrl,
      companyName: employers.name,
      companyBio: employers.description,
      companyWebsite: employers.websiteUrl,
      companyLocation: employers.location,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(eq(jobs.id, jobId))
    .limit(1);

  return job[0];
}

export type JobDetailsType = Awaited<ReturnType<typeof getJobById>>;