"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreVertical, Building2, Users, Briefcase, MapPin, Globe, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EmployerType = {
  id: string | number;
  name: string;
  industry: string;
  employees: string;
  logo?: string | null;
  location?: string;
  website?: string;
  founded?: number;
};

export default function EmployerListPage({
  data,
}: {
  data: EmployerType[];
}) {
  const [hoveredCard, setHoveredCard] = useState<string | number | null>(null);

  return (
    <div className="w-full">
      {/* Results Count */}
      <div className="mb-4 sm:mb-6 flex justify-between items-center flex-wrap gap-2">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{data.length}</span> companies
        </p>
      </div>

      {/* ========== LIST GRID ========== */}
      {data.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center p-8">
          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Building2 className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No companies found
          </h3>
          <p className="text-sm sm:text-base text-gray-500 max-w-md">
            We couldn't find any companies matching your criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {data.map((item) => (
            <Card
              key={item.id}
              className={`
                group rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 
                border border-gray-100 overflow-hidden hover:border-blue-200 
                hover:-translate-y-1 cursor-pointer
              `}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Header with Gradient Background */}
              <div className="relative h-24 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="absolute -bottom-8 left-4">
                  {/* Logo */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white shadow-lg border-4 border-white overflow-hidden flex items-center justify-center">
                    {item.logo ? (
                      <Image
                        src={item.logo}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Menu Button */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/employers/${item.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Share Company</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardContent className="pt-12 pb-4 sm:pb-5 px-4 sm:px-5">
                {/* Company Name */}
                <CardTitle className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </CardTitle>
                
                {/* Industry Badge */}
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-lg mb-3">
                  <Briefcase className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600 capitalize">
                    {item.industry?.replace(/-/g, " ")}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">
                      <span className="font-medium text-gray-700">Employees:</span> {item.employees}
                    </span>
                  </div>
                  
                  {item.location && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                  
                  {item.founded && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>Founded {item.founded}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm h-9 sm:h-10" 
                    asChild
                  >
                    <Link href={`/employers/${item.id}`}>View Details</Link>
                  </Button>
                  
                  {item.website && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-9 w-9 sm:h-10 sm:w-10"
                      asChild
                    >
                      <a href={item.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}