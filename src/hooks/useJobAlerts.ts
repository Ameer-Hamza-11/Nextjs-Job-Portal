"use client";

import { createJobAlertAction } from "@/features/employers/jobs/server/jobs.action";
// import { createJobAlertAction } from "@/features/applicants/actions/job-alert.actions";
import { toast } from "sonner";

export const useJobAlerts = () => {
  const createAlert = async (filters: any) => {
    try {
      const res = await createJobAlertAction(filters);

      if (res.status === "SUCCESS") {
        toast.success("Job alert saved!");
      } else {
        toast.error(res.message || "Failed to save alert");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return { createAlert };
};