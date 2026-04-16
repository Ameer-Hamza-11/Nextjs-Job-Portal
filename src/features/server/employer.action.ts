"use server";

import { db } from "@/config/db";
import { getCurrentUser } from "../auth/server/auth.queries";
import { employers, jobApplications, jobs, users } from "@/drizzle/schema";
import { eq, and, isNull, desc, or, gte, SQL, like, sql, count, inArray } from "drizzle-orm";
import { EmployerProfileData } from "../employers/employers.schema";

// const organizationTypeOptions = [
//   "development",
//   "business",
//   "design",  
//   "android dev",
//   "cloud business",
// ] as const;
// type OrganizationType = (typeof organizationTypeOptions)[number];

// const teamSizeOptions = ["1-5", "6-20", "21-50"] as const;
// type TeamSize = (typeof teamSizeOptions)[number];

// interface IFormInput {
//   name: string;
//   description: string;
//   yearOfEstablishment: string;
//   location: string;
//   websiteUrl: string;
//   organizationType: OrganizationType;
//   teamSize: TeamSize;
// }

export const updateEmployerProfileAction = async (
  data: EmployerProfileData
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    const {
      name,
      description,
      yearOfEstablishment,
      location,
      websiteUrl,
      organizationType,
      teamSize,
      avatarUrl,
      bannerImageUrl,
    } = data;

    const updatedEmployer = await db
      .update(employers)
      .set({
        name,
        description,
        location,
        websiteUrl,
        organizationType,
        teamSize,
        bannerImageUrl,
        yearOfEstablishment: yearOfEstablishment
          ? parseInt(yearOfEstablishment)
          : null,
      })
      .where(eq(employers.id, currentUser.id));

    console.log("employers ", updatedEmployer);

    await db
      .update(users)
      .set({
        avatarUrl,
      })
      .where(eq(users.id, currentUser.id));

    return { status: "SUCCESS", message: "Profile updated successfully" };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Something went wrong, please try again",
    };
  }
};



export const getAllCounts = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return { status: "ERROR", message: "Unauthorized" };

    const employerJobs = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(eq(jobs.employerId, user.id));

    const jobIds = employerJobs.map(j => j.id);

    if (jobIds.length === 0) {
      return {
        totalEmployerJobs: 0,
        totalApplications: 0,
      };
    }


    const totalEmployerJobs = employerJobs.length;
    const totalApplications = await db
      .select({ count: count() })
      .from(jobApplications)
      .where(inArray(jobApplications.jobId, jobIds));
    return {
      status: "SUCCESS",
      data: {
        totalEmployerJobs: Number(totalEmployerJobs || 0),
        totalApplications: Number(totalApplications[0]?.count || 0),

      }
    }
  } catch (error) {
    console.error("GET COUNTS ERROR:", error);
    return { status: "ERROR", message: "Failed to get counts." };
  }
}
type deleteApplicationResponse = 
{status: "SUCCESS", message: string} | {status: "ERROR", message: string}
export const deleteApplicationAction = async (applicantId: number):Promise<deleteApplicationResponse> => {
  try {

    const user = await getCurrentUser();
    if (!user) return { status: "ERROR", message: "Unauthorized" };


    const [application] = await db.select().from(jobApplications).where(and(
      eq(jobApplications.applicantId, applicantId),
    ))
    if (!application) {
      return { status: "ERROR", message: "Application Not found" };
    }

    await db.delete(jobApplications).where(eq(jobApplications.id, application.id))    

    return { status: "SUCCESS", message: "application deleted successfully" }
  } catch (error) {
    console.error("delete Employer profile ERROR:", error);
    return { status: "ERROR", message: "Failed to get employer." };
  }

}