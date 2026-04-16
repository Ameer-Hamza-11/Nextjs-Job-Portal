"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Clock, Briefcase, Banknote, Star, ArrowRight } from "lucide-react";
import { JobCardType } from "../server/jobs.queries";
import { useTransition, useState } from "react";
import { toggleFavoriteJobAction } from "../server/jobs.action";
import { toast } from "sonner";

interface JobCardProps {
  job: JobCardType;
}

export const JobCard = ({ job }: JobCardProps) => {
  const [isFavorite, setIsFavorite] = useState(job.isFavorite || false);
  const [isPending, startTransition] = useTransition();

  const formatSalary = () => {
    if (!job.minSalary || !job.maxSalary) return "Not Disclosed";
    return `${job.salaryCurrency} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`;
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    startTransition(async () => {
      const res = await toggleFavoriteJobAction(job.id);
      if (res.status === "ADDED") {
        setIsFavorite(true);
        toast.success("Added to favorites");
      } else if (res.status === "REMOVED") {
        setIsFavorite(false);
        toast.success("Removed from favorites");
      }
    });
  };

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1"
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavorite}
        disabled={isPending}
        className="absolute top-4 right-4 z-10 rounded-full p-1.5 transition-all hover:bg-gray-100 disabled:opacity-50"
      >
        <Star
          className={`h-5 w-5 transition-all ${
            isFavorite 
              ? "fill-yellow-400 text-yellow-500" 
              : "text-gray-300 hover:text-yellow-400"
          }`}
        />
      </button>

      {/* Header: Logo & Title */}
      <div className="flex items-start gap-3 sm:gap-4 pr-8">
        {/* Company Logo */}
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
          {job.companyLogo ? (
            <Image
              src={job.companyLogo}
              alt={job.companyName || "Company Logo"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 font-bold text-gray-400 text-sm">
              {job.companyName?.slice(0, 2).toUpperCase() || "CO"}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base">
            {job.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
            {job.companyName}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        <div className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-600">
          <MapPin className="h-3 w-3" />
          <span className="truncate max-w-[100px]">{job.location || "Remote"}</span>
        </div>
        <div className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-600">
          <Briefcase className="h-3 w-3" />
          {job.workType?.replace(/-/g, " ").toUpperCase() || "Full Time"}
        </div>
        <div className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-600">
          <Banknote className="h-3 w-3" />
          <span className="truncate max-w-[120px]">{formatSalary()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-gray-100 pt-3 sm:pt-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </span>

        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:gap-2 transition-all">
          View Details
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
};