"use client";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Download,
  FileText,
  UserCircle,
  Briefcase,
  Trash2,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { deleteApplicationAction } from "@/features/server/employer.action";
import { toast } from "sonner";
import React from "react";

const RecentApplications = ({ applications }: { applications: any[] }) => {
    
  async function handleDelete(applicantId: number) {
    const confirmed = window.confirm("Are you sure you want to delete this application?");
    if (!confirmed) return;
    const { status, message } = await deleteApplicationAction(applicantId);

    status === "SUCCESS" ? toast.success(message) : toast.error(message);
  }
  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Received Applications
        </h2>
        <p className="text-muted-foreground">
          Review and manage candidates who applied to your job postings.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            No applications yet
          </h3>
          <p className="text-gray-500">
            When candidates apply to your jobs, they will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-md border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Candidate</TableHead>
                <TableHead>Applied Role</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {applications.map((app) => {
                const { application, job, user, resume } = app;

                return (
                  <TableRow
                    key={application.id}
                    className="hover:bg-gray-50/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 relative rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border">
                          {user.avatarUrl ? (
                            <Image
                              src={user.avatarUrl}
                              alt={user.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <UserCircle className="h-full w-full text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-none mb-1">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <Badge
                          variant="secondary"
                          className="mt-1 font-normal text-xs"
                        >
                          {job.jobType}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(application.appliedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </TableCell>

                    {/* ------------ Actions Column ------------ */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Cover Letter */}
                        {application.coverLetter && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                              >
                                <FileText className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                  Cover Letter
                                </span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>
                                  Cover Letter: {user.name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border">
                                {application.coverLetter}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Resume */}
                        {resume?.fileUrl ? (
                          <Button
                            size="sm"
                            asChild
                            className="gap-2 bg-blue-600 hover:bg-blue-700"
                          >
                            <a href={resume.fileUrl} target="_blank">
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">Resume</span>
                            </a>
                          </Button>
                        ) : (
                          <Button size="sm" disabled variant="secondary">
                            No Resume
                          </Button>
                        )}

                        {/* ---------- DELETE BUTTON ---------- */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Application</DialogTitle>
                            </DialogHeader>

                            <p className="text-sm text-gray-600">
                              Are you sure you want to delete this application?
                              <br />
                              This action cannot be undone.
                            </p>

                            <form
                              action={() =>
                                handleDelete(application.applicantId)
                              }
                              className="mt-4 flex justify-end"
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={application.id}
                              />
                              <Button type="submit" variant="destructive">
                                Delete
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RecentApplications;
