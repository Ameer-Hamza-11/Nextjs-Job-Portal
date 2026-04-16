import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Clock, Building2, Briefcase, PenSquare, Eye } from "lucide-react";

import { getJobById } from "@/features/employers/jobs/server/jobs.queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import JobOverviewSidebar from "@/features/applicants/jobs/components/jobOverviewSidebar";

import { db } from "@/config/db";
import { jobApplications, resumes } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import Link from "next/link";
import { ApplyJobModal } from "@/features/applicants/jobs/components/apply-job-modal";

interface EditJobPageProps {
  params: { jobId: string };
}

const JobsDetailedPage = async ({ params }: EditJobPageProps) => {
  const jobId = parseInt(params.jobId);
  if (isNaN(jobId)) return notFound();

  const job = await getJobById(jobId);
  if (!job) return notFound();

  const user = await getCurrentUser();
  let hasApplied = false;
  let userResumes: { id: number; fileName: string }[] = [];

  if (user && user.role === "applicant") {
    const existingApplication = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.jobId, jobId),
          eq(jobApplications.applicantId, user.id)
        )
      )
      .limit(1);

    hasApplied = existingApplication.length > 0;

    userResumes = await db
      .select({ id: resumes.id, fileName: resumes.fileName })
      .from(resumes)
      .where(eq(resumes.applicantId, user.id));
  }

  // Clean and prepare description to prevent horizontal scrolling
  const cleanedDescription =
    job.description
      ?.replace(/<table[^>]*>/gi, '<div class="overflow-x-auto"><table>')
      ?.replace(/<\/table>/gi, "</table></div>") || "";

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between border-b pb-6 sm:pb-8">
        <div className="flex gap-4 sm:gap-5">
          {/* Company Logo */}
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl border bg-gray-50">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={job.companyName || "Company"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-base sm:text-lg font-bold text-gray-400">
                {job.companyName?.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Job Title & Info */}
          <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 break-words">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-gray-500">
              <span className="font-medium text-blue-600 flex items-center gap-1">
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                  {job.companyName}
                </span>
              </span>
              <span className="hidden xs:inline text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[200px]">
                  {job.location || "Remote"}
                </span>
              </span>
              <span className="hidden xs:inline text-gray-300">•</span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>
                  Posted{" "}
                  {formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button - Different for different user roles */}
        <div className="flex gap-3 w-full sm:w-auto mt-4 lg:mt-0">
          {!user && (
            <Button
              size="lg"
              className="w-full sm:w-auto font-semibold"
              asChild
            >
              <Link href="/login">Login to Apply</Link>
            </Button>
          )}
          
          {user?.role === "applicant" && (
            <ApplyJobModal
              jobId={jobId}
              jobTitle={job.title}
              hasApplied={hasApplied}
              resumes={userResumes}
            />
          )}
          
          {user?.role === "employer" && (
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto font-semibold gap-2"
              asChild
            >
              <Link href={`/employer-dashboard/jobs/${jobId}/edit`}>
                <PenSquare className="w-4 h-4" />
                Edit Job
              </Link>
            </Button>
          )}
          
          {user?.role === "admin" && (
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto font-semibold gap-2"
              asChild
            >
              <Link href={`/admin/jobs/${jobId}`}>
                <Eye className="w-4 h-4" />
                Manage Job
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Job Description */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              About the Job
            </h2>
            <div className="job-description-wrapper">
              <div
                className="job-description prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-600 leading-relaxed break-words [&_*]:break-words [&_*]:whitespace-normal [&_pre]:whitespace-pre-wrap [&_code]:break-words [&_table]:block [&_table]:w-full [&_td]:break-words [&_th]:break-words"
                dangerouslySetInnerHTML={{ __html: cleanedDescription }}
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              />
            </div>
          </section>

          {/* Tags/Skills */}
          {job.tags && (
            <section className="pt-2 sm:pt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 uppercase tracking-wider">
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {job.tags.split(",").map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm"
                  >
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <JobOverviewSidebar job={job} />
      </div>
    </div>
  );
};

export default JobsDetailedPage;