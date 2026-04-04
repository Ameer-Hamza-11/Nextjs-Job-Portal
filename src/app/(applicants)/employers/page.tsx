import { getAllEmployersProfileAction } from "@/features/applicants/actions/applicant.action";
import EmployerListPage from "@/features/applicants/components/employer-list";
import React from "react";

export default async function Page() {
  const result = await getAllEmployersProfileAction();

  if (result.status !== "SUCCESS" || !result.data) {
    return (
      <div className="flex items-center justify-center p-20">
        <h1 className="text-xl font-semibold text-red-500">
          {result.message ?? "Something went wrong"}
        </h1>
      </div>
    );
  }

  const formattedData = result.data.map((item) => ({
    id: item.users.id,
    name: item.employers?.name ?? item.users.name,
    industry: item.employers?.organizationType ?? "Not Provided",
    employees: item.employers?.teamSize ?? "Not Provided",
    logo: item.users.avatarUrl ?? item.employers?.bannerImageUrl ?? null,
  }));

  return (
    <div className="p-6">
      <EmployerListPage data={formattedData} />
    </div>
  );
}