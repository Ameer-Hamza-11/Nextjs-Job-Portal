import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Building2, ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { db } from "@/config/db";
import { jobs, employers } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";
import { getCurrentUser } from "@/features/auth/server/auth.queries";

type CurrentUserType = Awaited<ReturnType<typeof getCurrentUser>>;

type FeaturedJobType = {
  job: typeof jobs.$inferSelect;
  employer: typeof employers.$inferSelect | null;
};

async function getFeaturedJobs() {
  return await db
    .select({ job: jobs, employer: employers })
    .from(jobs)
    .leftJoin(employers, eq(jobs.employerId, employers.id))
    .orderBy(desc(jobs.createdAt))
    .limit(6);
}

export default async function HomePage() {
  const featuredJobs = await getFeaturedJobs();
  const user = await getCurrentUser();

  if (user?.role === "employer") {
    return <EmployerHome user={user} jobs={featuredJobs} />;
  }

  return <ApplicantHome user={user} jobs={featuredJobs} />;
}

function EmployerHome({
  user,
  jobs,
}: {
  user: CurrentUserType;
  jobs: FeaturedJobType[];
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HERO SECTION */}
      <section className="bg-white py-16 sm:py-20 md:py-24 lg:py-32 border-b">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Hire Top Talent Faster
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Post jobs, manage applicants, and grow your company with ease.
          </p>

          <Link href="/employer-dashboard/jobs/create">
            <Button 
              size="lg" 
              className="px-6 sm:px-8 md:px-10 rounded-full text-sm sm:text-base h-11 sm:h-12 md:h-14"
            >
              Post a Job
            </Button>
          </Link>
        </div>
      </section>

      {/* RECENT JOBS SECTION */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-gray-900">
            Your Recent Job Posts
          </h2>

          {jobs.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg">
              <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No jobs posted yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start hiring by posting your first job
              </p>
              <Link href="/employer-dashboard/jobs/create">
                <Button>Post Your First Job</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map(({ job }) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <h3 className="font-semibold text-lg sm:text-xl line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex items-start gap-2 text-gray-500 text-sm sm:text-base">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{job.location || "Remote"}</span>
                    </div>
                    <Button variant="outline" className="w-full mt-2 sm:mt-4" asChild>
                      <Link href={`/jobs/${job.id}`}>Manage Job</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ApplicantHome({
  user,
  jobs,
}: {
  user: CurrentUserType;
  jobs: FeaturedJobType[];
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">
                Find a job that suits
                <br className="hidden sm:block" />
                your interest & skills.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
                Discover thousands of job opportunities with top companies.
              </p>

              <form
                action="/jobs"
                method="GET"
                className="max-w-3xl mx-auto bg-white p-2 sm:p-3 rounded-full shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 border"
              >
                <div className="flex-1 flex items-center px-3 sm:px-4 w-full">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <Input
                    name="search"
                    type="text"
                    placeholder="Job title, keyword..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-sm sm:text-base h-10 sm:h-12"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto rounded-full px-4 sm:px-6 md:px-8 h-10 sm:h-12 text-sm sm:text-base"
                >
                  Search Jobs
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* FEATURED JOBS SECTION */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 md:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Featured Jobs
                </h2>
                <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                  Find the right job for you
                </p>
              </div>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/jobs" className="flex items-center gap-2">
                  View All Jobs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Jobs Grid */}
            {jobs.length === 0 ? (
              <div className="text-center py-12 sm:py-16 md:py-20 bg-gray-50 rounded-lg">
                <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  No jobs available
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  Check back later for new opportunities
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map(({ job, employer }) => (
                  <Card 
                    key={job.id} 
                    className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100"
                  >
                    <CardContent className="p-4 sm:p-5 md:p-6">
                      {/* Header with Logo */}
                      <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-5">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gray-50 border flex items-center justify-center overflow-hidden relative shrink-0">
                          {employer?.bannerImageUrl ? (
                            <Image 
                              src={employer.bannerImageUrl} 
                              alt={employer.name || "Company logo"} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg md:text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs sm:text-sm">
                              {job.jobType}
                            </Badge>
                            <span className="text-xs sm:text-sm text-gray-400">•</span>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="space-y-2 sm:space-y-2.5 text-sm sm:text-base text-gray-600 mb-4 sm:mb-5 md:mb-6">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2 text-xs sm:text-sm">
                            {job.location || "Remote"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">
                            {employer?.name || "Company"}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-sm sm:text-base h-10 sm:h-11"
                        asChild
                      >
                        <Link href={`/jobs/${job.id}`}>Apply Now</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* View More Button for Mobile */}
            {jobs.length > 0 && (
              <div className="mt-8 sm:mt-10 text-center lg:hidden">
                <Button variant="outline" asChild>
                  <Link href="/jobs" className="flex items-center gap-2">
                    View All Jobs
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-10 md:py-12 text-center px-4">
        <div className="container mx-auto max-w-7xl">
          <p className="text-sm sm:text-base">
            © {new Date().getFullYear()} Built by Ameer Hamza. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}