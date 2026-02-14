import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, Eye, CheckCircle2, MapPin } from "lucide-react";
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

// Mock Data to match your screenshot
const RECENT_APPLICATIONS = [
  {
    id: 1,
    title: "Networking Engineer",
    type: "Remote",
    location: "Washington",
    salary: "$50k-80k/month",
    date: "Feb 2, 2026 19:28",
    status: "Active",
    logo: "/companies/google.png", // Replace with real logos or placeholders
    company: "Google",
    typeColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  {
    id: 2,
    title: "Product Designer",
    type: "Full Time",
    location: "Dhaka",
    salary: "$50k-80k/month",
    date: "Dec 7, 2025 23:26",
    status: "Active",
    logo: "/companies/dribbble.png",
    company: "Dribbble",
    typeColor: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  },
  {
    id: 3,
    title: "Junior Graphic Designer",
    type: "Temporary",
    location: "Brazil",
    salary: "$50k-80k/month",
    date: "Feb 2, 2026 19:28",
    status: "Active",
    logo: "/companies/apple.png",
    company: "Apple",
    typeColor: "bg-blue-100 text-blue-700 hover:bg-blue-100", // Adjusted to match generic blue
  },
];

export function RecentApplications() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-6">
        <h3 className="font-semibold text-gray-900">Recently Applied</h3>
        <Link
          href="/dashboard/applied-jobs"
          className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

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
          {RECENT_APPLICATIONS.map((job) => (
            <TableRow key={job.id} className="hover:bg-gray-50">
              {/* Job Info Column */}
              <TableCell className="pl-6 py-4">
                <div className="flex items-start gap-4">
                  {/* Logo Placeholder */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                    {job.company.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {job.title}
                      </span>
                      <Badge
                        className={`rounded-full px-2 py-0.5 text-[10px] font-normal border-0 ${job.typeColor}`}
                      >
                        {job.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {job.location}
                      </span>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Date Column */}
              <TableCell className="text-sm text-gray-500">
                {job.date}
              </TableCell>

              {/* Status Column */}
              <TableCell>
                <div className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  {job.status}
                </div>
              </TableCell>

              {/* Action Column */}
              <TableCell className="text-right pr-6">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium"
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { ArrowRight } from "lucide-react"; // Forgot to import this in the snippet above
