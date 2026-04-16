import Link from "next/link";
import Image from "next/image";
import { MapPin, CheckCircle2, ArrowRight, Building2, Calendar, Briefcase } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { getAppliedJobsForApplicant } from "@/features/applicants/server/applicant.queries";
import { redirect } from "next/navigation";

export async function RecentApplications() {
  const user = await getCurrentUser();
  if (!user) return redirect("/login");

  const allApplications = await getAppliedJobsForApplicant(user.id);

  const recentApplications = allApplications.slice(0, 5);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
          Recently Applied
        </h3>
        <Link
          href="/dashboard/applied-jobs"
          className="text-xs sm:text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Link>
      </div>

      {recentApplications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          You haven't applied to any jobs yet.
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="w-[40%] pl-6">Job</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((app) => {
                  const { application, job, employer } = app;

                  return (
                    <TableRow key={application.id} className="hover:bg-gray-50">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500 overflow-hidden border">
                            {employer?.bannerImageUrl ? (
                              <Image
                                src={employer.bannerImageUrl}
                                alt={employer.name || "Company"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Building2 className="h-5 w-5 text-gray-400" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 line-clamp-1">
                                {job.title}
                              </span>
                              <Badge className="rounded-full px-2 py-0.5 text-[10px] font-normal border-0 bg-blue-100 text-blue-700 hover:bg-blue-100 whitespace-nowrap">
                                {job.jobType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />{" "}
                                {job.location || "Remote"}
                              </span>
                              {(job.minSalary || job.maxSalary) && (
                                <span>
                                  {job.salaryCurrency} {job.minSalary}-
                                  {job.maxSalary}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-gray-500">
                        {format(new Date(application.appliedAt), "MMM d, yyyy")}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          Applied
                        </div>
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium"
                          asChild
                        >
                          <Link href={`/jobs/${job.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile/Tablet Card View - Visible on small screens */}
          <div className="block md:hidden divide-y divide-gray-100">
            {recentApplications.map((app) => {
              const { application, job, employer } = app;

              return (
                <Card key={application.id} className="border-0 rounded-none shadow-none">
                  <CardContent className="p-4 space-y-3">
                    {/* Company Logo and Title */}
                    <div className="flex gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 overflow-hidden border">
                        {employer?.bannerImageUrl ? (
                          <Image
                            src={employer.bannerImageUrl}
                            alt={employer.name || "Company"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base">
                            {job.title}
                          </h4>
                          <Badge className="rounded-full px-2 py-0.5 text-[10px] font-normal border-0 bg-blue-100 text-blue-700 whitespace-nowrap shrink-0">
                            {job.jobType}
                          </Badge>
                        </div>
                        
                        {/* Company Name */}
                        {employer?.name && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {employer.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location || "Remote"}
                        </span>
                        {(job.minSalary || job.maxSalary) && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.salaryCurrency} {job.minSalary}-{job.maxSalary}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-green-600 font-medium text-xs sm:text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Applied</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(application.appliedAt), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium mt-2"
                      asChild
                    >
                      <Link href={`/jobs/${job.id}`}>
                        View Details
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}