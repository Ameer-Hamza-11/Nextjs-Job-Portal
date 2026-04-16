"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobDetailsType } from "@/features/employers/jobs/server/jobs.queries";
import {
  Briefcase,
  GraduationCap,
  Globe,
  CalendarDays,
  Clock,
  MapPin,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

interface JobSidebarProps {
  job: NonNullable<JobDetailsType>;
}

const JobOverviewSidebar = ({ job }: JobSidebarProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format salary consistently
  const salaryDisplay =
    job.minSalary && job.maxSalary
      ? `${job.salaryCurrency || 'USD'} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`
      : "Not Disclosed";

  // Format date consistently (not locale-dependent) - accepts Date object
  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Job Overview Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">
            Job Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-5 pt-4 sm:pt-6">
          <OverviewItem
            icon={<DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />}
            label="Salary"
            value={salaryDisplay}
            mounted={mounted}
          />

          <OverviewItem
            icon={<Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />}
            label="Job Type"
            value={job.jobType?.replace(/-/g, " ")}
            mounted={mounted}
          />

          <OverviewItem
            icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />}
            label="Work Type"
            value={job.workType?.replace(/-/g, " ")}
            mounted={mounted}
          />

          <OverviewItem
            icon={<GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />}
            label="Experience Level"
            value={job.jobLevel?.replace(/-/g, " ")}
            mounted={mounted}
          />

          <OverviewItem
            icon={<GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />}
            label="Education"
            value={job.minEducation?.replace(/-/g, " ")}
            mounted={mounted}
          />

          {job.expiresAt && (
            <OverviewItem
              icon={<CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />}
              label="Application Deadline"
              value={formatDate(job.expiresAt)}
              mounted={mounted}
            />
          )}
        </CardContent>
      </Card>

      {/* Company Snippet Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">
            About the Company
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
          <div 
            className="text-xs sm:text-sm text-gray-600 prose prose-sm max-w-none break-words"
            dangerouslySetInnerHTML={{
              __html: job.companyBio || "No company description available.",
            }}
          />

          {job.companyWebsite && (
            <Link
              href={job.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit company website (opens in new tab)"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Visit Website
              <span className="text-xs">(opens in new tab)</span>
            </Link>
          )}

          {/* Company Location if available */}
          {job.location && (
            <div className="flex items-start gap-2 pt-2 border-t">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 mt-0.5" />
              <span className="text-xs sm:text-sm text-gray-600">
                {job.location}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobOverviewSidebar;

// Helper Component for Sidebar Items
function OverviewItem({
  icon,
  label,
  value,
  mounted,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  mounted: boolean;
}) {
  if (!value) return null;
  
  // Show loading placeholder while not mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-start gap-2 sm:gap-3 group hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
        <div className="mt-0.5 flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-start gap-2 sm:gap-3 group hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}