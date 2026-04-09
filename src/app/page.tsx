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

type CurrentUserType = Awaited<ReturnType<typeof getCurrentUser>>; // user | null

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

  // ROLE BASED RENDER
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
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-white py-24 border-b">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Hire Top Talent Faster
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Post jobs, manage applicants, and grow your company with ease.
          </p>

          <Link href="/employer-dashboard/jobs/create">
            <Button size="lg" className="px-10 rounded-full">Post a Job</Button>
          </Link>
        </div>
      </section>

      {/* RECENT JOBS */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold mb-8">Your Recent Job Posts</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map(({ job }) => (
              <Card key={job.id}>
                <CardContent className="p-6 space-y-2">
                  <h3 className="font-semibold text-xl">{job.title}</h3>
                  <p className="text-gray-500 flex items-center gap-2">
                    <MapPin className="w-4" /> {job.location}
                  </p>

                  <Button variant="outline" className="mt-4" asChild>
                    <Link href={`/jobs/${job.id}`}>Manage Job</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-gray-50 py-20 lg:py-32">
          <div className="container mx-auto max-w-7xl px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Find a job that suits <br className="hidden md:block" />
              your interest & skills.
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              Discover thousands of job opportunities with top companies.
            </p>

            <form
              action="/jobs"
              method="GET"
              className="max-w-3xl mx-auto bg-white p-2 rounded-full shadow-lg flex flex-col sm:flex-row items-center gap-2 border"
            >
              <div className="flex-1 flex items-center pl-4 w-full">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  name="search"
                  type="text"
                  placeholder="Job title, keyword..."
                  className="border-0 focus-visible:ring-0 shadow-none text-base"
                />
              </div>
              <Button type="submit" size="lg" className="w-full sm:w-auto rounded-full px-8">
                Search Jobs
              </Button>
            </form>
          </div>
        </section>

        {/* FEATURED JOBS */}
        <section className="py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
                <p className="text-gray-500 mt-2">Find the right job for you</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/jobs">View All</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map(({ job, employer }) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex gap-4 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-50 border flex items-center justify-center overflow-hidden relative shrink-0">
                        {employer?.bannerImageUrl ? (
                          <Image src={employer.bannerImageUrl} alt="Logo" fill className="object-cover" />
                        ) : (
                          <Building2 className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{job.jobType}</Badge>
                          <span>• {formatDistanceToNow(new Date(job.createdAt))} ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                      <p className="flex gap-2"><MapPin className="w-4 h-4" /> {job.location || "Remote"}</p>
                      <p className="flex gap-2"><Building2 className="w-4 h-4" /> {employer?.name}</p>
                    </div>

                    <Button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
                      <Link href={`/jobs/${job.id}`}>Apply Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12 text-center">
        © {new Date().getFullYear()} Built by Ameer Hamza.
      </footer>
    </div>
  );
}