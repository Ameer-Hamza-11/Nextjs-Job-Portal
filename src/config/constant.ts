export const SESSION_LIFETIME = 30 * 24 * 60 * 60;
export const SESSION_REFRESH_TIME = SESSION_LIFETIME / 2;

export const SALARY_CURRENCY = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "INR",
  "NPR",
] as const;

export const SALARY_PERIOD = ["hourly", "monthly", "yearly"] as const;

export const JOB_TYPE = ["remote", "hybrid", "on-site"] as const;

export const WORK_TYPE = [
  "full-time",
  "part-time",
  "contract",
  "temporary",
  "freelance",
] as const;

export const JOB_LEVEL = [
  "internship",
  "entry level",
  "junior",
  "mid level",
  "senior level",
  "lead",
  "manager",
  "director",
  "executive",
] as const;

export const MIN_EDUCATION = [
  "none",
  "high school",
  "undergraduate",
  "masters",
  "phd",
] as const;

import {
  LayoutDashboard,
  Search,
  Briefcase,
  Bookmark,
  Settings,
} from "lucide-react"; // Icons example

// Employer Sidebar Menu
export const employerSidebarLinks = [
  { label: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
  { label: "Find Talents", href: "/employer/talents", icon: Search },
  // ... other employer links
];

// Applicant Sidebar Menu (Jo aapne upar list di hai)
export const applicantSidebarLinks = [
  {
    label: "Dashboard",
    href: "/applicant/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Find Jobs",
    href: "/applicant/find-jobs",
    icon: Search,
  },
  {
    label: "My Applications",
    href: "/applicant/applications",
    icon: Briefcase,
  },
  {
    label: "Saved Jobs",
    href: "/applicant/saved-jobs",
    icon: Bookmark,
  },
  {
    label: "Profile / Settings",
    href: "/applicant/settings",
    icon: Settings,
  },
];
