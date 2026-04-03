import React from "react";
import Link from "next/link";
import { Home, Briefcase } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn’t find the page you’re looking for. <br /> It might
          have been removed, renamed, or did not exist in the first place.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/" className="flex items-center justify-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
            <Home className="w-5 h-5" />
            Go to Home
          </Link>

          <Link href="/jobs" className="flex items-center justify-center gap-2 px-5 py-2 bg-accent text-foreground rounded-lg hover:bg-accent/90 transition">
            <Briefcase className="w-5 h-5" />
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;