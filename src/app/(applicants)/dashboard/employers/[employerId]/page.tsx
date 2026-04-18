"use client";

import { getEmployerProfileAction } from "@/features/applicants/actions/applicant.action";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  Calendar,
  Globe,
  MapPin,
  Mail,
  Phone,
  Building2,
  Award,
  Link2,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type PageParams = {
  params: {
    employerId: string;
  };
};

const Page = ({ params }: PageParams) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { employerId } = await params;
      const res = await getEmployerProfileAction(employerId);
      
      if (res.status === "ERROR") {
        setError(res.message);
      } else {
        setData(res.data);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [params]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Building2 className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-red-500 mb-2">{error}</h1>
          <p className="text-gray-500">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  const { users, employers } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Simple Banner - No overlapping elements */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
        {employers?.bannerImageUrl ? (
          <Image
            src={employers.bannerImageUrl}
            alt="Company Banner"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/10 text-8xl sm:text-9xl font-bold">
                {employers?.name?.charAt(0) || "C"}
              </div>
            </div>
          </div>
        )}

        {/* Share Button */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10"
            onClick={handleCopyLink}
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Profile Content - Avatar inside card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header with Avatar */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                  {users.avatarUrl ? (
                    <Image
                      src={users.avatarUrl}
                      alt={users.name}
                      width={144}
                      height={144}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">
                        {users.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {/* Online Status Indicator */}
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {users.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    @{users.userName}
                  </Badge>
                  {employers?.organizationType && (
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {employers.organizationType}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 text-gray-600 justify-center sm:justify-start">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{users.email}</span>
                  </div>
                  {users.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{users.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  {employers?.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1">Company Profile</p>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
                onClick={() => window.open(employers?.websiteUrl || "#", "_blank")}
              >
                <Globe className="h-4 w-4" />
                Visit Website
              </Button>
            </div>

            {/* Description */}
            {employers?.description && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  About the Company
                </h3>
                <div
                  className="text-gray-600 leading-relaxed text-sm sm:text-base prose prose-sm sm:prose-base max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: employers.description,
                  }}
                />
              </div>
            )}
          </div>

          {/* Company Information Grid */}
          <div className="p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Company Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <InfoCard
                icon={<Building2 className="h-4 w-4 text-blue-600" />}
                label="Organization Type"
                value={employers?.organizationType?.replace(/-/g, " ") || "Not specified"}
                bgColor="blue"
              />

              <InfoCard
                icon={<Users className="h-4 w-4 text-green-600" />}
                label="Team Size"
                value={`${employers?.teamSize || "Not specified"} employees`}
                bgColor="green"
              />

              <InfoCard
                icon={<Calendar className="h-4 w-4 text-purple-600" />}
                label="Year Established"
                value={employers?.yearOfEstablishment || "Not specified"}
                bgColor="purple"
              />

              <InfoCard
                icon={<MapPin className="h-4 w-4 text-orange-600" />}
                label="Location"
                value={employers?.location || "Not specified"}
                bgColor="orange"
              />

              <div className="group p-4 sm:p-5 rounded-xl bg-gray-50 hover:bg-cyan-50 transition-all duration-300 border border-gray-100 hover:border-cyan-200 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                    <Globe className="h-4 w-4 text-cyan-600" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                    Website
                  </p>
                </div>
                {employers?.websiteUrl ? (
                  <a
                    href={employers.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline text-sm sm:text-base break-all inline-flex items-center gap-1"
                  >
                    <Link2 className="h-3 w-3" />
                    {employers.websiteUrl.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                  </a>
                ) : (
                  <p className="font-semibold text-gray-500 text-sm sm:text-base">
                    Not specified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 p-6 sm:p-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                size="lg"
                asChild
              >
                <a href={`mailto:${users.email}`}>
                  <Mail className="h-4 w-4" />
                  Contact Company
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2"
                asChild
              >
                <a href={employers?.websiteUrl || "#"} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                  Visit Website
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2"
                onClick={handleCopyLink}
              >
                <Share2 className="h-4 w-4" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

// Helper Component for Info Cards
const InfoCard = ({ icon, label, value, bgColor }: any) => {
  const colorClasses: Record<string, string> = {
    blue: "hover:bg-blue-50 hover:border-blue-200",
    green: "hover:bg-green-50 hover:border-green-200",
    purple: "hover:bg-purple-50 hover:border-purple-200",
    orange: "hover:bg-orange-50 hover:border-orange-200",
  };

  const iconBgClasses: Record<string, string> = {
    blue: "bg-blue-100 group-hover:bg-blue-200",
    green: "bg-green-100 group-hover:bg-green-200",
    purple: "bg-purple-100 group-hover:bg-purple-200",
    orange: "bg-orange-100 group-hover:bg-orange-200",
  };

  return (
    <div className={`group p-4 sm:p-5 rounded-xl bg-gray-50 transition-all duration-300 border border-gray-100 ${colorClasses[bgColor]}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg transition-colors ${iconBgClasses[bgColor]}`}>
          {icon}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="font-semibold text-gray-900 text-sm sm:text-base capitalize">
        {value}
      </p>
    </div>
  );
};