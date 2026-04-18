import React from "react";
import Link from "next/link";
import { Home, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoBackButton from "@/components/go-back-button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full mx-auto text-center">

        {/* Animated 404 */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <h1 className="relative text-8xl sm:text-9xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              404
            </h1>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link href="/" className="flex-1">
            <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>

          <Link href="/jobs" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Briefcase className="w-4 h-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Go Back */}
        <div className="mt-6">
          <GoBackButton />
        </div>

        {/* Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <Link href="/">Home</Link>
            <Link href="/jobs">Jobs</Link>
            <Link href="/companies">Companies</Link>
            <Link href="/contact">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;