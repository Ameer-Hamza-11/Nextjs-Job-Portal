"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Download,
  FileText,
  UserCircle,
  Briefcase,
  Trash2,
  Mail,
  Calendar,
  Clock,
  MapPin,
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
import { useRouter } from "next/navigation";

const RecentApplications = ({ applications }: { applications: any[] }) => {
  const router = useRouter();

  async function handleDelete(applicantId: number) {
    const { status, message } = await deleteApplicationAction(applicantId);

    if (status === "SUCCESS") {
      toast.success(message);
      router.refresh();
    } else {
      toast.error(message);
    }
  }

  return (
    <div className="container-custom py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Received Applications
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          Review and manage candidates who applied to your job postings.
        </p>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="card-ui py-12 sm:py-16 text-center border-dashed">
          <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
          <h3 className="text-base sm:text-lg font-semibold">
            No applications yet
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            When candidates apply, they will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden lg:block card-ui overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Candidate</TableHead>
                  <TableHead className="min-w-[150px]">Role</TableHead>
                  <TableHead className="min-w-[120px]">Date</TableHead>
                  <TableHead className="text-right min-w-[200px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {applications.map((app) => {
                  const { application, job, user, resume } = app;

                  return (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 relative rounded-full overflow-hidden bg-muted flex-shrink-0">
                            {user.avatarUrl ? (
                              <Image
                                src={user.avatarUrl}
                                alt={user.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <UserCircle className="h-full w-full text-muted-foreground" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{user.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="font-medium">{job.title}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {job.jobType}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(application.appliedAt), {
                          addSuffix: true,
                        })}
                      </TableCell>

                      <TableCell className="text-right">
                        <ActionButtons
                          application={application}
                          resume={resume}
                          user={user}
                          onDelete={handleDelete}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* ================= MOBILE / TABLET CARDS ================= */}
          <div className="grid gap-3 sm:gap-4 lg:hidden">
            {applications.map((app) => {
              const { application, job, user, resume } = app;

              return (
                <div
                  key={application.id}
                  className="card-ui p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4 hover:shadow-md transition-shadow"
                >
                  {/* Header Section with User Info */}
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 relative rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <UserCircle className="h-full w-full text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base sm:text-lg truncate">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground flex-shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Job Details Section */}
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium text-sm sm:text-base">
                        {job.title}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {job.jobType}
                      </Badge>
                    </div>

                    {/* Additional job info if available */}
                    {job.location && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{job.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Application Date */}
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground pt-1">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Applied</span>
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1" />
                    <span>
                      {formatDistanceToNow(new Date(application.appliedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <ActionButtons
                      application={application}
                      resume={resume}
                      user={user}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default RecentApplications;

/* ================= ACTION BUTTONS COMPONENT ================= */
const ActionButtons = ({ application, resume, user, onDelete }: any) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Cover Letter */}
      {application.coverLetter && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 sm:gap-2 flex-1 sm:flex-none min-w-[90px]"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">
                <span className="hidden xs:inline">Cover</span> Letter
              </span>
            </Button>
          </DialogTrigger>

          <DialogContent className="w-[95%] sm:w-full max-w-md mx-auto rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">
                Cover Letter: {user.name}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 p-3 sm:p-4 bg-muted rounded-lg text-xs sm:text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
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
          className="gap-1 sm:gap-2 flex-1 sm:flex-none min-w-[90px]"
        >
          <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">
              <span className="hidden xs:inline">View</span> Resume
            </span>
          </a>
        </Button>
      ) : (
        <Button size="sm" disabled variant="secondary" className="flex-1 sm:flex-none">
          <span className="text-xs sm:text-sm">No Resume</span>
        </Button>
      )}

      {/* Delete */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1 sm:flex-none min-w-[70px]"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm ml-1 hidden xs:inline">
              Delete
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[95%] sm:w-full max-w-md mx-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Delete Application
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this application? This action cannot
            be undone.
          </p>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => {}}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => onDelete(application.applicantId)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};