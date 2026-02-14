"use client";

import ApplicantSettingsForm from "@/features/applicants/components/applicant-settings-form";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your personal information and professional profile.
        </p>
      </div>

      <ApplicantSettingsForm />
    </div>
  );
}
