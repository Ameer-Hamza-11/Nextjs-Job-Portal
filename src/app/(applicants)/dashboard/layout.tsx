import ApplicantSidebar from "@/features/applicants/components/applicant-sidebar";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) return redirect("/login");
  if (user.role !== "applicant") return redirect("/employer-dashboard");

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      {/* Sidebar */}
      <ApplicantSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}