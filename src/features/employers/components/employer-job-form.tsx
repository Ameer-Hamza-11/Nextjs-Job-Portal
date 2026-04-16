"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JOB_LEVEL,
  JOB_TYPE,
  MIN_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/config/constant";
import { cn } from "@/lib/utils";
import {
  Award,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  Loader,
  MapPin,
  Tag,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Tiptap from "@/components/text-editor";
import { JobFormData, jobSchema } from "../jobs/jobs.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createJobAction,
  updateJobAction,
} from "@/features/server/jobs.actions";
import { useRouter } from "next/navigation";

interface JobPostFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export const JobForm = ({
  initialData,
  isEditMode = false,
}: JobPostFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          expiresAt: initialData.expiresAt
            ? new Date(initialData.expiresAt).toISOString().split("T")[0]
            : "",
        }
      : {
          title: "",
          description: "",
          jobType: undefined,
          workType: undefined,
          jobLevel: undefined,
          location: "",
          tags: "",
          minSalary: "",
          maxSalary: "",
          salaryCurrency: undefined,
          salaryPeriod: undefined,
          minEducation: undefined,
          experience: "",
          expiresAt: "",
        },
  });

  const router = useRouter();

  const handleFormSubmit = async (data: JobFormData) => {
    try {
      let response;
      if (isEditMode && initialData) {
        response = await updateJobAction(initialData.id, data);
      } else {
        response = await createJobAction(data);
      }
      if (response.status === "SUCCESS") {
        toast.success(response.message);
        router.push("/employer-dashboard/jobs");
      } else toast.error(response.message);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm sm:text-base font-semibold">
              Job Title <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="title"
                type="text"
                placeholder="e.g., Senior Frontend Developer"
                className={cn(
                  "pl-10 text-sm sm:text-base h-10 sm:h-11",
                  errors.title && "border-destructive"
                )}
                {...register("title")}
                aria-invalid={!!errors.title}
              />
            </div>
            {errors.title && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.title.message as string}
              </p>
            )}
          </div>

          {/* Job Type, Work Type, Job Level - Responsive Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Job Type */}
            <div className="space-y-2">
              <Label htmlFor="jobType" className="text-sm sm:text-base font-semibold">
                Job Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="jobType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="jobType"
                        className={cn(
                          "pl-10 w-full h-10 sm:h-11 text-sm sm:text-base",
                          errors.jobType && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPE.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.jobType && (
                <p className="text-xs sm:text-sm text-destructive">
                  {errors.jobType.message as string}
                </p>
              )}
            </div>

            {/* Work Type */}
            <div className="space-y-2">
              <Label htmlFor="workType" className="text-sm sm:text-base font-semibold">
                Work Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="workType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="workType"
                        className={cn(
                          "pl-10 w-full h-10 sm:h-11 text-sm sm:text-base",
                          errors.workType && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        {WORK_TYPE.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.workType && (
                <p className="text-xs sm:text-sm text-destructive">
                  {errors.workType.message as string}
                </p>
              )}
            </div>

            {/* Job Level */}
            <div className="space-y-2">
              <Label htmlFor="jobLevel" className="text-sm sm:text-base font-semibold">
                Job Level <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="jobLevel"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="jobLevel"
                        className={cn(
                          "pl-10 w-full h-10 sm:h-11 text-sm sm:text-base",
                          errors.jobLevel && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select job level" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_LEVEL.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.jobLevel && (
                <p className="text-xs sm:text-sm text-destructive">
                  {errors.jobLevel.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Location and Tags - Responsive Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm sm:text-base font-semibold">
                Location <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., New York, NY or Remote"
                  className={cn(
                    "pl-10 h-10 sm:h-11 text-sm sm:text-base",
                    errors.location && "border-destructive"
                  )}
                  {...register("location")}
                  aria-invalid={!!errors.location}
                />
              </div>
              {errors.location && (
                <p className="text-xs sm:text-sm text-destructive">
                  {errors.location.message as string}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm sm:text-base font-semibold">
                Tags <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="tags"
                  type="text"
                  placeholder="e.g., React, TypeScript, Node.js"
                  className={cn(
                    "pl-10 h-10 sm:h-11 text-sm sm:text-base",
                    errors.tags && "border-destructive"
                  )}
                  {...register("tags")}
                  aria-invalid={!!errors.tags}
                />
              </div>
              {errors.tags && (
                <p className="text-xs sm:text-sm text-destructive">
                  {errors.tags.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Salary Information - Responsive Grid */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold">
              Salary Information <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
            </Label>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {/* Min Salary */}
              <div className="space-y-2">
                <Label htmlFor="minSalary" className="text-xs sm:text-sm">
                  Min Salary
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="minSalary"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g., 50000"
                    className={cn(
                      "pl-10 h-10 sm:h-11 text-sm sm:text-base",
                      errors.minSalary && "border-destructive"
                    )}
                    {...register("minSalary")}
                    aria-invalid={!!errors.minSalary}
                  />
                </div>
                {errors.minSalary && (
                  <p className="text-xs sm:text-sm text-destructive">
                    {errors.minSalary.message as string}
                  </p>
                )}
              </div>

              {/* Max Salary */}
              <div className="space-y-2">
                <Label htmlFor="maxSalary" className="text-xs sm:text-sm">
                  Max Salary
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="maxSalary"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g., 80000"
                    className={cn(
                      "pl-10 h-10 sm:h-11 text-sm sm:text-base",
                      errors.maxSalary && "border-destructive"
                    )}
                    {...register("maxSalary")}
                    aria-invalid={!!errors.maxSalary}
                  />
                </div>
                {errors.maxSalary && (
                  <p className="text-xs sm:text-sm text-destructive">
                    {errors.maxSalary.message as string}
                  </p>
                )}
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="salaryCurrency" className="text-xs sm:text-sm">
                  Currency
                </Label>
                <Controller
                  name="salaryCurrency"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="salaryCurrency"
                        className={cn(
                          "w-full h-10 sm:h-11 text-sm sm:text-base",
                          errors.salaryCurrency && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {SALARY_CURRENCY.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.salaryCurrency && (
                  <p className="text-xs sm:text-sm text-destructive">
                    {errors.salaryCurrency.message as string}
                  </p>
                )}
              </div>

              {/* Period */}
              <div className="space-y-2">
                <Label htmlFor="salaryPeriod" className="text-xs sm:text-sm">
                  Period
                </Label>
                <Controller
                  name="salaryPeriod"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="salaryPeriod"
                        className={cn(
                          "w-full h-10 sm:h-11 text-sm sm:text-base",
                          errors.salaryPeriod && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        {SALARY_PERIOD.map((period) => (
                          <SelectItem key={period} value={period}>
                            {period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.salaryPeriod && (
                  <p className="text-xs sm:text-sm text-destructive">
                    {errors.salaryPeriod.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Education and Experience - Responsive Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {/* Minimum Education */}
            <div className="space-y-2">
              <Label htmlFor="minEducation" className="text-sm sm:text-base font-semibold">
                Minimum Education <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
              </Label>
              <Controller
                name="minEducation"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="minEducation"
                        className={cn(
                          "pl-10 w-full h-10 sm:h-11 text-sm sm:text-base",
                          errors.minEducation && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {MIN_EDUCATION.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.minEducation && (
                <p className="text-xs sm:text-sm text-destructive">
                  {errors.minEducation.message as string}
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="text-sm sm:text-base font-semibold">
                Expiry Date <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="expiresAt"
                  type="date"
                  className={cn(
                    "pl-10 h-10 sm:h-11 text-sm sm:text-base",
                    errors.expiresAt && "border-destructive"
                  )}
                  {...register("expiresAt")}
                  aria-invalid={!!errors.expiresAt}
                />
              </div>
              {errors.expiresAt && (
                <p className="text-xs sm:text-sm text-destructive">
                  {errors.expiresAt.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-sm sm:text-base font-semibold">
              Experience Requirements <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
            </Label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="experience"
                type="text"
                placeholder="e.g., 3+ years of React development"
                className={cn(
                  "pl-10 h-10 sm:h-11 text-sm sm:text-base",
                  errors.experience && "border-destructive"
                )}
                {...register("experience")}
                aria-invalid={!!errors.experience}
              />
            </div>
            {errors.experience && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.experience.message as string}
              </p>
            )}
          </div>

          {/* Job Description */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-semibold">
                  Job Description <span className="text-destructive">*</span>
                </Label>
                <Tiptap
                  content={field.value}
                  onChange={(value) => field.onChange(value)}
                />
                {fieldState.error && (
                  <p className="text-xs sm:text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[140px] h-10 sm:h-11 text-sm sm:text-base"
            >
              {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              {isEditMode
                ? isSubmitting
                  ? "Saving..."
                  : "Update Job"
                : isSubmitting
                  ? "Posting..."
                  : "Post Job"}
            </Button>
            {!isDirty && !isEditMode && (
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                Fill in the form to post a new job
              </p>
            )}
            {isEditMode && !isDirty && (
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                No changes to save
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};