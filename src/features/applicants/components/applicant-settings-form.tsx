"use client";

import { useForm, Controller } from "react-hook-form";
import {
  User,
  MapPin,
  Calendar,
  Flag,
  Briefcase,
  Globe,
  UploadCloud,
  Loader,
  Mail,
  Phone,
  Heart,
  GraduationCap,
  Award,
  Save,
  UserCircle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  applicantSettingsSchema,
  ApplicantSettingsSchema,
} from "../applicant.schema";
import Tiptap from "@/components/text-editor";
import { ImageUpload } from "@/features/employers/components/employer-setting-form";
import { cn } from "@/lib/utils";
import { ResumeUpload } from "./resume-upload";
import { saveApplicantProfile } from "../actions/applicant.action";
import { toast } from "sonner";
import { ApplicantProfileType } from "../server/applicant.queries";

interface ApplicantSettingsFormProps {
  initialData: ApplicantProfileType | null;
}

const ApplicantSettingsForm = ({ initialData }: ApplicantSettingsFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ApplicantSettingsSchema>({
    resolver: zodResolver(applicantSettingsSchema),
    defaultValues: initialData || {
      email: "",
    },
  });

  const isUpdating = !!initialData?.location;

  const onSubmit = async (data: ApplicantSettingsSchema) => {
    console.log("Saving Data:", data);

    try {
      const res = await saveApplicantProfile(data);
      if (res.status === "SUCCESS") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Form Submission Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {isUpdating ? "Edit Profile" : "Complete Your Profile"}
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            {isUpdating
              ? "Update your professional information to attract more employers"
              : "Set up your profile to start applying for jobs"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          {/* Basic Information Card */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
              <CardDescription className="text-sm">
                This is how employers will see you. Make a great first impression!
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-6 bg-gray-50 rounded-xl">
                <Controller
                  name="avatarUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="text-center">
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        className={cn(
                          fieldState.error && "ring-2 ring-red-500 rounded-full",
                          "h-24 w-24 sm:h-28 sm:w-28"
                        )}
                      />
                      {fieldState.error && (
                        <p className="text-xs text-red-500 mt-2">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Max file size: 5MB
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Supported formats: JPG, PNG
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Recommended: Square image, 150x150px
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...register("name")}
                      placeholder="John Doe"
                      className={cn(
                        "pl-10 h-11 text-sm",
                        errors.name && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...register("email")}
                      placeholder="john@example.com"
                      className="pl-10 h-11 text-sm bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-semibold">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...register("phoneNumber")}
                      placeholder="+1 234 567 890"
                      className={cn(
                        "pl-10 h-11 text-sm",
                        errors.phoneNumber && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold">
                    Location
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...register("location")}
                      placeholder="New York, USA"
                      className={cn(
                        "pl-10 h-11 text-sm",
                        errors.location && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-xs text-red-500">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Details Card */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-600" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-semibold">
                    Date of Birth
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="date"
                      {...register("dateOfBirth")}
                      className={cn(
                        "pl-10 h-11 text-sm",
                        errors.dateOfBirth && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality" className="text-sm font-semibold">
                    Nationality
                  </Label>
                  <div className="relative">
                    <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...register("nationality")}
                      placeholder="American"
                      className={cn(
                        "pl-10 h-11 text-sm",
                        errors.nationality && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.nationality && (
                    <p className="text-xs text-red-500">{errors.nationality.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-semibold">
                    Gender
                  </Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className={cn(
                            "h-11 text-sm",
                            errors.gender && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-xs text-red-500">{errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus" className="text-sm font-semibold">
                    Marital Status
                  </Label>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className={cn(
                            "h-11 text-sm",
                            errors.maritalStatus && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.maritalStatus && (
                    <p className="text-xs text-red-500">{errors.maritalStatus.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Profile Card */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Professional Profile
              </CardTitle>
              <CardDescription className="text-sm">
                Highlight your skills and experience to stand out
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="education" className="text-sm font-semibold">
                    Highest Education
                  </Label>
                  <Controller
                    name="education"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className={cn(
                            "h-11 text-sm",
                            errors.education && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select Education" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="high school">High School</SelectItem>
                          <SelectItem value="undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="masters">Masters</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.education && (
                    <p className="text-xs text-red-500">{errors.education.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-semibold">
                    Years of Experience
                  </Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...register("experience")}
                      placeholder="e.g., 5 Years"
                      className={cn(
                        "pl-10 h-11 text-sm",
                        errors.experience && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.experience && (
                    <p className="text-xs text-red-500">{errors.experience.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl" className="text-sm font-semibold">
                  Portfolio Website
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    {...register("websiteUrl")}
                    placeholder="https://yourportfolio.com"
                    className={cn(
                      "pl-10 h-11 text-sm",
                      errors.websiteUrl && "border-red-500"
                    )}
                  />
                </div>
                {errors.websiteUrl && (
                  <p className="text-xs text-red-500">{errors.websiteUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Biography</Label>
                <Controller
                  name="biography"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div>
                      <Tiptap content={field.value} onChange={field.onChange} />
                      {fieldState.error && (
                        <p className="text-xs text-red-500 mt-2">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <Separator className="my-4" />

              {/* Resume Upload */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                  Resume / CV
                </Label>

                <Controller
                  name="resumeUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div>
                      <ResumeUpload
                        value={field.value}
                        onChange={(url, name, size) => {
                          field.onChange(url);
                          setValue("resumeName", name, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setValue("resumeSize", size, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                      />
                      {fieldState.error && (
                        <p className="text-xs text-red-500 mt-2">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="sticky bottom-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Save className="h-4 w-4" />
              {isDirty ? (
                <span>You have unsaved changes</span>
              ) : (
                <span>All changes saved</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="w-full sm:w-auto min-w-[180px] h-11 gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                {isSubmitting
                  ? isUpdating
                    ? "Updating..."
                    : "Saving..."
                  : isUpdating
                    ? "Update Profile"
                    : "Save Profile"}
              </Button>

              {!isDirty && !isSubmitting && (
                <p className="text-xs text-gray-400 hidden sm:block">
                  ✓ All information is up to date
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicantSettingsForm;