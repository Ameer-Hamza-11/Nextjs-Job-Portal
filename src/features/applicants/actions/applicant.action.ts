"use server";

import { getCurrentUser } from "@/features/auth/server/auth.queries";
import {
  applicantSettingsSchema,
  ApplicantSettingsSchema,
} from "../applicant.schema";
import { db } from "@/config/db";
import { applicants, employers, favoriteJobs, jobAlerts, jobApplications, jobs, resumes, users } from "@/drizzle/schema";
import { and, count, desc, eq, InferSelectModel, isNull, like, or, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const saveApplicantProfile = async (data: ApplicantSettingsSchema) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: "ERROR", message: "Unauthorized" };

    const { data: validatedData, error } =
      applicantSettingsSchema.safeParse(data);

    if (error) {
      // Return the very first Zod validation error message
      return { status: "ERROR", message: error.issues[0].message };
    }

    const {
      name,
      phoneNumber,
      avatarUrl,
      location,
      dateOfBirth,
      nationality,
      gender,
      maritalStatus,
      education,
      experience,
      websiteUrl,
      biography,
      resumeUrl,
      resumeName,
      resumeSize,
    } = validatedData;

    await db.transaction(async (tx) => {
      // 1. UPDATE the users table (Always an update since the user must exist to be logged in)
      await tx
        .update(users)
        .set({
          name,
          phoneNumber,
          avatarUrl,
        })
        .where(eq(users.id, user.id));

      // 2. UPSERT APPLICANTS TABLE
      const existingApplicant = await tx
        .select()
        .from(applicants)
        .where(eq(applicants.id, user.id))
        .limit(1);

      const applicantData = {
        location,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        nationality,
        gender,
        maritalStatus,
        education,
        experience,
        websiteUrl,
        biography,
      };

      if (existingApplicant.length > 0) {
        // Record exists, UPDATE
        await tx
          .update(applicants)
          .set(applicantData)
          .where(eq(applicants.id, user.id));
      } else {
        // No record, INSERT
        await tx.insert(applicants).values({
          id: user.id, // Foreign key & Primary key
          ...applicantData,
        });
      }

      // 3. UPSERT RESUMES TABLE
      if (resumeName && resumeUrl) {
        const existingResume = await tx
          .select()
          .from(resumes)
          .where(eq(resumes.applicantId, user.id))
          .limit(1);

        const resumeData = {
          fileUrl: resumeUrl,
          fileName: resumeName,
          fileSize: resumeSize,
          isPrimary: true,
        };

        if (existingResume.length > 0) {
          // Update the specific resume ID that we found
          await tx
            .update(resumes)
            .set(resumeData)
            .where(eq(resumes.id, existingResume[0].id));
        } else {
          // Insert a new resume
          await tx.insert(resumes).values({
            applicantId: user.id,
            ...resumeData,
          });
        }
      }
    });

    // Refresh the page so the pre-filled data updates immediately
    revalidatePath("/dashboard/settings");

    return { status: "SUCCESS", message: "Profile saved successfully!" };
  } catch (error) {
    console.error("SAVE PROFILE ERROR:", error);
    return { status: "ERROR", message: "Failed to save Profile." };
  }
};


export interface EmployerFilterParams {
  search?: string;
  organizationType?: string;
}

export interface User {
  id: number;
  name: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null
}
export interface Employer {
  id: number;
  name: string | null;
  description: string | null;
  bannerImageUrl: string | null;
  organizationType: string | null;
  teamSize: string | null;
  yearOfEstablishment: number | null;
  websiteUrl: string | null;
  location: string | null;
}


// export type EmployerType = {
//  data: { users: User, employers:Employer | null }[] 
// }
type GetEmployerReturnType =
  | { status: "SUCCESS", data: { users: User, employers: Employer | null }[] }
  | { status: "ERROR", message: string }
export const getAllEmployersProfileAction = async (filters: EmployerFilterParams): Promise<GetEmployerReturnType> => {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: "ERROR", message: "Unauthorized" };

    const conditions: (SQL | undefined)[] = [
      isNull(employers.deletedAt),

    ];

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`
      conditions.push(
        or(
          like(employers.name, searchTerm),
          like(users.name, searchTerm)
        )
      )
    }


    if (filters?.organizationType && filters.organizationType !== "all") {
      conditions.push(eq(employers.organizationType, filters.organizationType as any));
    }


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allEmployers = await db.select({
      users: {
        id: users.id,
        name: users.name,
        userName: users.userName,

        email: users.email,
        phoneNumber: users.phoneNumber,
        avatarUrl: users.avatarUrl,
      }, employers: {
        id: employers.id,
        name: employers.name,
        description: employers.description,
        bannerImageUrl: employers.bannerImageUrl,
        organizationType: employers.organizationType,
        teamSize: employers.teamSize,
        yearOfEstablishment: employers.yearOfEstablishment,
        websiteUrl: employers.websiteUrl,
        location: employers.location
      }
    }).from(users).leftJoin(employers, eq(users.id, employers.id))
      .where(and(eq(users.role, "employer"), ...conditions))
      .orderBy(desc(employers.createdAt));

    return {
      status: "SUCCESS",
      data: allEmployers,
    };


  } catch (error) {
    console.error("GET EMPLOYERS ERROR:", error);
    return { status: "ERROR", message: "Failed to get Employers." };

  }

}


export const getAllCounts = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: "ERROR", message: "Unauthorized" };

    const totalAppliedJobs = await await db.select({ count: count() }).from(jobApplications).where(eq(jobApplications.applicantId, user.id));

    const totalSavedJobs = await db.select({ count: count() }).from(favoriteJobs).where(eq(favoriteJobs.applicantId, user.id));

    const [jobAlert] = await db.select().from(jobAlerts).where(eq(jobAlerts.applicantId, user.id));
    const totalJobAlerts = await db.select({ count: count() }).from(jobs).where(
      or(
        jobAlert?.keywords ? like(jobs.title, `%${jobAlert.keywords}%`) : undefined,
        jobAlert?.location ? like(jobs.location, `%${jobAlert.location}%`) : undefined,
        jobAlert?.workType ? like(jobs.workType, `%${jobAlert.workType}%`) : undefined,
        jobAlert?.jobType ? like(jobs.jobType, `%${jobAlert.jobType}%`) : undefined,
        jobAlert?.minSalary  ? like(jobs.minSalary, `%${jobAlert.minSalary}%`) : undefined,
        jobAlert?.keywords  ? like(jobs.tags, `%${jobAlert.keywords}%`) : undefined,
      )
    )

    return {
      status: "SUCCESS",
      data: {
        totalAppliedJobs: Number(totalAppliedJobs[0]?.count || 0),
        totalSavedJobs: Number(totalSavedJobs[0]?.count || 0),
        totalJobAlerts: Number(totalJobAlerts[0]?.count || 0)
      }
    }
  } catch (error) {
    console.error("GET COUNTS ERROR:", error);
    return { status: "ERROR", message: "Failed to get counts." };
  }
}


type GetSingleEmployerReturnType =
  | { status: "SUCCESS", data: { users: User, employers: Employer | null } }
  | { status: "ERROR", message: string }
export const getEmployerProfileAction = async (employerId: string): Promise<GetSingleEmployerReturnType> => {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: "ERROR", message: "Unauthorized" };

    const [empoyerProfile] = await db.select({
      users: {
        id: users.id,
        name: users.name,
        userName: users.userName,

        email: users.email,
        phoneNumber: users.phoneNumber,
        avatarUrl: users.avatarUrl,
      }, employers: {
        id: employers.id,
        name: employers.name,
        description: employers.description,
        bannerImageUrl: employers.bannerImageUrl,
        organizationType: employers.organizationType,
        teamSize: employers.teamSize,
        yearOfEstablishment: employers.yearOfEstablishment,
        websiteUrl: employers.websiteUrl,
        location: employers.location
      }
    }).from(users).leftJoin(employers, eq(users.id, employers.id)).where(and(eq(users.id, Number(employerId)), eq(users.role, "employer"))).limit(1);

    if (!empoyerProfile) {
      return { status: "ERROR", message: "Employer not found." };
    }


    return {
      status: "SUCCESS",
      data: empoyerProfile,
    };

  } catch (error) {
    console.error("GET Employer profile ERROR:", error);
    return { status: "ERROR", message: "Failed to get employer." };

  }
}

