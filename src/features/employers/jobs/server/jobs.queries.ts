// src/features/jobs/server/jobs.queries.ts
import { db } from "@/config/db";
import { jobs, employers, users, favoriteJobs } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { eq, and, isNull, desc, or, gte, SQL, like, sql } from "drizzle-orm";

// Define the Interface
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
  console.log("Filters received:", filters);

  const page = filters.page || 1;
  const limit = filters.limit || 9;
  const offset = (page - 1) * limit;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build conditions array
  const conditions: (SQL | undefined)[] = [
    isNull(jobs.deletedAt),
    or(isNull(jobs.expiresAt), gte(jobs.expiresAt, today)),
  ];

  // Apply search filter
  if (filters?.search && filters.search !== "all") {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      or(
        like(jobs.title, searchTerm),
        like(employers.name, searchTerm),
        like(jobs.tags, searchTerm)
      )
    );
  }

  // Apply job type filter
  if (filters?.jobType && filters.jobType !== "all") {
    conditions.push(eq(jobs.jobType, filters.jobType as any));
  }

  // Apply job level filter
  if (filters?.jobLevel && filters.jobLevel !== "all") {
    conditions.push(eq(jobs.jobLevel, filters.jobLevel as any));
  }

  // Apply work type filter
  if (filters?.workType && filters.workType !== "all") {
    conditions.push(eq(jobs.workType, filters.workType as any));
  }

  // Apply location filter
  if (filters?.location && filters.location !== "all" && filters.location !== "") {
    conditions.push(like(jobs.location, `%${filters.location}%`));
  }

  // Apply min salary filter
  if (filters?.minSalary && filters.minSalary > 0) {
    conditions.push(gte(jobs.minSalary, filters.minSalary));
  }

  // Apply max salary filter
  if (filters?.maxSalary && filters.maxSalary > 0) {
    conditions.push(lte(jobs.maxSalary, filters.maxSalary));
  }

  // Get total count for pagination
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(and(...conditions));

  const totalCount = Number(countResult[0]?.count || 0);

  // Get paginated data
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
    .orderBy(desc(jobs.createdAt))
    .limit(limit)
    .offset(offset);

  // Get user's favorite jobs
  const user = await getCurrentUser();
  let favoriteSet = new Set<number>();

  if (user) {
    const favorites = await db
      .select({ jobId: favoriteJobs.jobId })
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

export type JobCardType = Awaited<ReturnType<typeof getAllJobs>>["jobs"][number];

export async function getJobById(jobId: number) {
  const job = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      tags: jobs.tags,
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,
      location: jobs.location,
      jobType: jobs.jobType,
      workType: jobs.workType,
      jobLevel: jobs.jobLevel,
      experience: jobs.experience,
      minEducation: jobs.minEducation,
      createdAt: jobs.createdAt,
      expiresAt: jobs.expiresAt,
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