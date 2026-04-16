import { JobFilters } from "@/features/applicants/jobs/components/job-filters";
import { JobCard } from "@/features/employers/jobs/components/jobCard";
import {
  getAllJobs,
  JobFilterParams,
} from "@/features/employers/jobs/server/jobs.queries";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Briefcase } from "lucide-react";

// Add cn function at the top
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const currentPage = Number(resolvedParams.page) || 1;
  const ITEMS_PER_PAGE = 9;

  const filters: JobFilterParams = {
    search: typeof resolvedParams.search === "string" ? resolvedParams.search : undefined,
    jobType: typeof resolvedParams.jobType === "string" ? resolvedParams.jobType : undefined,
    jobLevel: typeof resolvedParams.jobLevel === "string" ? resolvedParams.jobLevel : undefined,
    workType: typeof resolvedParams.workType === "string" ? resolvedParams.workType : undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  };

  const { jobs, totalCount } = await getAllJobs(filters);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (currentPage === 1) {
    endPage = Math.min(totalPages, 3);
  } else if (currentPage === totalPages) {
    startPage = Math.max(1, totalPages - 2);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    Object.entries(resolvedParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, String(value));
      }
    });
    params.set("page", pageNum.toString());
    return `/jobs?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 lg:mb-10 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Find Your Next Dream Job
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl lg:mx-0 mx-auto">
            Browse through thousands of job opportunities from top companies worldwide.
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-6 sm:mb-8">
          <JobFilters />
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{jobs.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalCount}</span> jobs
          </p>
        </div>

        {/* Jobs Grid */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center p-8">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Briefcase className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md">
              We couldn't find any jobs matching your criteria. Try adjusting your filters or check back later.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-200">
            <Pagination>
              <PaginationContent className="flex-wrap gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
                    className={cn(
                      "text-sm sm:text-base",
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>

                {visiblePages.map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={createPageUrl(pageNum)}
                      isActive={currentPage === pageNum}
                      className="text-sm sm:text-base min-w-[2.5rem] h-9 sm:h-10"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
                    className={cn(
                      "text-sm sm:text-base",
                      currentPage === totalPages && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}