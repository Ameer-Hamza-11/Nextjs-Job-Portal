import {
  EmployerFilterParams,
  getAllEmployersProfileAction,
} from "@/features/applicants/actions/applicant.action";
import EmployerFilters from "@/features/applicants/components/employer-filters";
import EmployerListPage from "@/features/applicants/components/employer-list";
import React from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const filters: EmployerFilterParams = {
    search:
      typeof resolvedParams.search === "string"
        ? resolvedParams.search
        : undefined,
    organizationType:
      typeof resolvedParams.organizationType === "string"
        ? resolvedParams.organizationType
        : undefined,
  };

  const result = await getAllEmployersProfileAction(filters);

  if (result.status === "ERROR") {
    return (
      <div className="flex items-center justify-center p-20">
        <h1 className="text-xl font-semibold text-red-500">
          {result.message ?? "Something went wrong"}
        </h1>
      </div>
    );
  }

  const { data } = result;

  const formattedData = result.data.map((item) => ({
    id: item.users.id,
    name: item.employers?.name ?? item.users.name,
    industry: item.employers?.organizationType ?? "Not Provided",
    employees: item.employers?.teamSize ?? "Not Provided",
    logo: item.users.avatarUrl ?? item.employers?.bannerImageUrl ?? null,
  }));

  return (
    <div className="p-6">
      <EmployerFilters/>
      {
        data.length > 0 ? (
          <EmployerListPage data={formattedData} />
        )
        : (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center">
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No Company found
          </h3>
          <p className="text-gray-500">
            Check back later.
          </p>
        </div>
        )
      }
     
    </div>
  );
}
