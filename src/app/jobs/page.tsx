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
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Briefcase } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const currentPage = Number(resolvedParams.page) || 1;
  const ITEMS_PER_PAGE = 3;

  const filters: JobFilterParams = {
    search: typeof resolvedParams.search === "string" ? resolvedParams.search : undefined,
    jobType: typeof resolvedParams.jobType === "string" ? resolvedParams.jobType : undefined,
    jobLevel: typeof resolvedParams.jobLevel === "string" ? resolvedParams.jobLevel : undefined,
    workType: typeof resolvedParams.workType === "string" ? resolvedParams.workType : undefined,
    location: typeof resolvedParams.location === "string" ? resolvedParams.location : undefined,
    minSalary: typeof resolvedParams.minSalary === "string" ? Number(resolvedParams.minSalary) : undefined,
    maxSalary: typeof resolvedParams.maxSalary === "string" ? Number(resolvedParams.maxSalary) : undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  };

  const { jobs, totalCount } = await getAllJobs(filters);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();

    Object.entries(resolvedParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, String(value));
    });

    params.set("page", String(page));
    return `/jobs?${params.toString()}`;
  };

  const getPages = () => {
    let pages: (number | string)[] = [];

    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  console.log({ totalCount, totalPages, currentPage });
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Find Your Next Job</h1>
          <p className="text-muted-foreground mt-1">
            Browse available opportunities
          </p>
        </div>

        <JobFilters />

        {/* Jobs */}
        {jobs.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>

                  <PaginationItem>
                    <PaginationPrevious
                      href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {getPages().map((page, i) => (
                    <PaginationItem key={i}>
                      {page === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href={createPageUrl(Number(page))}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed py-20 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No jobs found</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}