"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyForJobAction } from "../actions/apply-job.action";
import { toast } from "sonner";
import { Loader2, ArrowRight, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { applyJobSchema, ApplyJobSchema } from "../../apply-job.schema";

interface ApplyJobModalProps {
  jobId: number;
  jobTitle: string;
  hasApplied: boolean;
  resumes: { id: number; fileName: string }[];
}

export const ApplyJobModal = ({
  jobId,
  jobTitle,
  hasApplied,
  resumes,
}: ApplyJobModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplyJobSchema>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      jobId,
      resumeId: resumes.length === 1 ? resumes[0].id : undefined,
      coverLetter: "",
    },
  });

  const onSubmit = async (data: ApplyJobSchema) => {
    try {
      const res = await applyForJobAction(data);

      if (res.status === "SUCCESS") {
        toast.success(res.message);
        setIsOpen(false);
        reset();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  if (hasApplied) {
    return (
      <Button
        disabled
        className="w-full sm:w-auto bg-gray-100 text-gray-500 cursor-not-allowed"
      >
        Already Applied
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto gap-2 text-sm sm:text-base h-10 sm:h-11">
          Apply Now <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] w-[95%] max-w-[95%] sm:max-w-[500px] rounded-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg md:text-xl">
            Apply Job: {jobTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">
          {/* Resume Select */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold">
              Choose Resume <span className="text-destructive">*</span>
            </Label>

            {resumes.length === 0 ? (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs sm:text-sm text-destructive">
                  No resume found. Please upload a resume in your profile settings first.
                </p>
              </div>
            ) : (
              <Controller
                name="resumeId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full h-10 sm:h-11 text-sm sm:text-base",
                        errors.resumeId && "border-destructive"
                      )}
                    >
                      <SelectValue placeholder="Choose Resume" />
                    </SelectTrigger>

                    <SelectContent>
                      {resumes.map((resume) => (
                        <SelectItem
                          key={resume.id}
                          value={String(resume.id)}
                          className="text-sm sm:text-base"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="truncate">{resume.fileName}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}

            {errors.resumeId && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.resumeId.message}
              </p>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold">
              Cover Letter <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
            </Label>
            <Textarea
              {...register("coverLetter")}
              placeholder="Introduce yourself briefly and explain why you're a great fit for this role..."
              className="min-h-[120px] sm:min-h-[150px] w-full text-sm sm:text-base resize-y"
            />
            {errors.coverLetter && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.coverLetter.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || resumes.length === 0}
              className="w-full sm:w-auto gap-2 h-10 sm:h-11 text-sm sm:text-base"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />}
              {isSubmitting ? "Applying..." : "Apply Now"}
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Helper for cn function if not imported
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}